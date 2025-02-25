import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../servicios/token.service';
import { PublicoService } from '../../servicios/publico.service';
import { NotificacionEventoDTO } from '../../dto/evento/notificacion-evento-dto';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { NotificacionService } from '../../servicios/notificacion.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  notificaciones: NotificacionEventoDTO[] = [];
  isLoggedIn: boolean;
  title: string = 'Unieventos'; // Declarar la variable title
  loggedInUser: string | null;
  modalVisible: boolean = false; // Controla la visibilidad del modal

  constructor(
    private tokenService: TokenService,
    private publicoService: PublicoService,
    private notificacionService: NotificacionService
  ){
    
  }

  ngOnInit() {
    if(this.tokenService.isLogged()){
      this.loggedInUser = this.tokenService.getNombre();
    }
    this.obtenerNotificaciones();

  }
  cantidadNotificaciones(): number{
    return this.notificaciones.length;
  }
  isAutenticado(){
    return this.tokenService.isLogged();
  }

  logout(){
    this.tokenService.logout();
  }
  isAdmin(){
    if(this.isAutenticado() && this.tokenService.getRol() === 'ADMINISTRADOR'){
      return true;
    }
    return false;
  }
  isCliente(){
    if(this.isAutenticado() && this.tokenService.getRol() === 'CLIENTE'){
      return true;
    }
    return false;
  }
  obtenerNotificaciones() {
    this.publicoService.notificarNuevoEvento().subscribe((eventos: MensajeDTO<NotificacionEventoDTO[]>) => {
      this.notificaciones = eventos.respuesta;
      this.notificacionService.setNotificacioes(this.notificaciones);
    });
  }

  mostrarNotificaciones() {
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }
  getIdUsuario(): string {
    return this.tokenService.getIDCuenta();
  }


}
