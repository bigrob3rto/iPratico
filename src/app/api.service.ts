import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly apiUrl = 'https://apicb.ipraticocloud.com/api/public/orders';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<any> {

    const headers = new HttpHeaders({
      'accept': 'application/json',
      'x-api-key': '19305:67f36e11-8645-452b-afaa-46f15d792a15'
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }
}