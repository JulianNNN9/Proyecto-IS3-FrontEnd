import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PublicoService } from '../../services/publico.service';
import { TokenService } from '../../services/token.service';
import Swal from 'sweetalert2';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { TokenDTO } from '../../dto/token-dto';
import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[routerLink]'
})
class MockRouterLinkDirective {
  @Input() routerLink: any;
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockFormBuilder: FormBuilder;
  let mockPublicoService: jasmine.SpyObj<PublicoService>;
  let mockTokenService: jasmine.SpyObj<TokenService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockPublicoService = jasmine.createSpyObj('PublicoService', ['iniciarSesion']);
    mockTokenService = jasmine.createSpyObj('TokenService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockFormBuilder = new FormBuilder();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent, RouterModule, LoginComponent],
      declarations: [
        MockRouterLinkDirective
      ],
      providers: [
        { provide: FormBuilder, useValue: mockFormBuilder },
        { provide: PublicoService, useValue: mockPublicoService },
        { provide: TokenService, useValue: mockTokenService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {}
            }
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the loginForm with email and contrasenia controls', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('contrasenia')).toBeTrue();
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('contrasenia')?.value).toBe('');
    expect(component.loginForm.get('email')?.validator).toBeTruthy();
    expect(component.loginForm.get('contrasenia')?.validator).toBeTruthy();
  });

  it('should toggle showPassword when togglePassword is called', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePassword();
    expect(component.showPassword).toBeTrue();
    component.togglePassword();
    expect(component.showPassword).toBeFalse();
  });

  // ¡SE ELIMINÓ LA PRUEBA RELACIONADA CON alertMessagesService!

  describe('onLogin with valid form', () => {
    beforeEach(() => {
      component.loginForm.controls['email'].setValue('test@example.com');
      component.loginForm.controls['contrasenia'].setValue('testpassword');
    });

    it('should call publicoService.iniciarSesion with form value', () => {
      mockPublicoService.iniciarSesion.and.returnValue(of<MensajeDTO<TokenDTO>>({ error: false, respuesta: { token: 'test-token' } }));
      component.onLogin();
      expect(mockPublicoService.iniciarSesion).toHaveBeenCalledWith({
        email: 'test@example.com',
        contrasenia: 'testpassword',
      });
    });

    it('should call Swal.fire on successful login and then tokenService.login', fakeAsync(() => {
      mockPublicoService.iniciarSesion.and.returnValue(of<MensajeDTO<TokenDTO>>({ error: false, respuesta: { token: 'test-token' } }));
      spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true } as any);
      component.onLogin();
      tick();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Inicio de Sesión',
          text: 'Ha iniciado sesión correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        })
      );
      expect(mockTokenService.login).toHaveBeenCalledWith('test-token');
    }));

    it('should call Swal.fire on login failure', fakeAsync(() => {
      const errorResponse: MensajeDTO<any> = { error: true, respuesta: 'Credenciales inválidas' };
      mockPublicoService.iniciarSesion.and.returnValue(throwError(() => ({ error: errorResponse }))); // ¡CORRECCIÓN AQUÍ!
      spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true } as any);
      component.onLogin();
      tick();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Error',
          text: 'Credenciales inválidas',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        })
      );
      expect(mockTokenService.login).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    }));

    /*
    it('should navigate to /activar-cuenta if login fails with "Esta cuenta aún no ha sido activada"', fakeAsync(() => {
      const errorResponse: MensajeDTO<any> = { error: true, respuesta: 'Esta cuenta aún no ha sido activada' };
      mockPublicoService.iniciarSesion.and.returnValue(throwError(() => ({ error: errorResponse }))); // ¡CORRECCIÓN AQUÍ!
      spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true } as any);
      component.onLogin();
      tick();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Error',
          text: 'Esta cuenta aún no ha sido activada',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        })
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/activar-cuenta']);
      expect(mockTokenService.login).not.toHaveBeenCalled();
    }));
    */
  });
});