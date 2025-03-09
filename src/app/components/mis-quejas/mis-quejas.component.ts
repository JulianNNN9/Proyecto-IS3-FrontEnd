import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-mis-quejas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-quejas.component.html',
  styleUrls: ['./mis-quejas.component.css']
})
export class MisQuejasComponent implements OnInit {
  quejas = [
    { descripcion: 'Queja 1', fecha: new Date(), estado: 'Pendiente' },
    { descripcion: 'Queja 2', fecha: new Date(), estado: 'Resuelta' },
    { descripcion: 'Queja 3', fecha: new Date(), estado: 'En proceso' }
  ];

  constructor() {}

  ngOnInit(): void {
// Cargar las quejas usando el servicio de cliente enviando el id del usuario
    // quejas = this.clienteService.obtenerQuejasPorClienteId(this.usuarioId);  
}}