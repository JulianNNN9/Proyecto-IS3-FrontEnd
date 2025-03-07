import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensajeDTO } from '../dto/mensaje-dto';
import { Observable } from 'rxjs';
import { CrearCuponDTO } from '../dto/cupon/crear-cupon-dto';
import { EditarCuponDTO } from '../dto/cupon/editar-cupon-dto';
import { EliminarCuponesDTO } from '../dto/cupon/eliminar-cupones-dto';
import { InformacionUsuarioDTO } from '../dto/cuenta/informacion-usuario-dto';
import { EditarUsuarioDTO } from '../dto/cuenta/editar-usuario-dto';
import { CambiarContraseniaDTO } from '../dto/cuenta/cambiar-contrasenia-dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private authURL = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

}
