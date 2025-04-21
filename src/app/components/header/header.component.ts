import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../services/token.service';
import { PublicoService } from '../../services/publico.service';
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
  idUsuario: string | null; // id del usuario que ha iniciado sesión
  nombreUsuario: string | null; // Nombre del usuario que ha iniciado sesión
  
  // Definición de los elementos del menú con control de acceso por roles
  menuItems: { nombre: string; ruta: string; rolesPermitidos: string[] }[] = [
    { nombre: 'Gestionar Quejas', ruta: '/gestionar-quejas', rolesPermitidos: ['ADMIN'] },
    { nombre: 'Gestionar Sugerencias', ruta: '/gestionar_sugerencias', rolesPermitidos: ['ADMIN'] },
    { nombre: 'Mis Citas', ruta: '/mis-citas', rolesPermitidos: ['CLIENTE'] },
    { nombre: 'Agendar una cita', ruta: '/agendar-cita', rolesPermitidos: ['CLIENTE'] },
    { nombre: 'Mis Quejas', ruta: '/mis-quejas', rolesPermitidos: ['CLIENTE'] },
    { nombre: 'Perfil', ruta: '/perfil', rolesPermitidos: ['CLIENTE', 'ADMIN'] }
  ];

  // Elementos de menú filtrados según el rol del usuario actual
  menuFiltrado: { nombre: string; ruta: string; rolesPermitidos: string[] }[] = [];

  /**
   * Constructor del componente
   */
  constructor(
    private tokenService: TokenService,
    private publicoService: PublicoService,
    private authService: AuthService
  ){}

  /**
   * Método que se ejecuta al inicializar el componente
   * Configura el menú según el rol del usuario y obtiene información del usuario autenticado
   */
  ngOnInit() {
    const rolUsuario: string = this.authService.obtenerRolUsuario()?.rol ?? '';
    this.menuFiltrado = this.menuItems.filter(item => item.rolesPermitidos.includes(rolUsuario));

    if (this.tokenService.isLogged()) {
      this.nombreUsuario = this.tokenService.getNombre();
      this.idUsuario = this.tokenService.getIDCuenta();

      // Actualizar ruta del perfil con el ID del usuario
      this.menuFiltrado = this.menuFiltrado.map(item => {
        if (item.nombre === 'Perfil' && this.idUsuario) {
          return {
            ...item,
            ruta: `/perfil/${this.idUsuario}`
          };
        }
        return item;
      });
    }
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAutenticado() {
    return this.tokenService.isLogged();
  }

  /**
   * Cierra la sesión del usuario actual
   */
  logout() {
    this.tokenService.logout();
  }

  /**
   * Verifica si el usuario es administrador
   */
  isAdmin() {
    return this.isAutenticado() && this.tokenService.getRol() === 'ADMIN';
  }

  /**
   * Verifica si el usuario es cliente
   */
  isCliente() {
    return this.isAutenticado() && this.tokenService.getRol() === 'CLIENTE';
  }
}