import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { CrearQuejaDTO } from '../dto/queja/crear-queja-dto';
import { Queja } from '../model/queja';
import { EditarUsuarioDTO } from '../dto/cuenta/editar-usuario-dto';
import { InformacionUsuarioDTO } from '../dto/cuenta/informacion-usuario-dto';
import { CambiarContraseniaDTO } from '../dto/cuenta/cambiar-contrasenia-dto';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private authURL = 'http://localhost:8080/api/usuario';

  constructor(private http: HttpClient) {}

  crearQueja(crearQuejaDTO: CrearQuejaDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.authURL}/crear-queja`, crearQuejaDTO);
  }

  obtenerQuejasPorClienteId(clienteId: string): Observable<MensajeDTO<Queja[]>> {
    const params = new HttpParams().set('clienteId', clienteId);
    return this.http.get<MensajeDTO<Queja[]>>(`${this.authURL}/quejas`, { params });
  }
  public obtenerInformacionUsuario(codigo: string): Observable<MensajeDTO<InformacionUsuarioDTO>> {
    return this.http.get<MensajeDTO<InformacionUsuarioDTO>>(`${this.authURL}/obtener-usuario/${codigo}`);
  }
  public editarUsuario(editarUsuarioDTO: EditarUsuarioDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.authURL}/editar-perfil`, editarUsuarioDTO);
  }
  public cambiarContrasenia(cambiarContraseniaDTO: CambiarContraseniaDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.authURL}/cambiar-contrasenia`, cambiarContraseniaDTO);
  }
}