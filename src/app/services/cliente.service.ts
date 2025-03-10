import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { CrearQuejaDTO } from '../dto/queja/crear-queja-dto';
import { Queja } from '../model/queja';
import { CrearSugerenciaDTO } from '../dto/sugerencia/crear-sugerencia-dto';
import { AuthService } from './auth.service';
import { InformacionUsuarioDTO } from '../dto/cuenta/informacion-usuario-dto';
import { EditarUsuarioDTO } from '../dto/cuenta/editar-usuario-dto';
import { RecuperarContraseniaDTO } from '../dto/cuenta/recuperar-contrasenia-dto';
import { CambiarContraseniaDTO } from '../dto/cuenta/cambiar-contrasenia-dto';
import { EstilistaDTO } from '../dto/estilista/estilista-dto';
import { ServicioDTO } from '../dto/servicio/servicio-dto';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private authURL = 'http://localhost:8080/api/usuario';

  constructor(private http: HttpClient, private authService: AuthService) {}

  crearQueja(descripcion: string, nombreServicio: string, nombreEstilista: string): Observable<MensajeDTO<string>> {
    const usuario = this.authService.obtenerIdUsuario();
  
    if (!usuario) {
      console.warn('No se pudo obtener el usuario autenticado');
      return new Observable();
    }
  
    console.log(nombreServicio,nombreEstilista)
    
    const queja  = {
      clienteId: usuario.id,
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
  
  

  obtenerQuejasPorClienteId(clienteId: string): Observable<MensajeDTO<Queja[]>> {
    const params = new HttpParams().set('clienteId', clienteId);
    return this.http.get<MensajeDTO<Queja[]>>(`${this.authURL}/quejas`, { params });
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