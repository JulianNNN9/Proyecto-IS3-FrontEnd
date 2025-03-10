import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponderQuejaComponent } from './responder-queja.component';

describe('ResponderQuejaComponent', () => {
  let component: ResponderQuejaComponent;
  let fixture: ComponentFixture<ResponderQuejaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponderQuejaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResponderQuejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
