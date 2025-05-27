import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path:'datos-basicos-unidad-centro',
    loadChildren: () => import('./datos-basicos-unidad-centro/datos-basicos-unidad-centro.module').then(m => m.DatosBasicosUnidadCentroModule),
    outlet: 'sidebar'
  },
  {
    path:'alumnos-unidad-centro',
    loadChildren: () => import('./alumnado/alumnos-unidad-centro.module').then(m => m.AlumnosUnidadCentroModule),
    outlet: 'sidebar'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatosUnidadCentroRoutingModule { }
