import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { QuejaDTO } from '../../dto/queja/queja-dto';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';

/**
 * Declaración externa para utilizar Bootstrap desde JavaScript
 */
declare var bootstrap: any;

/**
 * Componente para gestionar las quejas de usuarios
 * Permite a los administradores ver y responder a las quejas presentadas
 */
@Component({
  selector: 'app-gestionar-quejas',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './gestionar-quejas.component.html',
  styleUrl: './gestionar-quejas.component.css'
})
export class GestionarQuejasComponent {

  quejas: QuejaDTO[] = []; // Lista de quejas recuperadas del servidor
  quejaSeleccionada: any = null; // Almacena la queja que se está respondiendo actualmente
  respuestaQueja: string = ""; // Texto de la respuesta que se enviará

  /**
   * Constructor del componente
   * @param adminService Servicio para realizar operaciones administrativas
   */
  constructor(private adminService: AdminService) {}

  /**
   * Método que se ejecuta al inicializar el componente
   * Carga la lista de quejas desde el servidor
   */
  ngOnInit() {
    this.cargarQuejas();
  }

  /**
   * Método para obtener todas las quejas desde el servidor
   * Utiliza el servicio de administrador para recuperar la información
   */
  cargarQuejas(): void {
    this.adminService.listarQuejas().subscribe({
      next: (data) => {
        this.quejas = data.respuesta; // Almacena las quejas recibidas del servidor
      },
      error: (error) => {
        console.error('Error al obtener quejas:', error);
      }
    });
  }

  /**
   * Método para abrir la ventana modal de respuesta
   * @param queja La queja que se va a responder
   */
  abrirModal(queja: any) {
    this.quejaSeleccionada = queja; // Guarda la queja seleccionada
    this.respuestaQueja = ""; // Limpia el campo de respuesta
    let modal = new bootstrap.Modal(document.getElementById('modalResponderQueja'));
    modal.show(); // Muestra el modal
  }

  /**
   * Método principal para enviar la respuesta a una queja
   * Valida la respuesta y la envía al servidor
   */
  enviarRespuesta() {
    // Verifica que la respuesta no esté vacía
    if (!this.respuestaQueja.trim()) {
      alert("Por favor, escribe una respuesta antes de enviar.");
      return;
    }
  
    // Llamada al servicio para enviar la respuesta al backend
    if (this.quejaSeleccionada) {
      this.adminService.responderQueja(this.quejaSeleccionada.id, this.respuestaQueja.trim()).subscribe(
        response => {
          // Mostrar mensaje de éxito
          alert(response.respuesta);
          
          // Actualiza la lista de quejas para reflejar los cambios
          this.cargarQuejas();
  
          // Cierra el modal
          let modal = bootstrap.Modal.getInstance(document.getElementById('modalResponderQueja'));
          modal.hide();
  
          // Limpia los campos temporales
          this.respuestaQueja = '';
          this.quejaSeleccionada = null;
        },
        error => {
          // Muestra mensaje de error si falla la operación
          alert('Hubo un error al responder la queja. Intenta de nuevo.');
          console.error(error);
        }
      );
    }
  }
}