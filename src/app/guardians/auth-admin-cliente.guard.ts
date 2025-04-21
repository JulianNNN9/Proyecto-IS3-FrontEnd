import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthAdminClienteGuard implements CanActivate {
  constructor(private router: Router, private tokenService: TokenService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if (this.tokenService.isLogged() && (this.tokenService.getRol() === 'CLIENTE' || this.tokenService.getRol() === 'ADMINISTRADOR')) {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
  }
}