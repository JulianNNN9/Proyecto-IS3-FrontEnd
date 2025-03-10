import { Injectable } from '@angular/core';
import { QuejaSugerenciaDTO } from '../dto/quejasugerencia/queja-sugerencia-dto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EnviarQuejaSugerenciaDTO } from '../dto/quejasugerencia/enviar-queja-sugerencia-dto';
import { MensajeDTO } from '../dto/mensaje-dto';

@Injectable({
  providedIn: 'root'
})
export class QuejaSugerenciaService {

  private apiUrl = 'http://localhost:8080/quejas-sugerencias';

  constructor(private http: HttpClient) {}

  enviarQuejaSugerencia(data: EnviarQuejaSugerenciaDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(
      `${this.apiUrl}/crear`
      , data
    );
  }

  obtenerQuejas(): Observable<MensajeDTO<QuejaSugerenciaDTO[]>> {
    return this.http.get<MensajeDTO<QuejaSugerenciaDTO[]>>(
      `${this.apiUrl}/listar-todos`
    );
  }

  actualizarEstado(id: string, estado: string, respuesta: string): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.apiUrl}/${id}`, null, {
      params: { estado, respuesta },
    });
  }
  
}
