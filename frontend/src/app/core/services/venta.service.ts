import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Datos que espera el Backend
export interface Venta {
  metodopago_id: number;
  items: {
    producto_id: number;
    cantidad: number;
  }[];
}

@Injectable({
  providedIn: 'root',
})

export class VentaService {
  private baseUrl = 'http://localhost:3000/api/ventas';

  constructor(private http: HttpClient) {}

  // Guardar Venta
  addVenta(venta: Venta): Observable<Venta> {
    return this.http.post<Venta>(this.baseUrl, venta);
  }

  // Listar todas las ventas
  getVenta(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Obtener por ID
  getVentaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Actualizar
  updateVenta(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // Eliminar
  deleteVenta(id: number, password: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { body: { password } });
  }
}