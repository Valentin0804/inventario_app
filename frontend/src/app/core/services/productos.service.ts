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
  imagen_url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private baseUrl = 'http://localhost:3000/api/productos';

  constructor(private http: HttpClient) {}

  // Obtener todos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.baseUrl);
  }

  // Obtener uno
  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }

  addProducto(producto: Producto, file: File | null): Observable<Producto> {
    const formData = new FormData();

    // Agregamos campo por campo al FormData
    formData.append('nombre', producto.nombre);
    formData.append('precio_neto', String(producto.precio_neto));
    formData.append(
      'porcentaje_ganancia',
      String(producto.porcentaje_ganancia)
    );
    formData.append('stock', String(producto.stock));

    // Solo los agregamos si tienen valor
    if (producto.codigo_barras)
      formData.append('codigo_barras', producto.codigo_barras);
    if (producto.marca) formData.append('marca', producto.marca);
    if (producto.descripcion)
      formData.append('descripcion', producto.descripcion);
    if (producto.alarma_stock)
      formData.append('alarma_stock', String(producto.alarma_stock));
    if (producto.categoria_id)
      formData.append('categoria_id', String(producto.categoria_id));
    if (producto.proveedor_id)
      formData.append('proveedor_id', String(producto.proveedor_id));

    // Agregamos la imagen
    if (file) {
      formData.append('imagen', file);
    }
    return this.http.post<Producto>(this.baseUrl, formData);
  }

  updateProducto(
    id: number,
    producto: Producto,
    file: File | null
  ): Observable<any> {
    const formData = new FormData();

    formData.append('nombre', producto.nombre);
    formData.append('precio_neto', String(producto.precio_neto));
    formData.append(
      'porcentaje_ganancia',
      String(producto.porcentaje_ganancia)
    );
    formData.append('stock', String(producto.stock));

    if (producto.marca) formData.append('marca', producto.marca);
    if (producto.descripcion)
      formData.append('descripcion', producto.descripcion);
    if (producto.alarma_stock)
      formData.append('alarma_stock', String(producto.alarma_stock));
    if (producto.categoria_id)
      formData.append('categoria_id', String(producto.categoria_id));
    if (producto.proveedor_id)
      formData.append('proveedor_id', String(producto.proveedor_id));

    if (file) {
      formData.append('imagen', file);
    }

    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }

  deleteProducto(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
