import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaConsumidorComponent } from './pantalla-consumidor.component';

describe('PantallaConsumidorComponent', () => {
  let component: PantallaConsumidorComponent;
  let fixture: ComponentFixture<PantallaConsumidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PantallaConsumidorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaConsumidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
