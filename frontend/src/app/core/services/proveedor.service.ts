import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Proveedor {
  id?: number;
  nombre: string;
  telefono: string;
  direccion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  private baseUrl = `${environment.apiUrl}/api/proveedores`;

  constructor(private http: HttpClient) {}

  // Crear proveedor
  addProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.baseUrl, proveedor);
  }

  // Listar todos
  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.baseUrl);
  }

  // Obtener por ID
  getProveedorById(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.baseUrl}/${id}`);
  }

  // Actualizar
  updateProveedor(id: number, proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.baseUrl}/${id}`, proveedor);
  }

  // Eliminar
  deleteProveedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
