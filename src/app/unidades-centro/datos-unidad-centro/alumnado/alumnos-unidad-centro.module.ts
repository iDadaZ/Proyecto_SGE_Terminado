import { NgModule, Pipe } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AlumnosUnidadCentroRoutingModule } from './alumnos-unidad-centro-routing.module';
import { AlumnosUnidadCentroComponent } from './alumnos-unidad-centro.component';
import { EditAlumnoComponent } from './edit-alumno/edit-alumno.component';
import { DeleteAlumnoComponent } from './delete-alumno/delete-alumno.component';
import { CrudMaterialModule } from '../../../modules/crud-material/crud-material.module';
import { AddAlumnoComponent } from './add-alumno/add-alumno.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { EdadPipe } from 'src/app/pipes/edad.pipe';




@NgModule({
  declarations: [
    AddAlumnoComponent,
    EditAlumnoComponent,
    DeleteAlumnoComponent,
    AlumnosUnidadCentroComponent,
    EdadPipe],
  imports: [
    CommonModule,
    CrudMaterialModule,
    AlumnosUnidadCentroRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [EdadPipe],
})
export class AlumnosUnidadCentroModule { }
