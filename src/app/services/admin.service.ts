import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
//import { QuejaDTO } from '../dto/queja/queja-dto';
import { Queja } from '../model/queja';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private authURL = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  eliminarQueja(id: string): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.authURL}/eliminar-queja/${id}`);
  }

  obtenerQuejaPorId(id: string): Observable<MensajeDTO<Queja>> {
    return this.http.get<MensajeDTO<Queja>>(`${this.authURL}/queja/${id}`);
  }

  obtenerQuejasPorServicioId(servicioId: string): Observable<MensajeDTO<Queja[]>> {
    const params = new HttpParams().set('servicioId', servicioId);
    return this.http.get<MensajeDTO<Queja[]>>(`${this.authURL}/quejas/servicio`, { params });
  }

  obtenerQuejasPorClienteId(clienteId: string): Observable<MensajeDTO<Queja[]>> {
    const params = new HttpParams().set('clienteId', clienteId);
    return this.http.get<MensajeDTO<Queja[]>>(`${this.authURL}/quejas/cliente`, { params });
  }

  obtenerQuejasPorEstado(estadoQueja: string): Observable<MensajeDTO<Queja[]>> {
    const params = new HttpParams().set('estadoQueja', estadoQueja);
    return this.http.get<MensajeDTO<Queja[]>>(`${this.authURL}/quejas/estado`, { params });
  }

  obtenerQuejasPorFecha(startDate: string, endDate: string): Observable<MensajeDTO<Queja[]>> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<MensajeDTO<Queja[]>>(`${this.authURL}/quejas/fecha`, { params });
  }

  obtenerQuejasPorFechaUnica(fecha: string): Observable<MensajeDTO<Queja[]>> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get<MensajeDTO<Queja[]>>(`${this.authURL}/quejas/fecha-unica`, { params });
  }

  listarQuejas(): Observable<MensajeDTO<Queja[]>> {
    return this.http.get<MensajeDTO<Queja[]>>(`${this.authURL}/quejas`);
  }
}