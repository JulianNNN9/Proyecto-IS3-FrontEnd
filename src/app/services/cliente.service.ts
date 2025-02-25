import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { EditarUsuarioDTO } from '../dto/cuenta/editar-usuario-dto';
import { InformacionUsuarioDTO } from '../dto/cuenta/informacion-usuario-dto';
import { CambiarContraseniaDTO } from '../dto/cuenta/cambiar-contrasenia-dto';
import { CrearCompraDTO } from '../dto/compra/crear-compra-dto';
import { InformacionCompraDTO } from '../dto/compra/informacion-compra-dto';
import { AgregarItemDTO } from '../dto/carrito/agregar-item-dto';
import { EliminarDelCarritoDTO } from '../dto/carrito/eliminar-del-carrito-dto';
import { EditarCarritoDTO } from '../dto/carrito/editar-carrito-dto';
import { InformacionCarritoDTO } from '../dto/carrito/informacion-carrito-dto';
import { InformacionCuponDTO } from '../dto/cupon/informacion-cupon-dto';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private authURL = 'http://localhost:8080/api/usuario';

  constructor(private http: HttpClient) {}
  public editarUsuario(editarUsuarioDTO: EditarUsuarioDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.authURL}/editar-perfil`, editarUsuarioDTO);
  }

  public eliminarUsuario(codigo: string): Observable<MensajeDTO<string>> {
    return this.http.delete<MensajeDTO<string>>(`${this.authURL}/eliminar-usuario/${codigo}`);
  }

  public obtenerInformacionUsuario(codigo: string): Observable<MensajeDTO<InformacionUsuarioDTO>> {
    return this.http.get<MensajeDTO<InformacionUsuarioDTO>>(`${this.authURL}/obtener-usuario/${codigo}`);
  }

  public cambiarContrasenia(cambiarContraseniaDTO: CambiarContraseniaDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.authURL}/cambiar-contrasenia`, cambiarContraseniaDTO);
  }

  public crearCompra(crearCompraDTO: CrearCompraDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.authURL}/compra/crear-compra`, crearCompraDTO);
  }

  public obtenerCompra(idCompra: string): Observable<MensajeDTO<InformacionCompraDTO>> {
    return this.http.get<MensajeDTO<InformacionCompraDTO>>(`${this.authURL}/compra/obtener-compra/${idCompra}`);
  }

  public obtenerComprasUsuario(idUsuario: string): Observable<MensajeDTO<InformacionCompraDTO[]>> {
    return this.http.get<MensajeDTO<InformacionCompraDTO[]>>(`${this.authURL}/compra/obtener-compras-usuario/${idUsuario}`);
  }

  public cancelarCompra(idCompra: string): Observable<MensajeDTO<string>> {
    return this.http.get<MensajeDTO<string>>(`${this.authURL}/compra/cancelar-compra/${idCompra}`);
  }

  public realizarPago(idOrden: string): Observable<MensajeDTO<any>> {
    return this.http.get<MensajeDTO<any>>(`${this.authURL}/compra/realizar-pago/${idOrden}`);
  }

  public recibirNotificacionMercadoPago(requestBody: any): Observable<void> {
    return this.http.post<void>(`${this.authURL}/compra/notificacion-pago`, requestBody);
  }

  public agregarCarrito(agregarItemDTO: AgregarItemDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.authURL}/carrito/agregar-carrito`, agregarItemDTO);
  }

  public eliminarCarrito(eliminarDelCarritoDTO: EliminarDelCarritoDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.authURL}/carrito/eliminar-carrito`, eliminarDelCarritoDTO);
  }

  public editarCarrito(editarCarritoDTO: EditarCarritoDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(`${this.authURL}/carrito/editar-carrito`, editarCarritoDTO);
  }

  public crearCarrito(idUsuario: string): Observable<MensajeDTO<string>> {
    return this.http.get<MensajeDTO<string>>(`${this.authURL}/carrito/crear-carrito/${idUsuario}`);
  }

  public obtenerCarrito(idUsuario: string): Observable<MensajeDTO<InformacionCarritoDTO>> {
    return this.http.get<MensajeDTO<InformacionCarritoDTO>>(`${this.authURL}/carrito/obtener-carrito/${idUsuario}`);
  }
  public validarCupon(codigoCupon: string, idUsuario: string): Observable<MensajeDTO<InformacionCuponDTO>> {
    return this.http.get<MensajeDTO<InformacionCuponDTO>>(`${this.authURL}/carrito/validar-cupon/${codigoCupon}/${idUsuario}`);
  }

  public vaciarCarrito(idUsuario: string): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(`${this.authURL}/carrito/vaciar-carrito/${idUsuario}`, {});
  }
  verificarEstadoCompra(idCompra: string): Observable<any> {
    return this.http.get<any>(`${this.authURL}/${idCompra}/estado`);
  }
}