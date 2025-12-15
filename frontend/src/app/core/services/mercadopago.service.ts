import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MercadoPagoService {
    private baseUrl = `${environment.apiUrl}/api/mercadopago`;
  

  constructor(private http: HttpClient) {}

  generarQR(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/crear-qr`, data);
  }

  estadoPago(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/estado/${id}`);
  }

  verificarEstadoPago(externalReference: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/estado/${externalReference}`);
  }
}
