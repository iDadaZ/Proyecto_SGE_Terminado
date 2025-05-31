import { Vacante } from './../../shared/interfaces/vacante';
import { Component, OnInit } from '@angular/core';
import { VacantesService } from '../../services/vacantes.service';
import { VacantePendiente } from '../../shared/interfaces/vacante-pendiente';
import { VacanteFormComponent } from '../vacante-form/vacante-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatConfirmDialogComponent } from 'src/app/shared/components/mat-confirm-dialog/mat-confirm-dialog.component';


@Component({
  selector: 'app-vacantes-list',
  templateUrl: './vacantes-list.component.html',
  styleUrls: ['./vacantes-list.component.scss']
})
export class VacantesListComponent implements OnInit {

  vacantes: Vacante[] = [];
  vacantesPendientes: VacantePendiente[] = [];
  // CAMBIADO: 'unidad' por 'unidad_centro' en las columnas mostradas
  displayedColumns: string[] = ['entidad', 'unidad_centro', 'num_alumnos', 'alumnos', 'acciones']; // Usamos 'num_alumnos' directamente

  constructor(
    private vacantesService: VacantesService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadVacantes();
    this.loadVacantesPendientes();
  }

  loadVacantes(): void {
    this.vacantesService.getVacantes().subscribe(
      (response) => {
        if (response.ok) {
          this.vacantes = response.data as Vacante[];
          console.log('Vacantes cargadas:', this.vacantes);
        } else {
          console.error('Error al cargar las vacantes:', response.message);
        }
      },
      (error) => {
        console.error('Error en la petición para cargar vacantes:', error);
      }
    );
  }

  loadVacantesPendientes(): void {
    this.vacantesService.getVacantesPendientes().subscribe(
      (response) => {
        if (response.ok) {
          this.vacantesPendientes = response.data as VacantePendiente[];
          this.vacantesPendientes.forEach(pendiente => {
            pendiente.textoResumen = `${pendiente.pendientes}/${pendiente.total}`;
          });
          console.log('Vacantes pendientes cargadas:', this.vacantesPendientes);
        } else {
          console.error('Error al cargar las vacantes pendientes:', response.message);
        }
      },
      (error) => {
        console.error('Error en la petición para cargar vacantes pendientes:', error);

      }
    );
  }

  editarVacante(vacante: Vacante): void {
    const dialogRef = this.dialog.open(VacanteFormComponent, {
      width: '600px',
      data: { vacante: vacante } // Pasa la vacante al formulario en modo edición
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.ok) {
        this.snackBar.open('Vacante actualizada correctamente', 'Cerrar', { duration: 3000 });
        this.loadVacantes();
        this.loadVacantesPendientes();
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
        this.vacantesService.deleteVacante(vacante.id_vacante!).subscribe(
          (response) => {
            if (response.ok) {
              this.snackBar.open('Vacante eliminada correctamente', 'Cerrar', { duration: 3000 });
              this.loadVacantes();
              this.loadVacantesPendientes();
            } else {
              this.snackBar.open(`Error al eliminar la vacante: ${response.message}`, 'Cerrar', { duration: 3000 });
            }
          },
          (error) => {
            this.snackBar.open('Error al conectar con el servidor', 'Cerrar', { duration: 3000 });
          }
        );
      }
    });
  }

  crearNuevaVacante(): void {
    const dialogRef = this.dialog.open(VacanteFormComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.ok) {
        this.snackBar.open('Vacante creada correctamente', 'Cerrar', { duration: 3000 });
        this.loadVacantes();
        this.loadVacantesPendientes();
      } else if (result && result.ok === false) {
        this.snackBar.open('La creación de la vacante fue cancelada', 'Cerrar', { duration: 3000 });
      }
    });
  }

  mostrarAlumnos(vacante: Vacante): string {
    if (vacante.alumnos && vacante.alumnos.length > 0) {
      return vacante.alumnos.map(alumno => `${alumno.nombre} ${alumno.apellidos}`).join(', ');
    }
    return 'Sin alumnos asignados';
  }

  // MÉTODO PENDIENTES: Este método `getPendientesResumen` sigue usando `unidad` en `vacantesPendientes`.
  // Si `vacantes_pendientes.php` aún devuelve `unidad` y no `unidad_centro` para los pendientes,
  // deberías considerar actualizar el backend de vacantes_pendientes.php para que refleje la nueva estructura,
  // o si no es posible, ajustar cómo se manejan los datos aquí.
  // Por ahora, se mantiene tal cual estaba para evitar romperlo si el backend no ha cambiado.
  getPendientesResumen(unidad: string): string {
    const pendiente = this.vacantesPendientes.find(p => p.unidad === unidad);
    return pendiente ? pendiente.textoResumen : '';
  }
}
