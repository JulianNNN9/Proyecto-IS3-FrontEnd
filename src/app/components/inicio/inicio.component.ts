import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  
  mostrarOpciones = false;

  constructor(private router: Router) {}

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
  
}