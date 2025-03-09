import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisQuejasComponent } from './mis-quejas.component';

describe('MisQuejasComponent', () => {
  let component: MisQuejasComponent;
  let fixture: ComponentFixture<MisQuejasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisQuejasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MisQuejasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
