import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
checkPasswordStrength() {
throw new Error('Method not implemented.');
}
  nombre: string = '';
  email: string = '';
  password: string = '';
  acceptTerms: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  passwordStrength: number = 0;

  constructor(private authService: AuthService) {}

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
      password: this.password,
    };

    this.authService.registro(nuevoUsuario).subscribe({
      next: () => alert('Usuario registrado con éxito'),
      error: (err) =>
        alert('Error al registrar: ' + err.error?.message || err.message),
    });
    console.log('Registrando usuario:', {
      nombre: this.nombre,
      email: this.email,
      password: this.password,
    });

    // Ejemplo de manejo de éxito/error
    if (this.nombre && this.email && this.password) {
      this.successMessage = '¡Registro exitoso! Redirigiendo...';
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Por favor completa todos los campos';
      this.successMessage = '';
    }
  }
}
