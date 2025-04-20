import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Componente para la página principal de la aplicación
 * Muestra diferentes opciones según el rol del usuario
 */
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  
  esCliente = false;      // Indica si el usuario tiene rol de cliente
  mostrarOpciones = false; // Controla la visibilidad del menú de opciones PQRS

  /**
   * Constructor del componente
   * @param router Servicio para navegación entre rutas
   * @param authService Servicio de autenticación para obtener información del usuario
   */
  constructor(private router: Router, private authService: AuthService) {}

  /**
   * Método que se ejecuta al inicializar el componente
   * Verifica el rol del usuario actual para mostrar las opciones adecuadas
   */
  ngOnInit() {
    const usuario = this.authService.obtenerRolUsuario();
    
    if (usuario && usuario.rol === 'CLIENTE') {
      this.esCliente = true; // Si el usuario es CLIENTE, esCliente será true
    }
  }

  /**
   * Alterna la visibilidad del menú de opciones PQRS
   * Muestra u oculta las opciones al hacer clic en el botón
   */
  togglePQRS() {
    this.mostrarOpciones = !this.mostrarOpciones;
  }

  /**
   * Navega a la página correspondiente según la opción seleccionada
   * @param opcion Identificador de la opción seleccionada (nueva-queja, sugerencia, etc.)
   */
  seleccionarOpcion(opcion: string) {
    console.log('Opción seleccionada:', opcion);
    this.mostrarOpciones = false; // Opcional: Cerrar la ventana después de seleccionar
    if (opcion === 'nueva-queja') {
      this.router.navigate(['/nueva-queja']);
    } else if (opcion === 'sugerencia') {
      this.router.navigate(['/sugerencias']);
    }
  }

  /**
   * Navega a la página de preguntas frecuentes
   * Método utilizado por el botón de FAQ en la interfaz
   */
  irAPreguntasFrecuentes() {
    this.router.navigate(['/faq']); // Redirige al componente de preguntas frecuentes
  }
  
}