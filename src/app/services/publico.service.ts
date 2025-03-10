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

@Injectable({
  providedIn: 'root',
})
export class PublicoService {
  private authURL = 'https://locproyecto-is3-backend-production.up.railway.appalhost:8080/api/publico';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  public crearUsuario(cuentaDTO: CrearUsuarioDTO): Observable<MensajeDTO<String>> {
    return this.http.post<MensajeDTO<String>>(
      `${this.authURL}/crear-usuario`,
      cuentaDTO
    );
  }
  public iniciarSesion(loginDTO: LoginDTO): Observable<MensajeDTO<TokenDTO>> {
    return this.http.post<MensajeDTO<TokenDTO>>(
      `${this.authURL}/iniciar-sesion`,
      loginDTO
    );
  }
  public enviarCodigoRecuperacion(correo: string): Observable<MensajeDTO<string>> {
    const params = new HttpParams().set('correo', correo);
    return this.http.get<MensajeDTO<string>>(
      `${this.authURL}/enviar-codigo-recuperacion`,
      { params }
    );
  }

  public enviarCodigoActivacion(correo: string): Observable<MensajeDTO<string>> {
    const params = new HttpParams().set('correo', correo);
    return this.http.get<MensajeDTO<string>>(
      `${this.authURL}/enviar-codigo-activacion`,
      { params }
    );
  }

  public activarCuenta(activarCuentaDTO: ActivarCuentaDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(
      `${this.authURL}/activar-cuenta`, 
      activarCuentaDTO
    );
  }

  public recuperarContrasenia(recuperarContraseniaDTO: RecuperarContraseniaDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(
      `${this.authURL}/recuperar-contrasenia`,
      recuperarContraseniaDTO
    );
  }
  public listarTiposPqrs(): Observable<MensajeDTO<string[]>> {
    return this.http.get<MensajeDTO<string[]>>(
      `${this.authURL}/quejas-sugerencias/listar-tipos`
    );
  }
  public listarEstadosPqrs(): Observable<MensajeDTO<string[]>> {
    return this.http.get<MensajeDTO<string[]>>(
      `${this.authURL}/quejas-sugerencias/listar-estados`
    );
  }
}