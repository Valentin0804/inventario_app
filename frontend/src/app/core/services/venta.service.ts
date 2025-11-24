import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  // URL base de tu backend
  private baseUrl = 'http://localhost:3000/api/ventas';

  constructor(private http: HttpClient) {}

  // Crear proveedor
  addVenta(Venta: Venta): Observable<Venta> {
    return this.http.post<Venta>(this.baseUrl, Venta);
  }

  // Listar todos
  getVenta(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.baseUrl);
  }

  // Obtener por ID
  getVentaById(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.baseUrl}/${id}`);
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
