import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { GestionarQuejasComponent } from './gestionar-quejas.component';
import { AdminService }          from '../../services/admin.service';
import { QuejaDTO }              from '../../dto/queja/queja-dto';
import { MensajeDTO }            from '../../dto/mensaje-dto';

describe('GestionarQuejasComponent', () => {
  let component: GestionarQuejasComponent;
  let fixture:   ComponentFixture<GestionarQuejasComponent>;
  let mockAdmin: jasmine.SpyObj<AdminService>;
  let fakeModalInstance: { show: jasmine.Spy; hide: jasmine.Spy; };
  let originalBootstrap: any;

  beforeAll(() => {
    // Mock de bootstrap.Modal
    fakeModalInstance = { show: jasmine.createSpy('show'), hide: jasmine.createSpy('hide') };
    const FakeModal = function(el: any) { return fakeModalInstance; };
    (FakeModal as any).getInstance = () => fakeModalInstance;
    originalBootstrap = (window as any).bootstrap;
    (window as any).bootstrap = { Modal: FakeModal };
  });

  afterAll(() => {
    (window as any).bootstrap = originalBootstrap;
  });

  beforeEach(async () => {
    mockAdmin = jasmine.createSpyObj('AdminService', ['listarQuejas', 'responderQueja']);
    mockAdmin.listarQuejas.and.returnValue(of<MensajeDTO<QuejaDTO[]>>({
      error: false,
      respuesta: [{
        id: '1', clienteId: 'c1', nombreCliente: 'Ana',
        descripcion: 'Queja de prueba', fecha: new Date(),
        estadoQueja: 'PENDIENTE', respuestaQueja: null,
        nombreServicio: 'Corte', nombreEstilista: 'Juan'
      }]
    }));
    mockAdmin.responderQueja.and.returnValue(of<MensajeDTO<string>>({
      error: false,
      respuesta: 'Respuesta enviada'
    }));

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        GestionarQuejasComponent    // <-- Import standalone component aquí
      ],
      providers: [
        { provide: AdminService, useValue: mockAdmin }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionarQuejasComponent);
    component = fixture.componentInstance;
    spyOn(window, 'alert');
  });

  it('ngOnInit debe llamar a cargarQuejas()', () => {
    spyOn(component, 'cargarQuejas');
    component.ngOnInit();
    expect(component.cargarQuejas).toHaveBeenCalled();
  });

  describe('cargarQuejas()', () => {
    it('éxito: asigna lista de quejas', fakeAsync(() => {
      component.cargarQuejas();
      tick();
      expect(component.quejas.length).toBe(1);
      expect(component.quejas[0].descripcion).toBe('Queja de prueba');
    }));

    it('error: maneja excepción sin romper', fakeAsync(() => {
      mockAdmin.listarQuejas.and.returnValue(throwError(() => 'fallo'));
      spyOn(console, 'error');
      component.cargarQuejas();
      tick();
      expect(console.error).toHaveBeenCalledWith('Error al obtener quejas:', 'fallo');
      expect(component.quejas).toEqual([]);
    }));
  });

  describe('abrirModal()', () => {
    it('asigna quejaSeleccionada, limpia respuesta y abre modal', () => {
      const q: QuejaDTO = {
        id: '2', clienteId: 'c2', nombreCliente: 'Luis',
        descripcion: 'Otra queja', fecha: new Date(),
        estadoQueja: 'PENDIENTE', respuestaQueja: null,
        nombreServicio: 'Color', nombreEstilista: 'María'
      };
      component.respuestaQueja = 'previo';
      component.abrirModal(q);
      expect(component.quejaSeleccionada).toBe(q);
      expect(component.respuestaQueja).toBe('');
      expect(fakeModalInstance.show).toHaveBeenCalled();
    });
  });

  describe('enviarRespuesta()', () => {
    beforeEach(() => {
      component.quejaSeleccionada = { id: '5' } as any;
    });

    it('alerta si respuesta vacía', () => {
      component.respuestaQueja = '  ';
      component.enviarRespuesta();
      expect(window.alert)
        .toHaveBeenCalledWith('Por favor, escribe una respuesta antes de enviar.');
    });

    it('éxito: llama servicio, recarga, cierra modal y limpia', fakeAsync(() => {
      spyOn(component, 'cargarQuejas');
      component.respuestaQueja = 'OK';
      component.enviarRespuesta();
      tick();
      expect(mockAdmin.responderQueja).toHaveBeenCalledWith('5', 'OK');
      expect(window.alert).toHaveBeenCalledWith('Respuesta enviada');
      expect(component.cargarQuejas).toHaveBeenCalled();
      expect(fakeModalInstance.hide).toHaveBeenCalled();
      expect(component.quejaSeleccionada).toBeNull();
      expect(component.respuestaQueja).toBe('');
    }));

    it('error: muestra alerta de fallo y no limpia selección', fakeAsync(() => {
      mockAdmin.responderQueja.and.returnValue(throwError(() => 'err'));
      component.respuestaQueja = 'Test';
      component.enviarRespuesta();
      tick();
      expect(window.alert)
        .toHaveBeenCalledWith('Hubo un error al responder la queja. Intenta de nuevo.');
      expect(component.quejaSeleccionada).not.toBeNull();
    }));
  });

  describe('verDetalle()', () => {
    it('asigna datos y abre modal de detalle', () => {
      const fecha = new Date(2021, 5, 10);
      component.verDetalle('texto', 'Título', 'Peinado', 'Ana', fecha);
      expect(component.textoDetalle).toBe('texto');
      expect(component.tituloDetalle).toBe('Título');
      expect(component.nombreServicio).toBe('Peinado');
      expect(component.nombreEstilista).toBe('Ana');
      expect(component.fechaRespuesta).toEqual(fecha);
      expect(fakeModalInstance.show).toHaveBeenCalled();
    });
  });
});