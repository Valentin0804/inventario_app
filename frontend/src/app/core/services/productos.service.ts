import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id?: number;
  codigo_barras?: string;
  nombre: string;
  marca?: string;
  precio_neto: number;
  porcentaje_ganancia: number;
  precio_final?: number;
  descripcion?: string;
  stock: number;
  alarma_stock?: number;
  categoria_id?: number; 
  proveedor_id?: number;
  usuario_id?: number;
}

@Injectable({
  providedIn: 'root',
})

export class ProductosService {
  private baseUrl = 'http://localhost:3000/api/productos';

  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.baseUrl);
  }

  // Obtener un producto por id
  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }

  // Crear un nuevo producto
  addProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.baseUrl, producto);
  }

  // Actualizar un producto
  updateProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/${id}`, producto);
  }

  // Eliminar un producto
  deleteProducto(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
