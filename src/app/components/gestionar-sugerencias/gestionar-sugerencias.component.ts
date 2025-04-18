import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SugerenciaDTO } from '../../dto/sugerencia/sugerencia-dto';
import { AdminService } from '../../services/admin.service';

/**
 * Componente para gestionar las sugerencias enviadas por los usuarios
 * Permite a los administradores ver, filtrar y marcar como revisadas las sugerencias
 */
@Component({
  selector: 'app-gestionar-sugerencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-sugerencias.component.html',
  styleUrl: './gestionar-sugerencias.component.css'
})
export class GestionarSugerenciasComponent {
  sugerencias: SugerenciaDTO[] = [];        // Almacena todas las sugerencias obtenidas del servidor
  sugerenciasFiltradas: SugerenciaDTO[] = []; // Almacena las sugerencias filtradas para mostrar
  filtroFecha: string = '';                 // Criterio de filtro por fecha

  /**
   * Constructor del componente
   * @param adminService Servicio para realizar operaciones administrativas
   */
  constructor(private adminService: AdminService) {}

  /**
   * Método que se ejecuta al inicializar el componente
   * Carga la lista de sugerencias desde el servidor
   */
  ngOnInit() {
    this.obtenerSugerencias();
  }

  /**
   * Método para obtener todas las sugerencias desde el servidor
   * Utiliza el servicio de administrador para recuperar la información
   */
  obtenerSugerencias() {
    this.adminService.obtenerSugerencias().subscribe(
      (data) => {
        this.sugerencias = data.respuesta;
        this.sugerenciasFiltradas = [...this.sugerencias]; // Copia todas las sugerencias al array filtrado
      },
      (error) => {
        console.error('Error obteniendo sugerencias', error);
      }
    );
  }
  
  /**
   * Método para filtrar las sugerencias según la fecha seleccionada
   * Actualiza la lista de sugerencias mostradas en la interfaz
   */
  filtrarSugerencias() {
    if (this.filtroFecha) {
      this.sugerenciasFiltradas = this.sugerencias.filter(s =>
        s.fecha === this.filtroFecha
      );
    } else {
      this.sugerenciasFiltradas = [...this.sugerencias]; // Si no hay filtro, muestra todas
    }
  }
  
  /**
   * Método para reiniciar el filtro aplicado
   * Limpia el campo de fecha y muestra todas las sugerencias
   */
  resetFiltro() {
    this.filtroFecha = '';
    this.sugerenciasFiltradas = [...this.sugerencias];
  }
  
  /**
   * Método para marcar una sugerencia como revisada
   * Actualiza el estado en el servidor y en la interfaz
   * @param index Índice de la sugerencia en el arreglo filtrado
   */
  marcarRevisado(index: number) {
    const id = this.sugerenciasFiltradas[index].id;
    this.adminService.marcarComoRevisado(id).subscribe(
      (data) => {
        console.log(data.respuesta); // Registra la respuesta del servidor
        this.sugerenciasFiltradas[index].revisado = true; // Actualiza el estado en la interfaz
      },
      (error) => {
        console.error('Error al marcar como revisado:', error);
      }
    );
  }
}