import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {

  private baseUrl = "http://localhost:3000/api/mercadopago";

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
