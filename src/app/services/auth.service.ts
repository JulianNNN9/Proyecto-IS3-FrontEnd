import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenDTO } from '../dto/token-dto';
import { TokenService } from './token.service';
import { MensajeDTO } from '../dto/mensaje-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authURL = 'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  refresh(): Observable<MensajeDTO<TokenDTO>> {
    const token: string | null = this.tokenService.getToken();
    return this.http.get<MensajeDTO<TokenDTO>>(
      `${this.authURL}/refresh?token=${token}`
    );
  }
}
