import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { QuejaDTO } from '../../dto/queja/queja-dto';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-gestionar-quejas',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './gestionar-quejas.component.html',
  styleUrl: './gestionar-quejas.component.css'
})
export class GestionarQuejasComponent {

  quejas: QuejaDTO[] = []; // Lista de quejas
  quejaSeleccionada: any = null;
  respuestaQueja: string = "";

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.cargarQuejas();
  }

  cargarQuejas(): void {
    this.adminService.listarQuejas().subscribe({
      next: (data) => {
        this.quejas = data.respuesta; // Asegurar que se accede a la propiedad correcta
      },
      error: (error) => {
        console.error('Error al obtener quejas:', error);
      }
    });
  }

  abrirModal(queja: any) {
    this.quejaSeleccionada = queja;
    this.respuestaQueja = ""; // Resetear el campo de respuesta
    let modal = new bootstrap.Modal(document.getElementById('modalResponderQueja'));
    modal.show();
  }

  enviarRespuesta() {
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
          
          // Aquí puedes actualizar la lista de quejas o realizar alguna acción adicional
          this.cargarQuejas();  // Si tienes un método para recargar las quejas
  
          // Cerrar el modal
          let modal = bootstrap.Modal.getInstance(document.getElementById('modalResponderQueja'));
          modal.hide();
  
          // Limpiar los campos
          this.respuestaQueja = '';
          this.quejaSeleccionada = null;
        },
        error => {
          // Mostrar mensaje de error
          alert('Hubo un error al responder la queja. Intenta de nuevo.');
          console.error(error);
        }
      );
    }
  }
  
}
