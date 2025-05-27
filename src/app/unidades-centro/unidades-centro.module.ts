import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { UnidadesCentroRoutingModule } from './unidades-centro-routing.module';
import { AddUnidadesCentroComponent } from './add-unidades-centro/add-unidades-centro.component';
import { DeleteUnidadesCentroComponent } from './delete-unidades-centro/delete-unidades-centro.component';
import { EditUnidadesCentroComponent } from './edit-unidades-centro/edit-unidades-centro.component';
import { CrudMaterialModule } from '../modules/crud-material/crud-material.module';
import { UnidadesCentroComponent } from './unidades-centro.component';
import { DatosUnidadCentroModule } from './datos-unidad-centro/datos-unidad-centro.module';




@NgModule({
  declarations: [
    UnidadesCentroComponent,
    AddUnidadesCentroComponent,
    DeleteUnidadesCentroComponent,
    EditUnidadesCentroComponent],
  imports: [
    CommonModule,
    UnidadesCentroRoutingModule,
    CrudMaterialModule,
    DatosUnidadCentroModule
  ],
  providers:[DatePipe]
})
export class UnidadesCentroModule { }
