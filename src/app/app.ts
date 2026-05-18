import { Component, OnInit, signal, inject, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { StreamService, ScrapeResponse } from './stream.service'; // Import service
import { TableModule } from 'primeng/table'; // 👈 Import Table module
import { ProgressBarModule } from 'primeng/progressbar';
import { differenceInDays } from 'date-fns';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, DatePickerModule, FormsModule, TableModule, ProgressBarModule
  ], // 
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})

export class App implements OnInit {
  protected readonly title = signal('iPratico');
  date_start: Date = new Date(2026, 5, 1); // Opens to January 2026  
  date_end: Date = new Date(2026, 5, 3); // Opens to June 2026
  scrapeResultsList: ScrapeResponse[] = [];
  // Inject your custom stream service
  private scrapeStreamService = inject(StreamService);
  private cdr = inject(ChangeDetectorRef); // 2. Inject detection framework
  loading: boolean = false; // To track loading state 
  loading_value: number = 0; // To track progress value

  ngOnInit(): void {
  }


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
}