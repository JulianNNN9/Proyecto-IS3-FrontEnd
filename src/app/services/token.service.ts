import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Buffer } from 'buffer';

// Constante que define la clave para almacenar el token en sessionStorage
const TOKEN_KEY = 'AuthToken';

/**
 * Servicio para gestionar el token de autenticación
 * Proporciona métodos para almacenar, recuperar y decodificar el token JWT
 */
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  /**
   * Constructor del servicio
   * @param router Servicio para la navegación entre rutas
   */
  constructor(private router: Router) {}

  /**
   * Almacena el token en el sessionStorage
   * Elimina cualquier token anterior antes de guardar el nuevo
   * @param token Token JWT a almacenar
   */
  public setToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Obtiene el token almacenado en sessionStorage
   * @returns El token JWT o null si no existe
   */
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns true si existe un token almacenado, false en caso contrario
   */
  public isLogged(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  /**
   * Guarda el token y navega a la página principal
   * Método utilizado después de un inicio de sesión exitoso
   * @param token Token JWT recibido del servidor
   */
  public login(token: string) {
    this.setToken(token);
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  /**
   * Cierra la sesión del usuario
   * Elimina el token y todos los datos de sessionStorage
   */
  public logout() {
    window.sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  /**
   * Decodifica la parte de datos (payload) del token JWT
   * @param token Token JWT a decodificar
   * @returns Objeto con los datos contenidos en el token
   */
  private decodePayload(token: string): any {
    const payload = token!.split('.')[1];
    const payloadDecoded = Buffer.from(payload, 'base64').toString('ascii');
    const values = JSON.parse(payloadDecoded);
    return values;
  }

  /**
   * Obtiene el ID de cuenta del usuario desde el token
   * @returns ID de la cuenta del usuario o cadena vacía si no hay token
   */
  public getIDCuenta(): string {
    const token = this.getToken();
    if (token) {
      const values = this.decodePayload(token);
      return values.id;
    }
    return '';
  }

  /**
   * Obtiene el rol del usuario desde el token
   * @returns Rol del usuario (ADMIN, CLIENTE, etc.) o cadena vacía si no hay token
   */
  public getRol(): string {
    const token = this.getToken();
    if (token) {
      const values = this.decodePayload(token);
      return values.rol;
    }
    return '';
  }

  /**
   * Obtiene el nombre del usuario desde el token
   * @returns Nombre del usuario o cadena vacía si no hay token
   */
  public getNombre(): string {
    const token = this.getToken();
    if (token) {
      const values = this.decodePayload(token);
      return values.nombre;
    }
    return '';
  }
}