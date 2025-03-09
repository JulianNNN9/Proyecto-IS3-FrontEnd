import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaQuejaComponent } from './nueva-queja.component';

describe('NuevaQuejaComponent', () => {
  let component: NuevaQuejaComponent;
  let fixture: ComponentFixture<NuevaQuejaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaQuejaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevaQuejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
