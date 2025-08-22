import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // necesario para ngModel
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true, // Usando standalone
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})

export class RegistroComponent {
  nombre = '';
  email = '';
  password = '';

  constructor(private http: HttpClient) {}

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
  }
}
