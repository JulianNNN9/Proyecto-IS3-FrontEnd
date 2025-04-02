import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';
import { HttpClientModule } from '@angular/common/http';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-mis-quejas',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './mis-quejas.component.html',
  styleUrls: ['./mis-quejas.component.css']
})
export class MisQuejasComponent implements OnInit {
  quejas: any[] = [];
  usuarioId: number = 1; // Esto debería obtenerse de un servicio de autenticación

  constructor(
    private clienteService: ClienteService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.cargarQuejas();
  }

  cargarQuejas(): void {

    console.log(this.tokenService.getIDCuenta())


    this.clienteService.obtenerQuejasPorClienteId(this.tokenService.getIDCuenta()).subscribe({
      next: (data) => {
        this.quejas = data.respuesta;
        console.log('Quejas cargadas:', this.quejas);
      },
      error: (error) => {
        console.error('Error al obtener quejas:', error);
      }
    });
  }
}