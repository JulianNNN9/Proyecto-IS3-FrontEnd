import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {
  servicios = [
    {
      nombre: 'Corte de Cabello',
      descripcion: 'Cortes modernos y clásicos para todos los estilos',
      imagen: 'https://picsum.photos/400/300?random=1',
      precio: '$ 25.000'
    },
    {
      nombre: 'Tinte y Color',
      descripcion: 'Coloración profesional con productos de alta calidad',
      imagen: 'https://picsum.photos/400/300?random=2',
      precio: '$ 80.000'
    },
    {
      nombre: 'Peinados',
      descripcion: 'Peinados para ocasiones especiales y eventos',
      imagen: 'https://picsum.photos/400/300?random=3',
      precio: 'Desde $ 45.000'
    },
    {
      nombre: 'Tratamientos Capilares',
      descripcion: 'Hidratación y reparación para tu cabello',
      imagen: 'https://picsum.photos/400/300?random=4',
      precio: 'Desde $ 60.000'
    }
  ];

  constructor(
    private router: Router,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void { }

  agendarCita(): void {
    if (this.tokenService.getToken()) {
      this.router.navigate(['/agendar-cita']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}