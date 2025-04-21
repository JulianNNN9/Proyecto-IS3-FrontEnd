import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { InformacionCitaDTO } from '../dto/cita/informacion-cita-dto';

/**
 * Servicio para operaciones del estilista
 * Gestiona las peticiones relacionadas con los usuarios registrados como estilistas
 * Permite consultar citas asignadas, ver detalles y filtrar por estado
 */
@Injectable({
  providedIn: 'root'
})
export class EstilistaService {
  // URL base para las peticiones a la API de estilista
  private estilistaURL = 'http://localhost:8080/api/estilista';

  /**
   * Constructor del servicio
   * @param http Cliente HTTP para realizar peticiones al servidor
   * @param authService Servicio de autenticación para obtener información del usuario
   * @param tokenService Servicio para gestionar el token de sesión
   */
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  /**
   * Obtiene todas las citas asignadas a un estilista específico
   * @param estilistaId Identificador único del estilista
   * @returns Observable con la lista de citas asociadas al estilista
   */
  obtenerMisCitas(estilistaId: string): Observable<MensajeDTO<InformacionCitaDTO[]>> {
    return this.http.get<MensajeDTO<InformacionCitaDTO[]>>(
      `${this.estilistaURL}/citas/mis-citas/${estilistaId}`
    );
  }

  /**
   * Obtiene información detallada de una cita específica
   * @param citaId Identificador único de la cita
   * @returns Observable con los datos completos de la cita solicitada
   */
  obtenerDetalleCita(citaId: string): Observable<MensajeDTO<InformacionCitaDTO>> {
    return this.http.get<MensajeDTO<InformacionCitaDTO>>(
      `${this.estilistaURL}/citas/${citaId}`
    );
  }

  /**
   * Filtra citas del estilista según su estado actual
   * @param estado Estado de la cita (PROGRAMADA, CANCELADA, COMPLETADA, etc.)
   * @returns Observable con la lista de citas que coinciden con el estado especificado
   */
  obtenerCitasPorEstado(estado: string): Observable<MensajeDTO<InformacionCitaDTO[]>> {
    return this.http.get<MensajeDTO<InformacionCitaDTO[]>>(
      `${this.estilistaURL}/citas/estado/${estado}`
    );
  }

  /**
   * Obtiene todas las citas del estilista actualmente autenticado
   * Utiliza el ID del usuario guardado en el AuthService
   * @returns Observable con la lista de citas del estilista actual
   */
  obtenerMisCitasActuales(): Observable<MensajeDTO<InformacionCitaDTO[]>> {
    const usuario = this.authService.obtenerIdUsuario();
    
    if (!usuario) {
      console.warn('No se pudo obtener el usuario estilista autenticado');
      return new Observable();
    }
    
    return this.obtenerMisCitas(usuario.id);
  }
}