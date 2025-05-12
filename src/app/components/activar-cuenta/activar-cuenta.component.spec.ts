import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PublicoService } from '../../services/publico.service';
import Swal from 'sweetalert2';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { ActivarCuentaComponent } from './activar-cuenta.component';


describe('ActivarCuentaComponent', () => {
    let component: ActivarCuentaComponent;
    let fixture: ComponentFixture<ActivarCuentaComponent>;
    let mockPublicoService: jasmine.SpyObj<PublicoService>;
    let mockRouter: jasmine.SpyObj<Router>;
  
    beforeEach(async () => {
      mockPublicoService = jasmine.createSpyObj('PublicoService', [
        'activarCuenta',
        'enviarCodigoActivacion'
      ]);
      
      mockPublicoService.activarCuenta.and.returnValue(
        of<MensajeDTO<string>>({ error: false, respuesta: 'Cuenta activada' })
      );
      
      mockPublicoService.enviarCodigoActivacion.and.returnValue(
        of<MensajeDTO<string>>({ error: false, respuesta: 'Código reenviado' }).pipe(delay(1))
      );
  
      mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  
      await TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          ActivarCuentaComponent
        ],
        providers: [
          FormBuilder,
          { provide: PublicoService, useValue: mockPublicoService },
          { provide: Router, useValue: mockRouter }
        ]
      }).compileComponents();
  
      // Mock completo de SweetAlert
      spyOn(Swal, 'fire').and.resolveTo({
        isConfirmed: true,
        isDenied: false,
        isDismissed: false
      });
  
      fixture = TestBed.createComponent(ActivarCuentaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty email and codigoActivacion', () => {
    const emailCtrl = component.activarCuentaForm.get('email')!;
    const codeCtrl = component.activarCuentaForm.get('codigoActivacion')!;

    expect(emailCtrl.value).toBe('');
    expect(codeCtrl.value).toBe('');
    expect(emailCtrl.validator).toBeTruthy();
    expect(codeCtrl.validator).toBeTruthy();
  });

  it('should mark controls invalid if empty on submit', () => {
    component.onActivateAccount();
    expect(component.activarCuentaForm.get('email')!.invalid).toBeTrue();
    expect(component.activarCuentaForm.get('codigoActivacion')!.invalid).toBeTrue();
  });

  describe('onActivateAccount', () => {
    beforeEach(() => {
      component.activarCuentaForm.setValue({
        email: 'test@example.com',
        codigoActivacion: '123456'
      });
    });

    it('should call activarCuenta when form is valid', () => {
      component.onActivateAccount();
      expect(mockPublicoService.activarCuenta)
        .toHaveBeenCalledWith({ email: 'test@example.com', codigoActivacion: '123456' });
    });

    it('should show success Swal and navigate to /login on success', fakeAsync(() => {
      component.onActivateAccount();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Cuenta Activada',
          text: 'Su cuenta ha sido activada correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
      );
      tick();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should show error Swal with backend mensaje on failure', () => {
      const err = { error: { respuesta: 'Código inválido' } };
      mockPublicoService.activarCuenta.and.returnValue(throwError(() => err));

      component.onActivateAccount();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Error',
          text: 'Código inválido',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      );
    });

    it('should show generic error Swal if no respuesta', () => {
      const err = { error: 'otro error' };
      mockPublicoService.activarCuenta.and.returnValue(throwError(() => err));

      component.onActivateAccount();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Error',
          text: 'No se pudo activar la cuenta.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      );
    });
  });

  describe('onResendCode', () => {
    it('should show success Swal and clear resendInProgress', fakeAsync(() => {
      component.activarCuentaForm.get('email')!.setValue('ok@example.com');
      component.onResendCode();
      
      tick(1); // Espera a que se complete el delay(1)
      
      // Verifica después de completar la operación
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Código reenviado',
          text: 'Se ha enviado un nuevo código de activación a su correo.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
      );
      expect(component.resendInProgress).toBeFalse();
    }));

    it('should show error Swal with backend mensaje on resend failure', () => {
      const err = { error: { respuesta: 'Error al reenviar' } };
      mockPublicoService.enviarCodigoActivacion.and.returnValue(throwError(() => err));

      component.activarCuentaForm.get('email')!.setValue('ok@example.com');
      component.onResendCode();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Error',
          text: 'Error al reenviar',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      );
      expect(component.resendInProgress).toBeFalse();
    });

    it('should show generic error Swal if no respuesta on resend', () => {
      const err = { error: 'otro' };
      mockPublicoService.enviarCodigoActivacion.and.returnValue(throwError(() => err));

      component.activarCuentaForm.get('email')!.setValue('ok@example.com');
      component.onResendCode();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Error',
          text: 'No se pudo reenviar el código.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      );
      expect(component.resendInProgress).toBeFalse();
    });

    it('should warn via Swal when email invalid', () => {
      component.activarCuentaForm.get('email')!.setValue('bad-email');
      component.onResendCode();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Correo requerido',
          text: 'Ingrese un correo válido antes de solicitar un nuevo código.',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        })
      );
      expect(component.resendInProgress).toBeFalse();
    });

    it('should warn via Swal when email empty', () => {
      component.activarCuentaForm.get('email')!.setValue('');
      component.onResendCode();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Correo requerido',
          text: 'Ingrese un correo válido antes de solicitar un nuevo código.',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        })
      );
      expect(component.resendInProgress).toBeFalse();
    });
  });
});