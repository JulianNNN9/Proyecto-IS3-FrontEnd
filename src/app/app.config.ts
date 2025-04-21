import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { usuarioInterceptor } from './interceptor/usuario.interceptor';
import { AdminService } from './services/admin.service';
import { TokenService } from './services/token.service';
import { PublicoService } from './services/publico.service';
import { ClienteService } from './services/cliente.service';
import { AuthService } from './services/auth.service';
import { AuthAdminClienteGuard } from './guardians/auth-admin-cliente.guard';
import { AuthAdminGuard } from './guardians/auth-admin.guard';
import { AuthClienteGuard } from './guardians/auth-cliente.guard';
import { LoginGuard } from './guardians/login.guard';

/**
 * Configuración principal de la aplicación
 * Define todos los proveedores y servicios necesarios para el funcionamiento de la app
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),  // Proveedor para el enrutamiento de la aplicación
    provideHttpClient(      // Configuración del cliente HTTP
      withFetch(),          // Utiliza la API fetch para las peticiones HTTP
      withInterceptors([usuarioInterceptor])),  // Agrega interceptor para manejo de autenticación
    
    // Registro de los servicios principales de la aplicación
    AdminService,     // Servicio para operaciones administrativas
    TokenService,     // Servicio para gestión de tokens de autenticación
    PublicoService,   // Servicio para operaciones públicas (sin autenticación)
    ClienteService,   // Servicio para operaciones de clientes autenticados
    AuthService,      // Servicio de autenticación
    AuthAdminClienteGuard,
    AuthAdminGuard,
    AuthClienteGuard,
    LoginGuard,
    provideAnimationsAsync()  // Soporte para animaciones cargadas de forma asíncrona
  ]
};