import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'DUEÑO' | 'EMPLEADO';
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
    private apiUrl = `${environment.apiUrl}/api/usuarios`;

  constructor(private http: HttpClient) {}

  // Obtener lista completa de usuarios/subcuentas
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // Obtener un solo usuario por ID
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  // Crear usuario (subcuenta)
  createUsuario(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/subcuenta`, data);
  }

  // Crear subcuenta (alias del de arriba por si lo querés usar explícito)
  crearSubcuenta(data: any): Observable<any> {
    return this.createUsuario(data);
  }

  // Actualizar un usuario existente
  actualizarUsuario(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Eliminar usuario por ID
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
