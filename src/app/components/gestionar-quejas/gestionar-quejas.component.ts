import { Component } from '@angular/core';
import { QuejaSugerenciaService } from '../../services/queja-sugerencia.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { QuejaSugerenciaDTO } from '../../dto/quejasugerencia/queja-sugerencia-dto';

@Component({
  selector: 'app-gestionar-quejas',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './gestionar-quejas.component.html',
  styleUrl: './gestionar-quejas.component.css'
})
export class GestionarQuejasComponent {
  quejas: QuejaSugerenciaDTO[] = []; // Lista de quejas

  constructor(private service: QuejaSugerenciaService) {}

  ngOnInit() {
    this.cargarQuejas();
  }

  cargarQuejas(): void {
    this.service.obtenerQuejas().subscribe({
      next: (data) => {
        this.quejas = data.respuesta; // Asegurar que se accede a la propiedad correcta
      },
      error: (error) => {
        console.error('Error al obtener quejas:', error);
      }
    });
  }

  actualizarEstado(id: string, estado: 'En proceso' | 'Resuelto') {
    const mensaje = estado === 'Resuelto' ? 'Se ha atendido su solicitud' : 'En proceso de revisión';

    this.service.actualizarEstado(id, estado, mensaje).subscribe(() => {
      this.cargarQuejas(); // Recargar la lista después de actualizar
    }, error => {
      console.error('Error al actualizar estado:', error);
    });
  }
  
}
