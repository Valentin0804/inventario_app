import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  // 2. Inyecta el HttpClient y el Router en el constructor
  constructor(private http: HttpClient, private router: Router) {}

  // 3. Esta función se llamará cuando se envíe el formulario
  onLogin() {
    const credentials = {
      email: this.email,
      password: this.password
    };

    // Hacemos la petición POST al backend
    this.http.post('/api/auth/login', credentials).subscribe({
      // Si la petición es exitosa (código 200)
      next: (response: any) => {
        console.log('Login exitoso!', response);

        // Guardamos el token en el almacenamiento local del navegador
        localStorage.setItem('auth_token', response.accessToken);

        // Redirigimos al usuario al dashboard
        this.router.navigate(['/dashboard']);
      },
      // Si hay un error (código 400, 401, 404, 500)
      error: (err) => {
        console.error('Error en el login:', err);
        alert('Error: ' + err.error.message); // Muestra el mensaje de error del backend
      }
    });
  }
}