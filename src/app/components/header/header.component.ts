import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../services/token.service';
import { PublicoService } from '../../services/publico.service';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {

  title: string = 'LAOS'; // Declarar la variable title
  isLoggedIn: boolean;
  loggedInUser: string | null;
  menuItems: { nombre: string; ruta: string; rolesPermitidos: string[] }[] = [
    { nombre: 'Gestionar Quejas', ruta: '/gestionar-quejas', rolesPermitidos: ['ADMIN'] },
    { nombre: 'Gestionar Sugerencias', ruta: '/gestionar_sugerencias', rolesPermitidos: ['ADMIN'] },
    { nombre: 'Mis Citas', ruta: '/mis-citas', rolesPermitidos: ['CLIENTE'] },
    { nombre: 'Mis Quejas', ruta: '/mis-quejas', rolesPermitidos: ['CLIENTE'] },
    { nombre: 'Perfil', ruta: '/perfil', rolesPermitidos: ['CLIENTE'] }
  ];

  menuFiltrado: { nombre: string; ruta: string; rolesPermitidos: string[] }[] = [];

  constructor(
    private tokenService: TokenService,
    private publicoService: PublicoService,
    private authService: AuthService
  ){
    
  }

  ngOnInit() {
    const rolUsuario: string = this.authService.obtenerRolUsuario()?.rol ?? '';
    this.menuFiltrado = this.menuItems.filter(item => item.rolesPermitidos.includes(rolUsuario));

    if(this.tokenService.isLogged()){
      this.loggedInUser = this.tokenService.getNombre();
    }

  }

  isAutenticado(){
    return this.tokenService.isLogged();
  }

  logout(){
    this.tokenService.logout();
  }
  
  isAdmin(){
    if(this.isAutenticado() && this.tokenService.getRol() === 'ADMIN'){
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

}
