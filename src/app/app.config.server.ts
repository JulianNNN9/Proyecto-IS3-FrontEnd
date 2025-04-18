import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

/**
 * Configuración específica para el servidor (Server-Side Rendering)
 * Define los proveedores necesarios para la renderización en el servidor
 */
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering() // Proveedor que habilita la renderización del lado del servidor
  ]
};

/**
 * Configuración final que combina la configuración base de la aplicación 
 * con la configuración específica del servidor
 * Esta configuración se exporta para ser utilizada en la inicialización de la aplicación
 */
export const config = mergeApplicationConfig(appConfig, serverConfig);