import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NavbarModule } from './shared/navbar/navbar.module';
import { AuthInterceptor } from './shared/interceptor.service';
import { FooterModule } from '../app/shared/footer/footer.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';



import { DatosEntidadComponent } from './entidades/datos-entidad/datos-entidad.component'
import { DatosReunionComponent } from './reuniones/datos-reunion/datos-reunion.component';
import { UnidadesCentroComponent } from './unidades-centro/unidades-centro.component';
import { AlumnosUnidadCentroComponent } from './unidades-centro/datos-unidad-centro/alumnado/alumnos-unidad-centro.component';
import { VacantesComponent } from './vacantes/vacantes.component';

import { VacantesModule } from './vacantes/vacantes.module';
import { MatConfirmDialogComponent } from './shared/components/mat-confirm-dialog/mat-confirm-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    MatConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NavbarModule,
    FooterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    VacantesModule,
    MatDialogModule


  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DatosEntidadComponent,
    DatosReunionComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
