import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

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


    /*************************************************************************** */
    getStatistics(dateFrom: Date, dateTo: Date): Observable<any> {
        const apiUrl = 'https://apiportal.ipraticocloud.com/statistics/data';

        const params = new HttpParams()
            .set('channel', 'lct_19305,lct_19305')
            .set('training', '1')
            .set('dateFrom', dateFrom.toISOString()) // Sends: 2026-05-01T11:00:00.000Z
            .set('dateTo', dateTo.toISOString())   // Sends: 2026-05-03T18:00:00.000Z
            .set('cashed', '1')
            .set('referenceDate', '1')
            .set('filterOrderFrom', '')
            .set('includeAffiliations', '1')
            .set('application', 'eat')
        //.set('timeSlot', '11:00:00.000-18:00:00.000');      // pranzo
        //.set('timeSlot', '19:00:00.000-02:00:00.000');      // cena


        const headers = new HttpHeaders({
            'Accept': 'application/json',
            'Authorization': 'OychwWuvExJ3lm6cX3kFZ6cPUzam3IkLuUj9vCx6'
        });

        // base request (total)
        const req = this.http.get<any>(apiUrl, { headers, params });

        // pranzo (lunch) - timeSlot set
        const paramsPranzo = params.set('timeSlot', '11:00:00.000-18:00:00.000');
        const req_pranzo = this.http.get<any>(apiUrl, { headers, params: paramsPranzo });

        // cena (dinner) - timeSlot set
        const paramsCena = params.set('timeSlot', '19:00:00.000-02:00:00.000');
        const req_cena = this.http.get<any>(apiUrl, { headers, params: paramsCena });

        // Return an observable that emits when all three requests complete
        return forkJoin([req, req_pranzo, req_cena]);
    }
}