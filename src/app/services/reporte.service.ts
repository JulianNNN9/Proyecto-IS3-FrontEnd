import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MensajeDTO } from '../dto/mensaje-dto';
import { QuejaPorTipoDTO } from '../dto/quejasugerencia/queja-por-tipo-dto';
import { QuejaPorClienteDTO } from '../dto/quejasugerencia/queja-por-cliente-dto';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private apiUrl = 'http://localhost:8080/reportes';

  constructor(private http: HttpClient) {}

  obtenerQuejasPorTipo(): Observable<MensajeDTO<QuejaPorTipoDTO[]>> {
    return this.http.get<MensajeDTO<QuejaPorTipoDTO[]>>(`${this.apiUrl}/quejas-por-tipo`);
  }

  obtenerQuejasPorCliente(): Observable<MensajeDTO<QuejaPorClienteDTO[]>> {
    return this.http.get<MensajeDTO<QuejaPorClienteDTO[]>>(`${this.apiUrl}/quejas-por-cliente`);
  }
  obtenerQuejasPorTipoDeCliente(clienteId: string): Observable<MensajeDTO<QuejaPorTipoDTO[]>> {
    return this.http.get<MensajeDTO<QuejaPorTipoDTO[]>>(`${this.apiUrl}/quejas-por-cliente/${clienteId}`);
  }


}
