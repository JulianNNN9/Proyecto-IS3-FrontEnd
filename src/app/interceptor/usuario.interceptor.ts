import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../servicios/token.service';
import { inject } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PublicoService } from '../servicios/publico.service';
import { AuthService } from '../servicios/auth.service';

export const usuarioInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const isAPiPublico = req.url.includes("api/publico");
  
  if (!tokenService.isLogged() || isAPiPublico) {
    return next(req);
  }
  const token = tokenService.getToken();
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return next(authReq).pipe(
    catchError(error => {
      if (error.error.respuesta === 'El token esta vencido') {
        // Intentar refrescar el token
        return authService.refresh().pipe(
          switchMap(newToken => {
            tokenService.setToken(newToken.respuesta.token);
            const newAuthReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken.respuesta.token}` }
            });
            return next(newAuthReq); // Reintenta la solicitud con el nuevo token
          })
        );
      }
      return throwError(() => error); // Lanza el error si no es un 401, usando la nueva sintaxis
    })
  );
};
