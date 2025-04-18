import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

/**
 * Componente principal de la aplicación
 * Funciona como contenedor de todos los demás componentes y define la estructura base
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // Texto mostrado en el pie de página
  footer: String="Universidad del Quindío - 2024-2";
  
  // Título de la aplicación
  title: String="Página Inicial de Laos";
}