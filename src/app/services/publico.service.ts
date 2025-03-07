import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class PublicoService {
  private authURL = 'http://localhost:8080/api/publico';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

}