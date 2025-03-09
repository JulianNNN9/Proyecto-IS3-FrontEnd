import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../services/token.service';
import { PublicoService } from '../../services/publico.service';
import { MensajeDTO } from '../../dto/mensaje-dto';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {

  title: string = 'LAOS'; // Declarar la variable title
  isLoggedIn: boolean;
  loggedInUser: string | null;

  constructor(
    private tokenService: TokenService,
    private publicoService: PublicoService,
  ){
    
  }

  ngOnInit() {
    if(this.tokenService.isLogged()){
      this.loggedInUser = this.tokenService.getNombre();
    }

  }

  isAutenticado(){
    return this.tokenService.isLogged();
  }

  logout(){
    this.tokenService.logout();
  }
  isAdmin(){
    if(this.isAutenticado() && this.tokenService.getRol() === 'ADMINISTRADOR'){
      return true;
    }
    return false;
  }
  isCliente(){
    if(this.isAutenticado() && this.tokenService.getRol() === 'CLIENTE'){
      return true;
    }
    return false;
  }

}
