import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasEstilistaComponent } from './citas-estilista.component';

describe('CitasEstilistaComponent', () => {
  let component: CitasEstilistaComponent;
  let fixture: ComponentFixture<CitasEstilistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitasEstilistaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CitasEstilistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
