import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenDTO } from '../dto/token-dto';
import { TokenService } from './token.service';
import { MensajeDTO } from '../dto/mensaje-dto';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authURL = 'https://proyecto-is3-backend-production.up.railway.app:8080/api/auth';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  refresh(): Observable<MensajeDTO<TokenDTO>> {
    const token: string | null = this.tokenService.getToken();
    return this.http.get<MensajeDTO<TokenDTO>>(
      `${this.authURL}/refresh?token=${token}`
    );
  }

  obtenerUsuarioAutenticado() {
    const token = sessionStorage.getItem('AuthToken');
    if (!token) {
      return null;
    }

    try {
      const decodedToken: any = jwtDecode(token);

      console.log('Token decodificado:', decodedToken);

      return {
        nombre: decodedToken.nombre,  // Ajusta esto según el contenido del token
        email: decodedToken.sub,    // Ajusta esto según el contenido del token
      };
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  obtenerRolUsuario() {
    const token = sessionStorage.getItem('AuthToken');
    if (!token) {
      return null;
    }

    try {
      const decodedToken: any = jwtDecode(token);

      console.log('Token decodificado:', decodedToken);

      return {
        rol: decodedToken.rol,
      };
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  obtenerIdUsuario() {
    const token = sessionStorage.getItem('AuthToken');
    if (!token) {
      return null;
    }

    try {
      const decodedToken: any = jwtDecode(token);

      console.log('Token decodificado:', decodedToken);

      return {
        id: decodedToken.id,
      };
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }
}
