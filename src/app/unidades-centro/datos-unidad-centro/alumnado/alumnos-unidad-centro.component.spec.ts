import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnosUnidadCentroComponent } from './alumnos-unidad-centro.component';

describe('AlumnosUnidadCentroComponent', () => {
  let component: AlumnosUnidadCentroComponent;
  let fixture: ComponentFixture<AlumnosUnidadCentroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlumnosUnidadCentroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnosUnidadCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
