import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAlumnoComponent } from './add-alumno/add-alumno.component';
import { DeleteAlumnoComponent } from './delete-alumno/delete-alumno.component';
import { EditAlumnoComponent } from './edit-alumno/edit-alumno.component';
import { AlumnosUnidadCentroComponent } from './alumnos-unidad-centro.component';


const routes: Routes = [
  { path: ':id', component: AlumnosUnidadCentroComponent },
  { path: 'add', component: AddAlumnoComponent },
  { path: 'edit/:id', component: EditAlumnoComponent },
  { path: 'delete/:id', component: DeleteAlumnoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes),],
  exports: [RouterModule],

})
export class AlumnosUnidadCentroRoutingModule { }
