import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';

// --- 1. IMPORTA LO NECESARIO PARA LOS INTERCEPTORS ---
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';


bootstrapApplication(AppComponent, {
  // providers es donde se configura toda la inyección de dependencias
  providers: [
    // --- 2. CONFIGURACIÓN COMPLETA DE HTTPCLIENT CON INTERCEPTOR ---
    provideHttpClient(withInterceptorsFromDi()), // Habilita el sistema de interceptores
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,  // Registra nuestra clase de interceptor
      multi: true
    },

    // Tus otras configuraciones
    provideRouter(routes),
    importProvidersFrom(FormsModule)
  ]
});