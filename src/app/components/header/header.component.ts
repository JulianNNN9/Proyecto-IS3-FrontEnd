import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../services/token.service';
import { PublicoService } from '../../services/publico.service';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { AuthService } from '../../services/auth.service';

/**
 * Componente para la cabecera de la aplicación
 * Gestiona la navegación y muestra diferentes opciones según el rol del usuario
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {

  title: string = 'LAOS'; // Nombre de la aplicación mostrado en la cabecera
  isLoggedIn: boolean;    // Indica si el usuario ha iniciado sesión
  loggedInUser: string | null; // Nombre del usuario que ha iniciado sesión
  
  // Definición de los elementos del menú con control de acceso por roles
  menuItems: { nombre: string; ruta: string; rolesPermitidos: string[] }[] = [
    { nombre: 'Gestionar Quejas', ruta: '/gestionar-quejas', rolesPermitidos: ['ADMIN'] },
    { nombre: 'Gestionar Sugerencias', ruta: '/gestionar_sugerencias', rolesPermitidos: ['ADMIN'] },
    { nombre: 'Mis Citas', ruta: '/mis-citas', rolesPermitidos: ['CLIENTE'] },
    { nombre: 'Mis Quejas', ruta: '/mis-quejas', rolesPermitidos: ['CLIENTE'] },
    { nombre: 'Perfil', ruta: '/perfil', rolesPermitidos: ['CLIENTE'] }
  ];

  // Elementos de menú filtrados según el rol del usuario actual
  menuFiltrado: { nombre: string; ruta: string; rolesPermitidos: string[] }[] = [];

  /**
   * Constructor del componente
   * @param tokenService Servicio para manejar el token de autenticación
   * @param publicoService Servicio para operaciones públicas
   * @param authService Servicio de autenticación
   */
  constructor(
    private tokenService: TokenService,
    private publicoService: PublicoService,
    private authService: AuthService
  ){
    
  }

  /**
   * Método que se ejecuta al inicializar el componente
   * Configura el menú según el rol del usuario y obtiene información del usuario autenticado
   */
  ngOnInit() {
    const rolUsuario: string = this.authService.obtenerRolUsuario()?.rol ?? '';
    this.menuFiltrado = this.menuItems.filter(item => item.rolesPermitidos.includes(rolUsuario));

    if(this.tokenService.isLogged()){
      this.loggedInUser = this.tokenService.getNombre();
    }

  }

  /**
   * Verifica si el usuario está autenticado
   * @returns true si el usuario ha iniciado sesión, false en caso contrario
   */
  isAutenticado(){
    return this.tokenService.isLogged();
  }

  /**
   * Cierra la sesión del usuario actual
   * Elimina el token de autenticación
   */
  logout(){
    this.tokenService.logout();
  }
  
  /**
   * Verifica si el usuario actual tiene rol de administrador
   * @returns true si el usuario es administrador, false en caso contrario
   */
  isAdmin(){
    if(this.isAutenticado() && this.tokenService.getRol() === 'ADMIN'){
      return true;
    }
    return false;
  }

  /**
   * Verifica si el usuario actual tiene rol de cliente
   * @returns true si el usuario es cliente, false en caso contrario
   */
  isCliente(){
    if(this.isAutenticado() && this.tokenService.getRol() === 'CLIENTE'){
      return true;
    }
    return false;
  }

}