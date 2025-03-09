import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { QuejaSugerenciaService } from './services/queja-sugerencia.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ReporteService } from './services/reporte.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(
      withFetch(),
    ),
    provideClientHydration(),
    QuejaSugerenciaService,
    ReporteService
  ]
};
