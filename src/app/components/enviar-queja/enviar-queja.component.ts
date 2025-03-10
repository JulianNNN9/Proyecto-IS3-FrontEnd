import { Component } from '@angular/core';
import { QuejaSugerenciaService } from '../../services/queja-sugerencia.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { TokenService } from '../../services/token.service';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { InformacionUsuarioDTO } from '../../dto/cuenta/informacion-usuario-dto';
import { EnviarQuejaSugerenciaDTO } from '../../dto/quejasugerencia/enviar-queja-sugerencia-dto';
import { PublicoService } from '../../services/publico.service';
import { AlertMessagesService } from 'jjwins-angular-alert-messages';
import { AlertMessagesModule } from 'jjwins-angular-alert-messages';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enviar-queja',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertMessagesModule],
  templateUrl: './enviar-queja.component.html',
  styleUrl: './enviar-queja.component.css',
})
export class EnviarQuejaComponent {
  pqrs = { tipo: '', cliente: '', correo: '', descripcion: '' };
  esAnonimo = false;
  descripcionVacia = false;
  tiposPqrs: string[] = [];

  constructor(
    private service: QuejaSugerenciaService,
    private clienteService: ClienteService,
    private tokenService: TokenService,
    private publicoService: PublicoService,
    private alertMessageService: AlertMessagesService
  ) {}

  ngOnInit() {
    this.cargarCliente();
    this.cargarTiposPqrs();
  }

  validarDescripcion() {
    this.descripcionVacia = this.pqrs.descripcion.trim() === '';
  }

  enviarPQRS() {
    this.validarDescripcion();
    if (this.descripcionVacia && this.pqrs.tipo === '') {
      this.alertMessageService.show(
        'Por favor selecciona un tipo de PQRS, La descripción no puede estar vacía',
        {
          cssClass: 'alerts-error',
          timeOut: 4000,
        }
      );
      return;
    }
    if (this.descripcionVacia) {
      this.alertMessageService.show('La descripción no puede estar vacía', {
        cssClass: 'alerts-error',
        timeOut: 4000,
      });
      return;
    }
    if (this.pqrs.tipo === '') {
      this.alertMessageService.show('Por favor selecciona un tipo de PQRS', {
        cssClass: 'alerts-error',
        timeOut: 4000,
      });
      return;
    }

    let datosAEnviar: EnviarQuejaSugerenciaDTO;

    if (this.esAnonimo) {
      datosAEnviar = {
        tipo: this.pqrs.tipo,
        cliente: '',
        descripcion: this.pqrs.descripcion,
      };
    } else {
      datosAEnviar = {
        tipo: this.pqrs.tipo,
        cliente: this.tokenService.getIDCuenta(),
        descripcion: this.pqrs.descripcion,
      };
    }

    this.service.enviarQuejaSugerencia(datosAEnviar).subscribe({
      next: (data) => {
        Swal.fire({
          title: this.pqrs.tipo + ' Enviada',
          text: `La ${this.pqrs.tipo} se ha creado correctamente`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error.error.respuesta,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }
  cargarTiposPqrs() {
    this.publicoService.listarTiposPqrs().subscribe((tipos) => {
      this.tiposPqrs = tipos.respuesta;
    });
  }
  cargarCliente() {
    this.clienteService
      .obtenerInformacionUsuario(this.tokenService.getIDCuenta())
      .subscribe((respuesta: MensajeDTO<InformacionUsuarioDTO>) => {
        if (respuesta.respuesta) {
          this.pqrs.cliente = respuesta.respuesta.nombreCompleto;
          this.pqrs.correo = respuesta.respuesta.email;
        }
      });
  }
}
