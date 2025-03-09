import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { CrearQuejaDTO } from '../dto/queja/crear-queja-dto';
import { Queja } from '../model/queja';
import { CrearSugerenciaDTO } from '../dto/sugerencia/crear-sugerencia-dto';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private authURL = 'http://localhost:8080/api/usuario';

  constructor(private http: HttpClient, private authService: AuthService) {}

  crearQueja(crearQuejaDTO: CrearQuejaDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.authURL}/crear-queja`, crearQuejaDTO);
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
}