import { Component } from '@angular/core';
import { QuejaSugerenciaService } from '../../services/queja-sugerencia.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-enviar-queja',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enviar-queja.component.html',
  styleUrl: './enviar-queja.component.css'
})
export class EnviarQuejaComponent {
  pqrs = { tipo: 'Queja', cliente: '', correo: '', descripcion: '' };
  esAnonimo = false;
  mensaje = '';

  constructor(private service: QuejaSugerenciaService, private clienteService: ClienteService) {}

  ngOnInit() {
    // Obtener los datos del cliente desde el backend
    /*this.clienteService.getDatosCliente().subscribe((cliente) => {
      this.pqrs.cliente = cliente.nombre;
      this.pqrs.correo = cliente.correo;
    });
    */
  }

  enviarPQRS() {
    // Si es anónimo, no se envían los datos del cliente
    const datosAEnviar = this.esAnonimo 
      ? { tipo: this.pqrs.tipo, descripcion: this.pqrs.descripcion } 
      : this.pqrs;

      /*
    this.service.enviarQuejaSugerencia(datosAEnviar).subscribe(() => {
      this.mensaje = 'Enviado correctamente';
      this.pqrs.descripcion = ''; // Limpiar solo la descripción
    });
    */
  }
}
