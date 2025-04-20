import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { LoginDTO } from '../dto/login-dto';
import { MensajeDTO } from '../dto/mensaje-dto';
import { TokenDTO } from '../dto/token-dto';
import { Observable } from 'rxjs';
import { ActivarCuentaDTO } from '../dto/cuenta/activar-cuenta-dto';
import { RecuperarContraseniaDTO } from '../dto/cuenta/recuperar-contrasenia-dto';
import { CrearUsuarioDTO } from '../dto/crear-usuario-dto';

/**
 * Servicio para operaciones públicas
 * Gestiona las peticiones que no requieren autenticación, como registro, 
 * inicio de sesión y recuperación de contraseña
 */
@Injectable({
  providedIn: 'root',
})
export class PublicoService {
  // URL base para las peticiones a la API pública
  private authURL = 'http://localhost:8080/api/publico';

  /**
   * Constructor del servicio
   * @param http Cliente HTTP para realizar peticiones al servidor
   * @param tokenService Servicio para gestionar el token de sesión
   */
  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  /**
   * Registra un nuevo usuario en el sistema
   * @param cuentaDTO Datos del usuario a crear
   * @returns Observable con mensaje de confirmación
   */
  public crearUsuario(cuentaDTO: CrearUsuarioDTO): Observable<MensajeDTO<String>> {
    return this.http.post<MensajeDTO<String>>(
      `${this.authURL}/crear-usuario`,
      cuentaDTO
    );
  }

  /**
   * Método principal para autenticar usuarios
   * @param loginDTO Credenciales de inicio de sesión (email y contraseña)
   * @returns Observable con el token de autenticación
   */
  public iniciarSesion(loginDTO: LoginDTO): Observable<MensajeDTO<TokenDTO>> {
    return this.http.post<MensajeDTO<TokenDTO>>(
      `${this.authURL}/iniciar-sesion`,
      loginDTO
    );
  }

  /**
   * Solicita el envío de un código de recuperación de contraseña
   * @param correo Email del usuario que olvidó su contraseña
   * @returns Observable con mensaje de confirmación
   */
  public enviarCodigoRecuperacion(correo: string): Observable<MensajeDTO<string>> {
    const params = new HttpParams().set('correo', correo);
    return this.http.get<MensajeDTO<string>>(
      `${this.authURL}/enviar-codigo-recuperacion`,
      { params }
    );
  }

  /**
   * Solicita el envío de un código para activar una cuenta nueva
   * @param correo Email de la cuenta que se desea activar
   * @returns Observable con mensaje de confirmación
   */
  public enviarCodigoActivacion(correo: string): Observable<MensajeDTO<string>> {
    const params = new HttpParams().set('correo', correo);
    return this.http.get<MensajeDTO<string>>(
      `${this.authURL}/enviar-codigo-activacion`,
      { params }
    );
  }

  /**
   * Procesa la activación de una cuenta de usuario
   * @param activarCuentaDTO Objeto con datos para la activación (email y código)
   * @returns Observable con mensaje de confirmación
   */
  public activarCuenta(activarCuentaDTO: ActivarCuentaDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(
      `${this.authURL}/activar-cuenta`, 
      activarCuentaDTO
    );
  }

  /**
   * Procesa el cambio de contraseña olvidada
   * @param recuperarContraseniaDTO Objeto con los datos para recuperar la contraseña
   * @returns Observable con mensaje de confirmación
   */
  public recuperarContrasenia(recuperarContraseniaDTO: RecuperarContraseniaDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(
      `${this.authURL}/recuperar-contrasenia`,
      recuperarContraseniaDTO
    );
  }

  /**
   * Obtiene los tipos de PQRS (Peticiones, Quejas, Reclamos y Sugerencias) disponibles
   * @returns Observable con lista de tipos de PQRS
   */
  public listarTiposPqrs(): Observable<MensajeDTO<string[]>> {
    return this.http.get<MensajeDTO<string[]>>(
      `${this.authURL}/quejas-sugerencias/listar-tipos`
    );
  }

  /**
   * Obtiene los estados posibles para las PQRS
   * @returns Observable con lista de estados de PQRS
   */
  public listarEstadosPqrs(): Observable<MensajeDTO<string[]>> {
    return this.http.get<MensajeDTO<string[]>>(
      `${this.authURL}/quejas-sugerencias/listar-estados`
    );
  }
}