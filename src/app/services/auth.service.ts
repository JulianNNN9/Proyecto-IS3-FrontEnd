import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenDTO } from '../dto/token-dto';
import { TokenService } from './token.service';
import { MensajeDTO } from '../dto/mensaje-dto';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

/**
 * Servicio de autenticación
 * Encargado de gestionar operaciones relacionadas con la autenticación y el token JWT
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // URL base para las peticiones relacionadas con autenticación
  private authURL = 'http://localhost:8080/api/auth';

  /**
   * Constructor del servicio de autenticación
   * @param http Cliente HTTP para realizar peticiones al servidor
   * @param tokenService Servicio para manipular el token de autenticación
   */
  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  /**
   * Método para renovar el token de autenticación
   * Solicita un nuevo token usando el token actual
   * @returns Observable con el nuevo token generado
   */
  refresh(): Observable<MensajeDTO<TokenDTO>> {
    const token: string | null = this.tokenService.getToken();
    return this.http.get<MensajeDTO<TokenDTO>>(
      `${this.authURL}/refresh?token=${token}`
    );
  }

  /**
   * Obtiene la información básica del usuario autenticado actualmente
   * Extrae y decodifica datos del token JWT almacenado
   * @returns Objeto con nombre y email del usuario, o null si no está autenticado
   */
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

  /**
   * Obtiene el rol del usuario autenticado actualmente
   * Extrae y decodifica el rol del token JWT almacenado
   * @returns Objeto con el rol del usuario, o null si no está autenticado
   */
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

  /**
   * Obtiene el ID del usuario autenticado actualmente
   * Extrae y decodifica el ID del token JWT almacenado
   * @returns Objeto con el ID del usuario, o null si no está autenticado
   */
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