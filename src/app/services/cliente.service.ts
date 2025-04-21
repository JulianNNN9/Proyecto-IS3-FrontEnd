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
import { InformacionCitaDTO } from '../dto/mis-citas/informacion-cita-dto';
import { CrearCitaDTO } from '../dto/mis-citas/crear-cita-dto';
import { ReprogramarCitaDTO } from '../dto/mis-citas/reprogramar-cita-dto';

/**
 * Servicio para operaciones del cliente
 * Gestiona las peticiones relacionadas con los usuarios registrados como clientes
 */
@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // URL base para las peticiones a la API de usuario
  private authURL = 'http://localhost:8080/api/usuario';

  /**
   * Constructor del servicio
   * @param http Cliente HTTP para realizar peticiones al servidor
   * @param authService Servicio de autenticación para obtener información del usuario
   * @param tokenService Servicio para gestionar el token de sesión
   */
  constructor(private http: HttpClient, private authService: AuthService, private tokenService: TokenService) {}

  /**
   * Crea una nueva queja en el sistema
   * @param nombreServicio Nombre del servicio sobre el que se queja
   * @param nombreEstilista Nombre del estilista relacionado con la queja
   * @param descripcion Texto detallado de la queja
   * @returns Observable con mensaje de confirmación
   */
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
  
  /**
   * Crea una nueva sugerencia en el sistema
   * @param motivo Asunto o razón de la sugerencia
   * @param mensaje Contenido detallado de la sugerencia
   * @returns Observable con mensaje de confirmación
   */
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
  
  /**
   * Obtiene las quejas realizadas por un cliente específico
   * @param clienteId Identificador del cliente
   * @returns Observable con lista de quejas del cliente
   */
  obtenerQuejasPorClienteId(clienteId: string): Observable<MensajeDTO<QuejaDTO[]>> {
    return this.http.get<MensajeDTO<QuejaDTO[]>>(`${this.authURL}/quejas/${clienteId}`);
  }

    /**
   * Obtiene las citas asociadas a un cliente específico
   * @param clienteId Identificador del cliente
   * @returns Observable con lista de citas del cliente
   */
  obtenerCitasPorClienteId(clienteId: string): Observable<MensajeDTO<InformacionCitaDTO[]>> {
    return this.http.get<MensajeDTO<InformacionCitaDTO[]>>(`${this.authURL}/obtener-citas/${clienteId}`);
  }

    /**
   * Obtiene las citas canceladas y completadas de un cliente específico
   * @param clienteId Identificador único del cliente
   * @returns Observable con la lista de citas canceladas o completadas
   */
  obtenerCitasCanceladasYCompletadas(clienteId: string): Observable<MensajeDTO<InformacionCitaDTO[]>> {
    return this.http.get<MensajeDTO<InformacionCitaDTO[]>>(`${this.authURL}/obtener-citas-canceladas-completadas/${clienteId}`);
  }
  
    /**
   * Cancela una cita programada
   * @param citaId Identificador único de la cita a cancelar
   * @returns Observable con mensaje de confirmación
   */
  cancelarCita(citaId: string): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.authURL}/citas/cancelar/${citaId}`, {});
  }

  /**
   * Actualiza la información personal del usuario
   * @param editarUsuarioDTO Objeto con los datos actualizados del usuario
   * @returns Observable con mensaje de confirmación
   */
  editarUsuario(editarUsuarioDTO: EditarUsuarioDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.authURL}/editar-usuario`, editarUsuarioDTO);
  }

  /**
   * Elimina un usuario del sistema
   * @param id Identificador del usuario a eliminar
   * @returns Observable con mensaje de confirmación
   */
  eliminarUsuario(id: string): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.authURL}/eliminar-usuario/${id}`);
  }

  /**
   * Obtiene la información personal de un usuario
   * @param id Identificador del usuario
   * @returns Observable con los datos del usuario
   */
  obtenerInformacionUsuario(id: string): Observable<InformacionUsuarioDTO> {
    return this.http.get<InformacionUsuarioDTO>(`${this.authURL}/informacion-usuario/${id}`);
  }

  /**
   * Gestiona el proceso de recuperación de contraseña
   * @param recuperarContraseniaDTO Objeto con datos para la recuperación (correo, código, nueva contraseña)
   * @returns Observable con mensaje de confirmación
   */
  recuperarContrasenia(recuperarContraseniaDTO: RecuperarContraseniaDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.authURL}/recuperar-contrasenia`, recuperarContraseniaDTO);
  }

  /**
   * Actualiza la contraseña del usuario autenticado
   * @param cambiarContraseniaDTO Objeto con contraseña actual y nueva
   * @returns Observable con mensaje de confirmación
   */
  cambiarContrasenia(cambiarContraseniaDTO: CambiarContraseniaDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.authURL}/cambiar-contrasenia`, cambiarContraseniaDTO);
  }

  /**
   * Obtiene la lista de estilistas disponibles
   * @returns Observable con la lista de estilistas
   */
  obtenerEstilistas(): Observable<MensajeDTO<EstilistaDTO[]>> {
    return this.http.get<MensajeDTO<EstilistaDTO[]>>(`${this.authURL}/obtener-estilistas`);
  }

  /**
   * Obtiene la lista de servicios que ofrece el negocio
   * @returns Observable con la lista de servicios
   */
  obtenerServicios(): Observable<MensajeDTO<ServicioDTO[]>> {
    return this.http.get<MensajeDTO<ServicioDTO[]>>(`${this.authURL}/obtener-servicios`);
  }

  /**
 * Registra una nueva cita en el sistema
 * @param crearCitaDTO Objeto con los datos de la cita
 * @returns Observable con mensaje de confirmación
 */
agendarCita(crearCitaDTO: CrearCitaDTO): Observable<MensajeDTO<string>> {
  return this.http.post<MensajeDTO<string>>(`${this.authURL}/crear-cita`, crearCitaDTO);
}

/**
 * Reprograma una cita existente
 * @param reprogramarCitaDTO Objeto con los datos de la cita a reprogramar
 * @returns Observable con mensaje de confirmación
 */
reprogramarCita(reprogramarCitaDTO: ReprogramarCitaDTO): Observable<MensajeDTO<string>> {
  return this.http.put<MensajeDTO<string>>(`${this.authURL}/reprogramar-cita`, reprogramarCitaDTO);
}

}