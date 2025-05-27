import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VacantesListComponent } from './vacantes-list/vacantes-list.component';
import { VacanteFormComponent } from './vacante-form/vacante-form.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { VacantesRoutingModule } from './vacantes-routing.module';
import { VacantesComponent } from './vacantes.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatListModule } from '@angular/material/list';     // Para mat-list, mat-list-item

import { MatDividerModule } from '@angular/material/divider'; // Para mat-divider
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    VacantesListComponent,
    VacanteFormComponent,
    VacantesComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    HttpClientModule,
    VacantesRoutingModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule
  ],
  exports: [
    VacantesComponent, // Exporta VacantesComponent si lo vas a usar en otro módulo
    VacantesListComponent // Exporta VacantesListComponent si lo vas a usar en otro módulo
  ]
})
export class VacantesModule { }
