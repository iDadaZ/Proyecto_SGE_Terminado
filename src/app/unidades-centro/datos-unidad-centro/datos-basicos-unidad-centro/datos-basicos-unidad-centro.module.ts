import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatosBasicosUnidadCentroRoutingModule } from './datos-basicos-unidad-centro-routing.module';
import { DatosBasicosUnidadCentroComponent } from './datos-basicos-unidad-centro.component';
import { CrudMaterialModule } from '../../../modules/crud-material/crud-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [DatosBasicosUnidadCentroComponent],
  imports: [
    CommonModule,
    DatosBasicosUnidadCentroRoutingModule,
    CrudMaterialModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule
  ]
})
export class DatosBasicosUnidadCentroModule { }
