import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { TokenDTO } from '../dto/token-dto';
import { TokenService } from './token.service';
import { IniciarSesionDTO } from '../dto/cuenta/iniciar-sesion-dto';
import { CrearUsuarioDTO } from '../dto/cuenta/crear-usuario-dto';


@Injectable({
  providedIn: 'root',
})
export class PublicoService {
  
  private authURL = 'http://localhost:8080/api/publico';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  public iniciarSesion(iniciarSesionDTO: IniciarSesionDTO): Observable<MensajeDTO<TokenDTO>> {
    return this.http.post<MensajeDTO<TokenDTO>>(
      `${this.authURL}/iniciar-sesion`,
      iniciarSesionDTO
    );
  }

  
  public crearUsuario(cuentaDTO: CrearUsuarioDTO): Observable<MensajeDTO<String>> {
    return this.http.post<MensajeDTO<String>>(
      `${this.authURL}/crear-usuario`,
      cuentaDTO
    );
  }
}
