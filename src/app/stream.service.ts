import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, firstValueFrom, throwError } from 'rxjs';
import { environment } from './environment'; // Import environment variables

// The exact JSON structure returned by your server
export interface ScrapeResponse {
  day: string;
  result: {
    incasso: string;
    coperti: number;
    addebiti: string;
    annulli: string;
  };
  result_pranzo: {
    incasso: string;
    coperti: number;
  };
  result_cena: {
    incasso: string;
    coperti: number;
  };
}

@Injectable({
  providedIn: 'root'
})

export class StreamService {
  private http = inject(HttpClient);
  //private baseUrl = 'http://192.168.1.101:3000/scrape';
  // http://gig3tto.duckdns.org:3000/
  //private baseUrl = 'http://gig3tto.duckdns.org:3000/scrape';
  //private baseUrl = 'https://scraper-gigtto6996-nrcrc2g1.leapcell.dev/scrape';

  // Helper method to convert a JavaScript Date to local YYYY-MM-DD safely
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Triggers the scraper and returns an observable stream of the JSON response
   * @param day formatted string 'YYYY-MM-DD'
   */
  // 1. Changed return type from Observable to Promise
  getScrapeStream(day: Date): Promise<ScrapeResponse> {
    const params = new HttpParams()
      .set('key', environment.CRON_SECRET) // Add your secret key for authentication
      .set('day', this.formatDate(day))

    // 2. Wrap the http observable pipeline inside firstValueFrom()
    return firstValueFrom(
      this.http.get<ScrapeResponse>(environment.baseUrl, { params }).pipe(
        catchError((error) => {
          console.error('Stream operation failed:', error);
          return throwError(() => new Error('Failed to fetch scrape stream.'));
        })
      )
    );
  }
}

