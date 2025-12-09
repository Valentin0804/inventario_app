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

  addProducto(producto: Producto, file: File | null) {
    return this.http.post<Producto>(
      this.baseUrl,
      this.buildFormData(producto, file)
    );
  }

  updateProducto(id: number, producto: Producto, file: File | null) {
    return this.http.put(
      `${this.baseUrl}/${id}`,
      this.buildFormData(producto, file)
    );
  }

  deleteProducto(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  private buildFormData(producto: Producto, file: File | null): FormData {
    const formData = new FormData();

    formData.append('nombre', producto.nombre);
    formData.append('precio_neto', String(producto.precio_neto));
    formData.append(
      'porcentaje_ganancia',
      String(producto.porcentaje_ganancia)
    );
    formData.append('stock', String(producto.stock));

    const optionalFields: any = {
      codigo_barras: producto.codigo_barras,
      marca: producto.marca,
      descripcion: producto.descripcion,
      alarma_stock: producto.alarma_stock,
      categoria_id: producto.categoria_id,
      proveedor_id: producto.proveedor_id,
    };

    for (const key in optionalFields) {
      if (optionalFields[key] !== undefined && optionalFields[key] !== null) {
        formData.append(key, String(optionalFields[key]));
      }
    }

    if (file) {
      formData.append('imagen', file);
    }

    return formData;
  }
}
