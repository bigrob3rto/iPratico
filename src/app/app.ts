import { Component, OnInit, signal, inject, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { StreamService, ScrapeResponse } from './stream.service'; // Import service
import { TableModule } from 'primeng/table'; // 👈 Import Table module
import { ProgressBarModule } from 'primeng/progressbar';
import { differenceInDays } from 'date-fns';
import * as XLSX from 'xlsx';
import { ApiService } from './api.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, DatePickerModule, FormsModule, TableModule, ProgressBarModule, CurrencyPipe
  ], // 
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})

export class App implements OnInit {
  protected readonly title = signal('iPratico');
  date_start: Date = new Date(2026, 4, 1); // Opens to January 2026  
  date_end: Date = new Date(2026, 4, 3); // Opens to June 2026
  scrapeResultsList: ScrapeResponse[] = [];
  // Inject your custom stream service
  private scrapeStreamService = inject(StreamService);
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef); // 2. Inject detection framework
  loading: boolean = false; // To track loading state 
  loading_value: number = 0; // To track progress value

  closures: any[] = [];

  ngOnInit(): void {
  }


  // Method to find total by documentType
  getTotalByType(path:any, type: string): number {
    const item = path.totalPerDocumentType.find((d: { documentType: string; }) => d.documentType === type);
    return item ? item.total : 0; // Returns 0 if not found
  }

  /********************************************************************** */
  async handleApiCall(event: MouseEvent) {
    console.log('Api button was clicked!', event);
    // Your API call logic goes here

    this.apiService.getStatistics().subscribe({
      next: (response) => {
        this.closures = response;
        console.log('Response:', response);
      },
      error: (error) => {
        console.error('Errore API:', error);
      },
      complete: () => {
        console.log('Richiesta completata');
        this.cdr.detectChanges();
      }
    });
  }


  /**********************************************************************/
  async handleScrape(event: MouseEvent) {
    console.log('Scrape button was clicked!', event);
    console.log('Selected Start Date:', this.date_start);
    console.log('Selected End Date:', this.date_end);
    // Your scraping logic goes here (e.g., using date_start and date_end)

    const diffInDays = differenceInDays(this.date_end, this.date_start) + 1; // diff in days
    this.loading = true; // Start loading spinner 
    this.loading_value = 0; // Reset progress value

    const currentDate = new Date(this.date_start.getTime());
    // Set times to midnight to ensure clean day-by-day comparisons
    while (currentDate <= this.date_end) {

      // do scrape for currentDate
      const response = await this.scrapeStreamService.getScrapeStream(currentDate);
      console.log('Stream received data:', response);
      // 1. Filter out old matching day records to prevent table row duplication
      const cleanExistingList = this.scrapeResultsList.filter(item => item.day !== response.day);

      // 2. Append the response to the existing data array list
      this.scrapeResultsList = [...cleanExistingList, response].sort(
        (a, b) => a.day.localeCompare(b.day)
      );

      // 3. Force change detection cycle right now
      this.cdr.detectChanges();
      currentDate.setDate(currentDate.getDate() + 1); // +1 day

      this.loading_value += Math.floor(100 / diffInDays); // Increment progress value based on days processed
      this.cdr.detectChanges();
    }
    this.loading = false; // Stop loading spinner after all data is processed
    this.cdr.detectChanges();
  }

  clearTable() {
    // If using Signals:
    this.scrapeResultsList = [];
    this.cdr.detectChanges();
  }

  exportExcel(): void {
    // 1. Transform nested data into a flat array structure for SheetJS
    const exportData = this.scrapeResultsList.map(data => ({
      'Giorno': data.day,
      'INCASSO TOT': data.result?.incasso,
      'Annulli': data.result?.annulli,
      'Addebiti': data.result?.addebiti,
      'INCASSO PRANZO': data.result_pranzo?.incasso,
      'INCASSO CENA': data.result_cena?.incasso,
      'COPERTI': data.result?.coperti,
      'COPERTI PRANZO': data.result_pranzo?.coperti,
      'COPERTI CENA': data.result_cena?.coperti
    }));

    // 2. Generate the worksheet from the clean JSON object array
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // 3. Create workbook and append sheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dati Scraper');

    // 4. Trigger download
    XLSX.writeFile(workbook, 'Report_Incassi.xlsx');
  }
}