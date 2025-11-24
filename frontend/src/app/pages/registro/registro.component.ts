import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})

export class RegistroComponent {
  nombre: string = '';
  email: string = '';
  password: string = '';
  aceptaTerminos: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(private http: HttpClient) {}

  obtenerFortalezaContrasena(): string {
    if (!this.password) return '';
    
    const length = this.password.length;
    if (length < 4) return 'Débil';
    if (length < 6) return 'Regular';
    if (length < 8) return 'Buena';
    return 'Fuerte';
  }

  registrarse() {
    const nuevoUsuario = {
      nombre: this.nombre,
      email: this.email,
      password: this.password
    };

    this.http.post('/api/auth/registro', nuevoUsuario).subscribe({
      next: () => alert('Usuario registrado con éxito'),
      error: (err) => alert('Error al registrar: ' + err.error?.message || err.message)
    });
    console.log('Registrando usuario:', {
      nombre: this.nombre,
      email: this.email,
      password: this.password
    });
    
    // Ejemplo de manejo de éxito/error
    if (this.nombre && this.email && this.password) {
      this.mensajeExito = '¡Registro exitoso! Redirigiendo...';
      this.mensajeError = '';
    } else {
      this.mensajeError = 'Por favor completa todos los campos';
      this.mensajeExito = '';
    }
  }
}
