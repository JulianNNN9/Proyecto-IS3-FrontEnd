import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

/**
 * Servidor Express para Angular Server-Side Rendering (SSR)
 * Proporciona la infraestructura para renderizar la aplicación Angular en el servidor
 * 
 * Esta función es exportada para que pueda ser usada por funciones serverless
 * @returns Aplicación Express configurada
 */
export function app(): express.Express {
  // Crea una instancia de Express
  const server = express();
  
  // Configura las rutas para los archivos estáticos y el HTML del servidor
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  // Crea una instancia del motor de renderizado de Angular
  const commonEngine = new CommonEngine();

  // Configura el motor de vistas de Express
  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Ejemplo de endpoints de API REST en Express
  // server.get('/api/**', (req, res) => { });
  
  // Configuración para servir archivos estáticos desde /browser
  // maxAge: '1y' establece un tiempo de caché largo para mejorar el rendimiento
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  /**
   * Manejador principal para todas las rutas
   * Utiliza el motor de renderizado de Angular para generar HTML en el servidor
   */
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    // Renderiza la aplicación Angular utilizando el motor común
    commonEngine
      .render({
        bootstrap,                // Función de arranque de la aplicación
        documentFilePath: indexHtml,  // Plantilla HTML base
        url: `${protocol}://${headers.host}${originalUrl}`,  // URL solicitada
        publicPath: browserDistFolder,  // Ruta a los archivos estáticos
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],  // Proveedores adicionales
      })
      .then((html) => res.send(html))  // Envía el HTML generado como respuesta
      .catch((err) => next(err));      // Maneja posibles errores
  });

  return server;
}

/**
 * Función principal que inicia el servidor
 * Configura el puerto y pone en marcha la aplicación Express
 */
function run(): void {
  // Utiliza el puerto definido en las variables de entorno o 4000 por defecto
  const port = process.env['PORT'] || 4000;

  // Inicia el servidor Node
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Ejecuta la función para iniciar el servidor
run();