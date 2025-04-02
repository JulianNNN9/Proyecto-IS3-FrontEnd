import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { AuthService } from './auth.service';
import { InformacionUsuarioDTO } from '../dto/cuenta/informacion-usuario-dto';
import { EditarUsuarioDTO } from '../dto/cuenta/editar-usuario-dto';
import { RecuperarContraseniaDTO } from '../dto/cuenta/recuperar-contrasenia-dto';
import { CambiarContraseniaDTO } from '../dto/cuenta/cambiar-contrasenia-dto';
import { EstilistaDTO } from '../dto/estilista/estilista-dto';
import { ServicioDTO } from '../dto/servicio/servicio-dto';
import { QuejaDTO } from '../dto/queja/queja-dto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private authURL = 'http://localhost:8080/api/usuario';

  constructor(private http: HttpClient, private authService: AuthService, private tokenService: TokenService) {}

  crearQueja(nombreServicio: string, nombreEstilista: string, descripcion: string): Observable<MensajeDTO<string>> {

    const usuario = this.authService.obtenerIdUsuario();
  
    if (!usuario) {
      console.warn('No se pudo obtener el usuario autenticado');
      return new Observable();
    }
  
    console.log(nombreServicio,nombreEstilista)

    const nombre = this.tokenService.getNombre();

    console.log(nombre)
    
    const queja  = {
      clienteId: usuario.id,
      nombreCliente: nombre,
      descripcion: descripcion,
      fecha: new Date(),
      nombreServicio: nombreServicio,
      nombreEstilista: nombreEstilista
    };
  
    return this.http.post<MensajeDTO<string>>(`${this.authURL}/crear-queja`, queja);
  }
  

  crearSugerencia(motivo: string, mensaje: string): Observable<MensajeDTO<string>> {
    const usuario = this.authService.obtenerUsuarioAutenticado();
  
    if (!usuario) {
      console.warn('No se pudo obtener el usuario autenticado');
      return new Observable(); 
    }
  
    const sugerencia = {
      nombre: usuario.nombre,
      email: usuario.email,
      motivo: motivo,
      mensaje: mensaje
    };
  
    return this.http.post<MensajeDTO<string>>(`${this.authURL}/crear-sugerencia`, sugerencia);
  }
  
  obtenerQuejasPorClienteId(clienteId: string): Observable<MensajeDTO<QuejaDTO[]>> {
    return this.http.get<MensajeDTO<QuejaDTO[]>>(`${this.authURL}/quejas/${clienteId}`);
  }

  editarUsuario(editarUsuarioDTO: EditarUsuarioDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.authURL}/editar-usuario`, editarUsuarioDTO);
  }

  eliminarUsuario(id: string): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.authURL}/eliminar-usuario/${id}`);
  }

  obtenerInformacionUsuario(id: string): Observable<InformacionUsuarioDTO> {
    return this.http.get<InformacionUsuarioDTO>(`${this.authURL}/informacion-usuario/${id}`);
  }

  recuperarContrasenia(recuperarContraseniaDTO: RecuperarContraseniaDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.authURL}/recuperar-contrasenia`, recuperarContraseniaDTO);
  }

  cambiarContrasenia(cambiarContraseniaDTO: CambiarContraseniaDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.authURL}/cambiar-contrasenia`, cambiarContraseniaDTO);
  }

  obtenerEstilistas(): Observable<MensajeDTO<EstilistaDTO[]>> {
    return this.http.get<MensajeDTO<EstilistaDTO[]>>(`${this.authURL}/obtener-estilistas`);
  }

  obtenerServicios(): Observable<MensajeDTO<ServicioDTO[]>> {
    return this.http.get<MensajeDTO<ServicioDTO[]>>(`${this.authURL}/obtener-servicios`);
  }

}