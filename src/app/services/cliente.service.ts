import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { CrearQuejaDTO } from '../dto/queja/crear-queja-dto';
import { Queja } from '../model/queja';

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
}