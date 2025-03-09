import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SugerenciaDTO } from '../../dto/sugerencia/sugerencia-dto';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-gestionar-sugerencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-sugerencias.component.html',
  styleUrl: './gestionar-sugerencias.component.css'
})
export class GestionarSugerenciasComponent {
  sugerencias: SugerenciaDTO[] = [];
  sugerenciasFiltradas: SugerenciaDTO[] = [];
  filtroFecha: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.obtenerSugerencias();
  }

  obtenerSugerencias() {
    this.adminService.obtenerSugerencias().subscribe(
      (data) => {
        this.sugerencias = data.respuesta;
        this.sugerenciasFiltradas = [...this.sugerencias];
      },
      (error) => {
        console.error('Error obteniendo sugerencias', error);
      }
    );
  }
  
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
    const id = this.sugerenciasFiltradas[index].id;
    this.adminService.marcarComoRevisado(id).subscribe(
      (data) => {
        console.log(data.respuesta);
        this.sugerenciasFiltradas[index].revisado = true;
      },
      (error) => {
        console.error('Error al marcar como revisado:', error);
      }
    );
  }
  
  
}
