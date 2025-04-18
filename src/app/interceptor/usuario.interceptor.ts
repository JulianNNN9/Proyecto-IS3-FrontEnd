import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PublicoService } from '../services/publico.service';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor HTTP para gestionar la autenticación de usuarios
 * Se encarga de añadir el token a cada petición y manejar las respuestas de error de autenticación
 * @param req - La petición HTTP original
 * @param next - El siguiente manejador en la cadena de interceptores
 * @returns Observable con la respuesta HTTP
 */
export const usuarioInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyección de servicios necesarios
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  
  // Comprueba si la solicitud es para un endpoint público
  const isAPiPublico = req.url.includes("api/publico");
  
  // Si el usuario no está autenticado o la petición es pública, continúa sin modificar
  if (!tokenService.isLogged() || isAPiPublico) {
    return next(req);
  }
  
  // Obtiene el token de autenticación
  const token = tokenService.getToken();
  
  // Clona la petición original añadiendo el token en los encabezados
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  
  // Procesa la petición modificada y maneja posibles errores
  return next(authReq).pipe(
    catchError(error => {
      // Si el token ha expirado, intenta renovarlo automáticamente
      if (error.error.respuesta === 'El token esta vencido') {
        // Solicita un nuevo token usando el método refresh
        return authService.refresh().pipe(
          switchMap(newToken => {
            // Guarda el nuevo token recibido
            tokenService.setToken(newToken.respuesta.token);
            
            // Crea una nueva petición con el token renovado
            const newAuthReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken.respuesta.token}` }
            });
            
            // Reintenta la solicitud original con el nuevo token
            return next(newAuthReq);
          })
        );
      }
      
      // Si el error no está relacionado con la expiración del token, lo propaga
      return throwError(() => error);
    })
  );
};