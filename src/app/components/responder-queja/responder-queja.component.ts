import { Component } from '@angular/core';

@Component({
  selector: 'app-responder-queja',
  standalone: true,
  imports: [],
  templateUrl: './responder-queja.component.html',
  styleUrl: './responder-queja.component.css'
})
export class ResponderQuejaComponent {

  showForm = false;

  onResponder() {
    // Lógica para enviar la respuesta
    console.log('Respuesta enviada');
  }

}
