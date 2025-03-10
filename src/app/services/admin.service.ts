import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { QuejaDTO } from '../dto/queja/queja-dto';
import { SugerenciaDTO } from '../dto/sugerencia/sugerencia-dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private authURL = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  eliminarQueja(id: string): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.authURL}/eliminar-queja/${id}`);
  }

  obtenerQuejaPorId(id: string): Observable<MensajeDTO<QuejaDTO>> {
    return this.http.get<MensajeDTO<QuejaDTO>>(`${this.authURL}/obtener-queja/${id}`);
  }

  obtenerQuejasPorServicioId(servicioId: string): Observable<MensajeDTO<QuejaDTO[]>> {
    const params = new HttpParams().set('servicioId', servicioId);
    return this.http.get<MensajeDTO<QuejaDTO[]>>(`${this.authURL}/obtener-quejas-por/servicio`, { params });
  }

  obtenerQuejasPorClienteId(clienteId: string): Observable<MensajeDTO<QuejaDTO[]>> {
    const params = new HttpParams().set('clienteId', clienteId);
    return this.http.get<MensajeDTO<QuejaDTO[]>>(`${this.authURL}/obtener-quejas-por/cliente`, { params });
  }

  obtenerQuejasPorEstado(estadoQueja: string): Observable<MensajeDTO<QuejaDTO[]>> {
    const params = new HttpParams().set('estadoQueja', estadoQueja);
    return this.http.get<MensajeDTO<QuejaDTO[]>>(`${this.authURL}/obtener-quejas-por/estado`, { params });
  }

  obtenerQuejasPorFecha(startDate: string, endDate: string): Observable<MensajeDTO<QuejaDTO[]>> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<MensajeDTO<QuejaDTO[]>>(`${this.authURL}/obtener-quejas-por/fecha`, { params });
  }

  obtenerQuejasPorFechaUnica(fecha: string): Observable<MensajeDTO<QuejaDTO[]>> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get<MensajeDTO<QuejaDTO[]>>(`${this.authURL}/obtener-quejas-por/fecha-unica`, { params });
  }

  listarQuejas(): Observable<MensajeDTO<QuejaDTO[]>> {
    return this.http.get<MensajeDTO<QuejaDTO[]>>(`${this.authURL}/obtener-quejas`);
  }

  obtenerSugerencias(): Observable<MensajeDTO<SugerenciaDTO[]>> {
    return this.http.get<MensajeDTO<SugerenciaDTO[]>>(`${this.authURL}/obtener-sugerencias`);
  }

  marcarComoRevisado(id: string): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.authURL}/sugerencias/marcar-revisado`, id);
  }

  responderQueja(idQueja: string, respuesta: string): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.authURL}/responder-queja/${idQueja}`, respuesta);
  }
}