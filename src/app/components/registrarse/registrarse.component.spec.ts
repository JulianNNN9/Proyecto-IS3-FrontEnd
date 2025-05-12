import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { PublicoService } from '../../services/publico.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { RegistrarseComponent } from './registrarse.component';
import { CommonModule } from '@angular/common';

describe('RegistrarseComponent', () => {
  let component: RegistrarseComponent;
  let fixture: ComponentFixture<RegistrarseComponent>;
  let publicoServiceSpy: jasmine.SpyObj<PublicoService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const publicoSpy = jasmine.createSpyObj('PublicoService', ['crearUsuario']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RegistrarseComponent,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
      ],
      providers: [
        { provide: PublicoService, useValue: publicoSpy },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarseComponent);
    component = fixture.componentInstance;
    publicoServiceSpy = TestBed.inject(PublicoService) as jasmine.SpyObj<PublicoService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
      value: null,
    }));
  });

  it('debería registrar al usuario y navegar al login si el formulario es válido', fakeAsync(() => {
    const mockForm = {
      value: {
        cedula: '123456789',
        nombreCompleto: 'Juan Pérez',
        direccion: 'Calle 123',
        telefono: '5551234',
        email: 'juan@example.com',
        contrasenia: 'password123',
      },
      valid: true,
      controls: {},
    } as unknown as NgForm;

    publicoServiceSpy.crearUsuario.and.returnValue(
      of<MensajeDTO<string>>({ error: false, respuesta: 'Usuario creado exitosamente' })
    );

    component.clienteForm = {
      resetForm: jasmine.createSpy('resetForm'),
    } as unknown as NgForm;

    component.registrar(mockForm);
    tick();

    expect(publicoServiceSpy.crearUsuario).toHaveBeenCalledWith(mockForm.value);
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Cuenta creada',
      text: 'La cuenta se ha creado correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar',
    } as any));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.clienteForm.resetForm).toHaveBeenCalled();
  }));

  it('debería mostrar un mensaje de error si el registro falla', fakeAsync(() => {
    const mockForm = {
      value: {
        cedula: '123456789',
        nombreCompleto: 'Juan Pérez',
        direccion: 'Calle 123',
        telefono: '5551234',
        email: 'juan@example.com',
        contrasenia: 'password123',
      },
      valid: true,
      controls: {},
    } as unknown as NgForm;

    const errorResponse = {
      error: {
        respuesta: 'Error al crear el usuario',
      },
    };

    publicoServiceSpy.crearUsuario.and.returnValue(throwError(() => errorResponse));

    component.clienteForm = {
      resetForm: jasmine.createSpy('resetForm'),
    } as unknown as NgForm;

    component.registrar(mockForm);
    tick();

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Error',
      text: 'Error al crear el usuario',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    } as any));
  }));
});