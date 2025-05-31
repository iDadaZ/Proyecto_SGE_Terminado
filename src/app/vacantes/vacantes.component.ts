// src/app/components/vacantes/vacantes.component.ts

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Vacante } from '../shared/interfaces/vacante';
import { VacantesService } from '../services/vacantes.service';
import { VacanteFormComponent } from './vacante-form/vacante-form.component';
import { MatConfirmDialogComponent } from '../shared/components/mat-confirm-dialog/mat-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Alumnado } from '../shared/interfaces/alumnado';

@Component({
  selector: 'app-vacantes',
  templateUrl: './vacantes.component.html',
  styleUrls: ['./vacantes.component.scss']
})
export class VacantesComponent implements OnInit, AfterViewInit {
  vacantes: Vacante[] = [];
  // CAMBIADO: 'unidad' por 'unidad_centro'
  displayedColumns: string[] = ['id_vacante', 'entidad', 'unidad_centro', 'num_alumnos', 'alumnos', 'actions'];
  dataSource = new MatTableDataSource<Vacante>(this.vacantes);

  idVacanteFilter = new FormControl('');
  entidadFilter = new FormControl('');
  // CAMBIADO: 'unidadFilter' a 'unidadCentroFilter' y su control
  unidadCentroFilter = new FormControl('');
  numAlumnosFilter = new FormControl('');

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private VacantesService: VacantesService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    // No necesitas this.snackBar = snackBar; si ya está inyectado y usado directamente.
    // Esto es redundante y puede eliminarse.
  }

  ngOnInit(): void {
    this.loadVacantes();
    this.setupFilterListeners();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadVacantes(): void {
    this.VacantesService.getVacantes().subscribe(response => {
      if (response.ok) {
        this.vacantes = response.data as Vacante[];
        console.log('Datos de vacantes recibidos:', this.vacantes);

        this.vacantes.forEach(vacante => {
          if (vacante.id_vacante) {
            this.VacantesService.getAlumnosVacante(vacante.id_vacante).subscribe(
              (alumnosResponse: any) => {
                if (alumnosResponse.ok && alumnosResponse.data) {
                  vacante.alumnos = alumnosResponse.data.map((alumnoApi: any) => {
                    return {
                      id: alumnoApi.id_alumno,
                      nombre: alumnoApi.nombre,
                      apellidos: alumnoApi.apellidos
                    } as Alumnado;
                  });
                  console.log(`Alumnos para vacante ${vacante.id_vacante}:`, vacante.alumnos);
                } else {
                  console.warn(`No se encontraron alumnos para la vacante ${vacante.id_vacante} o la respuesta no es la esperada:`, alumnosResponse.message);
                  vacante.alumnos = [];
                }
              },
              (error) => {
                console.error(`Error al cargar alumnos para vacante ${vacante.id_vacante}:`, error);
                vacante.alumnos = [];
              }
            );
          }
        });

        this.dataSource.data = this.vacantes;
      } else {
        console.error('Error al cargar vacantes:', response.message);
      }
    });
  }

  setupFilterListeners(): void {
    this.dataSource.filterPredicate = (data: Vacante, filter: string) => {
      const lowerCaseFilter = filter.trim().toLowerCase();
      const idVacanteMatch = (data.id_vacante?.toString() || '').includes(lowerCaseFilter);
      const entidadMatch = (data.entidad?.toLowerCase() || '').includes(lowerCaseFilter);
      // CAMBIADO: 'unidad' a 'unidad_centro' para el filtro
      const unidadCentroMatch = (data.unidad_centro?.toLowerCase() || '').includes(lowerCaseFilter);
      const numAlumnosMatch = (data.num_alumnos?.toString() || '').includes(lowerCaseFilter);
      const alumnosMatch = (data.alumnos?.some(alumno =>
        `${alumno.nombre} ${alumno.apellidos}`.toLowerCase().includes(lowerCaseFilter)
      ) || false);

      // CAMBIADO: Incluir unidadCentroMatch en el retorno
      return idVacanteMatch || entidadMatch || unidadCentroMatch || numAlumnosMatch || alumnosMatch;
    };

    this.idVacanteFilter.valueChanges.subscribe(value => {
      this.dataSource.filter = value;
    });

    this.entidadFilter.valueChanges.subscribe(value => {
      this.dataSource.filter = value;
    });

    // CAMBIADO: Suscribir unidadCentroFilter en lugar de unidadFilter
    this.unidadCentroFilter.valueChanges.subscribe(value => {
      this.dataSource.filter = value;
    });

    this.numAlumnosFilter.valueChanges.subscribe(value => {
      this.dataSource.filter = value;
    });
  }

  mostrarAlumnos(vacante: Vacante): string {
    if (vacante.alumnos && vacante.alumnos.length > 0) {
      return vacante.alumnos.map(alumno => `${alumno.nombre} ${alumno.apellidos}`).join(', ');
    } else {
      return 'Sin alumnos asignados';
    }
  }

  crearNuevaVacante(): void {
    const dialogRef = this.dialog.open(VacanteFormComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.ok) {
        this.snackBar.open('Vacante creada correctamente', 'Cerrar', { duration: 3000 });
        this.loadVacantes();
      } else if (result && result.ok === false) {
        this.snackBar.open('La creación de la vacante fue cancelada', 'Cerrar', { duration: 3000 });
      }
    });
  }

  editarVacante(vacante: Vacante): void {
    const dialogRef = this.dialog.open(VacanteFormComponent, {
      width: '600px',
      data: { vacante: vacante }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.ok) {
        this.snackBar.open('Vacante actualizada correctamente', 'Cerrar', { duration: 3000 });
        this.loadVacantes();
      } else if (result && result.ok === false) {
        this.snackBar.open('La edición de la vacante fue cancelada', 'Cerrar', { duration: 3000 });
      }
    });
  }

  eliminarVacante(vacante: Vacante): void {
    const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Eliminación',
        // CAMBIADO: Usar vacante.unidad_centro en el mensaje de confirmación
        message: `¿Estás seguro de que deseas eliminar la vacante "${vacante.entidad} - ${vacante.unidad_centro}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.VacantesService.deleteVacante(vacante.id_vacante!).subscribe(
          (response) => {
            if (response.ok) {
              this.snackBar.open('Vacante eliminada correctamente', 'Cerrar', { duration: 3000 });
              this.loadVacantes();
            } else {
              this.snackBar.open(`Error al eliminar la vacante: ${response.message}`, 'Cerrar', { duration: 3000 });
            }
          },
          (error) => {
            this.snackBar.open('Error al conectar con el servidor', 'Cerrar', { duration: 3000 });
          }
        );
      } else {
        this.snackBar.open('La eliminación de la vacante fue cancelada', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
