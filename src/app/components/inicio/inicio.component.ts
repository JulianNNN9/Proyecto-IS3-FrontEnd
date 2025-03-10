import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  
  esAdmin = false;
  mostrarOpciones = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    const usuario = this.authService.obtenerRolUsuario();
    
    if (usuario && usuario.rol === 'ADMIN') {
      this.esAdmin = true; // Si el usuario es ADMIN, esAdmin será true
    }
  }

  togglePQRS() {
    this.mostrarOpciones = !this.mostrarOpciones;
  }

  seleccionarOpcion(opcion: string) {
    console.log('Opción seleccionada:', opcion);
    this.mostrarOpciones = false; // Opcional: Cerrar la ventana después de seleccionar
    if (opcion === 'nueva-queja') {
      this.router.navigate(['/nueva-queja']);
    } else if (opcion === 'sugerencia') {
      this.router.navigate(['/sugerencias']);
    }
  }

  irAPreguntasFrecuentes() {
    this.router.navigate(['/faq']); // Redirige al componente de preguntas frecuentes
  }
  
}
