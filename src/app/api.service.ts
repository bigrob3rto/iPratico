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

        const params = new HttpParams()
            .set('dateFrom', '2026-05-01')
            .set('dateTo', '2026-05-03');

        return this.http.get<any>(apiUrl, {
            headers,
            params
        });
    }
}