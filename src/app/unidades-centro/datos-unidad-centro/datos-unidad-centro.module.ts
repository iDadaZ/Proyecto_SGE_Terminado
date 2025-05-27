import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudMaterialModule } from 'src/app/modules/crud-material/crud-material.module';
import { DatosUnidadCentroComponent } from './datos-unidad-centro.component';
import { DatosUnidadCentroRoutingModule } from './datos-unidad-centro.routing.module';


@NgModule({
  declarations: [DatosUnidadCentroComponent],
  imports: [
    CommonModule,
    DatosUnidadCentroRoutingModule,
    CrudMaterialModule
  ],
  exports: [DatosUnidadCentroComponent]
})
export class DatosUnidadCentroModule { }


