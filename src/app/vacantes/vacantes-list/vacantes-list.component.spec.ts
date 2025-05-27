import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacantesListComponent } from './vacantes-list.component';

describe('VacantesListComponent', () => {
  let component: VacantesListComponent;
  let fixture: ComponentFixture<VacantesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacantesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacantesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
