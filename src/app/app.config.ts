import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { QuejaSugerenciaService } from './services/queja-sugerencia.service';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ReporteService } from './services/reporte.service';
import { usuarioInterceptor } from './interceptor/usuario.interceptor';
import { AdminService } from './services/admin.service';
import { TokenService } from './services/token.service';
import { PublicoService } from './services/publico.service';
import { ClienteService } from './services/cliente.service';
import { AuthService } from './services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(
      withFetch(),
      withInterceptors([usuarioInterceptor])),
    AdminService,
    TokenService,
    ReporteService,
    PublicoService,
    ClienteService,
    AuthService,
    QuejaSugerenciaService, provideAnimationsAsync()
  ]
};