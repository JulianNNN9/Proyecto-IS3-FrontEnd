import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { QuejaDTO } from '../dto/queja/queja-dto';
import { SugerenciaDTO } from '../dto/sugerencia/sugerencia-dto';
import { InformacionUsuarioDTO } from '../dto/cuenta/informacion-usuario-dto';
import { EditarUsuarioDTO } from '../dto/cuenta/editar-usuario-dto';

/**
 * Servicio para operaciones administrativas
 * Proporciona métodos para gestionar quejas y sugerencias desde el panel de administración
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  // URL base para las peticiones a la API de administración
  private authURL = 'http://localhost:8080/api/admin';

  /**
   * Constructor del servicio
   * @param http Cliente HTTP para realizar peticiones al servidor
   */
  constructor(private http: HttpClient) {}

  /**
   * Elimina una queja específica por su ID
   * @param id Identificador de la queja a eliminar
   * @returns Observable con mensaje de confirmación
   */
  eliminarQueja(id: string): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.authURL}/eliminar-queja/${id}`);
  }

  /**
   * Obtiene los detalles de una queja específica
   * @param id Identificador de la queja a consultar
   * @returns Observable con la queja solicitada
   */
  obtenerQuejaPorId(id: string): Observable<MensajeDTO<QuejaDTO>> {
    return this.http.get<MensajeDTO<QuejaDTO>>(`${this.authURL}/obtener-queja/${id}`);
  }

  /**
   * Obtiene todas las quejas relacionadas con un servicio específico
   * @param servicioId Identificador del servicio
   * @returns Observable con lista de quejas del servicio
   */
  obtenerQuejasPorServicioId(servicioId: string): Observable<MensajeDTO<QuejaDTO[]>> {
    const params = new HttpParams().set('servicioId', servicioId);
    return this.http.get<MensajeDTO<QuejaDTO[]>>(`${this.authURL}/obtener-quejas-por/servicio`, { params });
  }

  /**
   * Obtiene todas las quejas realizadas por un cliente específico
   * @param clienteId Identificador del cliente
   * @returns Observable con lista de quejas del cliente
   */
  obtenerQuejasPorClienteId(clienteId: string): Observable<MensajeDTO<QuejaDTO[]>> {
    const params = new HttpParams().set('clienteId', clienteId);
    return this.http.get<MensajeDTO<QuejaDTO[]>>(`${this.authURL}/obtener-quejas-por/cliente`, { params });
  }

  /**
   * Obtiene quejas filtradas por su estado actual
   * @param estadoQueja Estado de las quejas a consultar (pendiente, resuelta, etc.)
   * @returns Observable con lista de quejas en el estado especificado
   */
  obtenerQuejasPorEstado(estadoQueja: string): Observable<MensajeDTO<QuejaDTO[]>> {
    const params = new HttpParams().set('estadoQueja', estadoQueja);
    return this.http.get<MensajeDTO<QuejaDTO[]>>(`${this.authURL}/obtener-quejas-por/estado`, { params });
  }

  /**
   * Obtiene quejas realizadas en un rango de fechas
   * @param startDate Fecha de inicio del rango (formato YYYY-MM-DD)
   * @param endDate Fecha de fin del rango (formato YYYY-MM-DD)
   * @returns Observable con lista de quejas del período
   */
  obtenerQuejasPorFecha(startDate: string, endDate: string): Observable<MensajeDTO<QuejaDTO[]>> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<MensajeDTO<QuejaDTO[]>>(`${this.authURL}/obtener-quejas-por/fecha`, { params });
  }

  /**
   * Obtiene quejas realizadas en una fecha específica
   * @param fecha Fecha a consultar (formato YYYY-MM-DD)
   * @returns Observable con lista de quejas de la fecha especificada
   */
  obtenerQuejasPorFechaUnica(fecha: string): Observable<MensajeDTO<QuejaDTO[]>> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get<MensajeDTO<QuejaDTO[]>>(`${this.authURL}/obtener-quejas-por/fecha-unica`, { params });
  }

  /**
   * Obtiene todas las quejas registradas en el sistema
   * @returns Observable con lista completa de quejas
   */
  listarQuejas(): Observable<MensajeDTO<QuejaDTO[]>> {
    return this.http.get<MensajeDTO<QuejaDTO[]>>(`${this.authURL}/obtener-quejas`);
  }

  /**
   * Obtiene todas las sugerencias enviadas por los usuarios
   * @returns Observable con lista de sugerencias
   */
  obtenerSugerencias(): Observable<MensajeDTO<SugerenciaDTO[]>> {
    return this.http.get<MensajeDTO<SugerenciaDTO[]>>(`${this.authURL}/obtener-sugerencias`);
  }

  /**
   * Marca una sugerencia como revisada por el administrador
   * @param id Identificador de la sugerencia
   * @returns Observable con mensaje de confirmación
   */
  marcarComoRevisado(id: string): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.authURL}/sugerencias/marcar-revisado`, id);
  }

  /**
   * Responde a una queja específica
   * @param idQueja Identificador de la queja a responder
   * @param respuesta Texto de la respuesta del administrador
   * @returns Observable con mensaje de confirmación
   */
  responderQueja(idQueja: string, respuesta: string): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.authURL}/responder-queja/${idQueja}`, respuesta);
  }
  obtenerInformacionUsuarioAdmin(codigo: string): Observable<MensajeDTO<InformacionUsuarioDTO>> {
    return this.http.get<MensajeDTO<InformacionUsuarioDTO>>(`${this.authURL}/obtener-usuario/${codigo}`);
  }
  editarUsuarioAdmin(editarUsuarioDTO: EditarUsuarioDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.authURL}/editar-perfil`, editarUsuarioDTO);
  }
}