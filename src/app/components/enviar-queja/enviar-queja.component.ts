import { Component } from '@angular/core';
import { QuejaSugerenciaService } from '../../services/queja-sugerencia.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enviar-queja',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enviar-queja.component.html',
  styleUrl: './enviar-queja.component.css'
})
export class EnviarQuejaComponent {
  pqrs = { tipo: 'Queja', cliente: '', descripcion: '' }; // Se declara el objeto `pqrs`
  mensaje = '';

  constructor(private service: QuejaSugerenciaService) {}

  enviarPQRS() { // Se usa el nombre correcto de la función en el HTML
    this.service.enviarQuejaSugerencia(this.pqrs).subscribe(() => {
      this.mensaje = 'Enviado correctamente';
      this.pqrs = { tipo: 'Queja', cliente: '', descripcion: '' }; // Se limpia el formulario
    });
  }
}
