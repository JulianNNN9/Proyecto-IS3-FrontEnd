import { Component } from '@angular/core';

/**
 * Componente para el pie de página de la aplicación
 * Muestra información común en la parte inferior de todas las páginas
 * como enlaces de contacto, redes sociales, información legal, etc.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  // Este componente es principalmente declarativo
  // Muestra información estática definida en la plantilla HTML
  // No requiere lógica adicional en TypeScript
}