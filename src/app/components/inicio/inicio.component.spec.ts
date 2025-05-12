import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioComponent } from './inicio.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('InicioComponent', () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Crear mocks para los servicios
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['obtenerRolUsuario']);

    // Configurar el comportamiento del mock para AuthService
    mockAuthService.obtenerRolUsuario.and.returnValue({ rol: 'CLIENTE' });

    await TestBed.configureTestingModule({
      imports: [InicioComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set esCliente to true if user role is CLIENTE', () => {
    component.ngOnInit();
    expect(component.esCliente).toBeTrue();
  });

  it('should call obtenerRolUsuario on ngOnInit', () => {
    component.ngOnInit();
    expect(mockAuthService.obtenerRolUsuario).toHaveBeenCalled();
  });

  it('should toggle mostrarOpciones when togglePQRS is called', () => {
    expect(component.mostrarOpciones).toBeFalse();
    component.togglePQRS();
    expect(component.mostrarOpciones).toBeTrue();
    component.togglePQRS();
    expect(component.mostrarOpciones).toBeFalse();
  });

  describe('seleccionarOpcion', () => {
    it('should navigate to nueva-queja route when option nueva-queja is selected', () => {
      component.seleccionarOpcion('nueva-queja');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/nueva-queja']);
    });

    it('should navigate to sugerencias route when option sugerencia is selected', () => {
      component.seleccionarOpcion('sugerencia');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sugerencias']);
    });

    it('should not navigate when an unknown option is selected', () => {
      component.seleccionarOpcion('unknown-option');
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('irAPreguntasFrecuentes', () => {
    it('should navigate to faq route when irAPreguntasFrecuentes is called', () => {
      component.irAPreguntasFrecuentes();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/faq']);
    });
  });
});