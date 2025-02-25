import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearUsuarioDTO } from '../dto/crear-usuario-dto';
import { LoginDTO } from '../dto/login-dto';
import { MensajeDTO } from '../dto/mensaje-dto';
import { TokenDTO } from '../dto/token-dto';
import { InformacionEventoDTO } from '../dto/evento/informacion-evento-dto';
import { ItemEventoDTO } from '../dto/evento/item-evento-dto';
import { FiltrosEventosDTO } from '../dto/filtros-evento-dto';
import { NotificacionEventoDTO } from '../dto/evento/notificacion-evento-dto';
import { RecuperarContraseniaDTO } from '../dto/cuenta/recuperar-contrasenia-dto';
import { ActivarCuentaDTO } from '../dto/cuenta/activar-cuenta-dto';
import { TokenService } from './token.service';
import { CuponDTO } from '../dto/cupon/cupon-dto';

@Injectable({
  providedIn: 'root',
})
export class PublicoService {
  private authURL = 'http://localhost:8080/api/publico';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  //LISTO
  public crearUsuario(cuentaDTO: CrearUsuarioDTO): Observable<MensajeDTO<String>> {
    return this.http.post<MensajeDTO<String>>(
      `${this.authURL}/crear-usuario`,
      cuentaDTO
    );
  }
    //LISTO
  public iniciarSesion(loginDTO: LoginDTO): Observable<MensajeDTO<TokenDTO>> {
    return this.http.post<MensajeDTO<TokenDTO>>(
      `${this.authURL}/iniciar-sesion`,
      loginDTO
    );
  }
  public obtenerInformacionEvento(idEvento: string): Observable<MensajeDTO<InformacionEventoDTO>> {
    return this.http.get<MensajeDTO<InformacionEventoDTO>>(
      `${this.authURL}/eventos/obtener-informacion-evento/${idEvento}`
    );
  }

  public filtrarEventoItem(filtrosEventos: FiltrosEventosDTO): Observable<MensajeDTO<ItemEventoDTO[]>> {
    return this.http.post<MensajeDTO<ItemEventoDTO[]>>(
      `${this.authURL}/eventos/filtrar-evento-item`,
      filtrosEventos
    );
  }
  public filtrarEventoInfo(filtrosEventos: FiltrosEventosDTO): Observable<MensajeDTO<InformacionEventoDTO[]>> {
    return this.http.post<MensajeDTO<InformacionEventoDTO[]>>(
      `${this.authURL}/eventos/filtrar-evento-info`,
      filtrosEventos
    );
  }

  public buscarEvento(nombreEvento: string): Observable<MensajeDTO<ItemEventoDTO[]>> {
    return this.http.get<MensajeDTO<ItemEventoDTO[]>>(
      `${this.authURL}/eventos/buscar-evento/${nombreEvento}`
    );
  }

  public listarEventosPaginadosItem(pagina: number, tamano: number): Observable<MensajeDTO<ItemEventoDTO[]>> {
    const params = new HttpParams()
      .set('pagina', pagina)
      .set('tamano', tamano);  // Añade el tamaño como parámetro
    
    return this.http.get<MensajeDTO<ItemEventoDTO[]>>(
      `${this.authURL}/eventos/listar-eventos-paginados-item`,
      { params }
    );
  }
  public listarEventosPaginadosInfo(pagina: number, tamano: number): Observable<MensajeDTO<InformacionEventoDTO[]>> {
    const params = new HttpParams()
      .set('pagina', pagina)
      .set('tamano', tamano);  // Añade el tamaño como parámetro
    
    return this.http.get<MensajeDTO<InformacionEventoDTO[]>>(
      `${this.authURL}/eventos/listar-eventos-paginados-info`,
      { params }
    );
  }

  public listarEventos(): Observable<MensajeDTO<InformacionEventoDTO[]>> {
    return this.http.get<MensajeDTO<InformacionEventoDTO[]>>(
      `${this.authURL}/eventos/listar-eventos`
    );
  }
  public listarCiudades(): Observable<MensajeDTO<string[]>> {
    return this.http.get<MensajeDTO<string[]>>(
      `${this.authURL}/eventos/listar-ciudades`
    );
  }
  public listarTipoEventos(): Observable<MensajeDTO<string[]>> {
    return this.http.get<MensajeDTO<string[]>>(
      `${this.authURL}/eventos/listar-tipo-eventos`
    );
  }
  public listarEstadoEventos(): Observable<MensajeDTO<string[]>> {
    return this.http.get<MensajeDTO<string[]>>(
      `${this.authURL}/eventos/listar-estado-eventos`
    );
  }
  public obtenerCupon(idCupon: string): Observable<MensajeDTO<CuponDTO>> {
    return this.http.get<MensajeDTO<CuponDTO>>(
      `${this.authURL}/cupon/obtener-cupon/${idCupon}`
    );
  }
  public listarCupones(): Observable<MensajeDTO<CuponDTO[]>> {
    return this.http.get<MensajeDTO<CuponDTO[]>>(
      `${this.authURL}/cupon/listar-cupones`
    );
  }
  public listarTipoCupones(): Observable<MensajeDTO<string[]>> {
    return this.http.get<MensajeDTO<string[]>>(
      `${this.authURL}/cupon/listar-tipo-cupones`
    );
  }
  public listarEstadoCupones(): Observable<MensajeDTO<string[]>> {
    return this.http.get<MensajeDTO<string[]>>(
      `${this.authURL}/cupon/listar-estado-cupones`
    );
  }

  public notificarNuevoEvento(): Observable<MensajeDTO<NotificacionEventoDTO[]>> {
    return this.http.get<MensajeDTO<NotificacionEventoDTO[]>>(
      `${this.authURL}/eventos/notificar-nuevo-evento`
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
}
