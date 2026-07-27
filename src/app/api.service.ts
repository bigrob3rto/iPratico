import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) { }

    getOrders(): Observable<any> {
        const apiUrl = 'https://apicb.ipraticocloud.com/api/public/orders';

        const headers = new HttpHeaders({
            'accept': 'application/json',
            'x-api-key': '19305:67f36e11-8645-452b-afaa-46f15d792a15',
            'dateFrom': '2026-05-01',
            'dateTo': '2026-05-03'
        });

        return this.http.get<any>(apiUrl, { headers });
    }

    geClosures(): Observable<any> {
        const apiUrl = 'https://apicb.ipraticocloud.com/api/public/closure';
        //const apiUrl = 'https://apicb.ipraticocloud.com/api/public/closed-payment-sessions';

        const headers = new HttpHeaders({
            'accept': 'application/json',
            'x-api-key': '19305:67f36e11-8645-452b-afaa-46f15d792a15'
        });

        // Create Date objects with specific times: 11:00:00 and 18:00:00
        // Note: Month is 0-indexed (4 = May)
        const dateFrom = new Date(2026, 5, 1, 11, 0, 0);  // May 1, 2026 at 11:00 AM
        const dateTo = new Date(2026, 5, 1, 18, 0, 0);    // May 3, 2026 at 6:00 PM

        const params = new HttpParams()
            .set('dateFrom', dateFrom.toISOString()) // Sends: 2026-05-01T11:00:00.000Z
            .set('dateTo', dateTo.toISOString());    // Sends: 2026-05-03T18:00:00.000Z


        return this.http.get<any>(apiUrl, {
            headers,
            params
        });
    }
}