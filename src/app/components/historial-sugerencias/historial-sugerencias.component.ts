import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Sugerencia {
  nombre: string;
  email: string;
  mensaje: string;
  fecha: Date;
  revisado: boolean;
}

@Component({
  selector: 'app-historial-sugerencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-sugerencias.component.html',
  styleUrl: './historial-sugerencias.component.css'
})
export class HistorialSugerenciasComponent {
  sugerencias = [
    { nombre: 'Juan Pérez', email: 'juan@example.com', mensaje: 'Muy buen servicio.', fecha: '2024-03-01', revisado: false },
    { nombre: 'Ana Gómez', email: 'ana@example.com', mensaje: 'Podrían mejorar el tiempo de espera.', fecha: '2024-03-02', revisado: false }
  ];
  
  sugerenciasFiltradas = [...this.sugerencias];
  filtroFecha: string = '';
  
  filtrarSugerencias() {
    if (this.filtroFecha) {
      this.sugerenciasFiltradas = this.sugerencias.filter(s =>
        s.fecha === this.filtroFecha
      );
    } else {
      this.sugerenciasFiltradas = [...this.sugerencias];
    }
  }
  
  resetFiltro() {
    this.filtroFecha = '';
    this.sugerenciasFiltradas = [...this.sugerencias];
  }
  
  marcarRevisado(index: number) {
    this.sugerenciasFiltradas[index].revisado = true;
  }
}
