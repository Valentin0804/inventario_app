import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MetodoPago {
  id?: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})

export class MetodoPagoService {
  private baseUrl = 'http://localhost:3000/api/metodosPago';

  constructor(private http: HttpClient) {}

  // Crear proveedor
  addMetodoPago(MetodoPago: MetodoPago): Observable<MetodoPago> {
    return this.http.post<MetodoPago>(this.baseUrl, MetodoPago);
  }

  // Listar todos
  getMetodosPagos(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(this.baseUrl);
  }

  // Obtener por ID
  getMetodoPago(id: number): Observable<MetodoPago> {
    return this.http.get<MetodoPago>(`${this.baseUrl}/${id}`);
  }

  // Actualizar
  updateMetodoPago(id: number, MetodoPago: MetodoPago): Observable<MetodoPago> {
    return this.http.put<MetodoPago>(`${this.baseUrl}/${id}`, MetodoPago);
  }

  // Eliminar
  deleteMetodoPago(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
