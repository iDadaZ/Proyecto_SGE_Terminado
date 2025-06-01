import { Component, OnInit, Inject, OnDestroy } from '@angular/core'; // Importar OnDestroy
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VacantesService } from '../../services/vacantes.service';
import { EntidadesService } from '../../services/entidades.service';
import { UnidadesCentroService } from 'src/app/services/unidades.centro.service';
import { AlumnadoService } from 'src/app/services/alumnado.service'; // Importar AlumnadoService
import { Vacante } from '../../shared/interfaces/vacante';
import { Alumnado } from '../../shared/interfaces/alumnado';
import { Entidad } from '../../shared/interfaces/entidad';
import { UnidadCentro } from '../../shared/interfaces/unidades-centro';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AbstractControl, ValidatorFn } from '@angular/forms';

// Validador personalizado
export function minCapacityValidator(currentStudents: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const numAlumnos = control.value;
    if (numAlumnos !== null && numAlumnos < currentStudents) {
      return { 'minCapacity': { requiredCapacity: currentStudents, actualCapacity: numAlumnos } };
    }
    return null;
  };
}

@Component({
  selector: 'app-vacante-form',
  templateUrl: './vacante-form.component.html',
  styleUrls: ['./vacante-form.component.scss']
})
export class VacanteFormComponent implements OnInit, OnDestroy {

  vacanteForm: FormGroup;
  alumnosAsignados: Alumnado[] = [];
  alumnosDisponiblesParaAsignar: Alumnado[] = [];
  allAlumnosFromApi: Alumnado[] = []; // Se usará para guardar todos los alumnos disponibles desde la API (del filtro por unidad)

  entidades: Entidad[] = [];
  isLoadingEntidades: boolean = false;

  unidadesCentro: UnidadCentro[] = [];
  isLoadingUnidadesCentro: boolean = false;

  isEditMode: boolean = false;
  vacanteId?: number;
  alumnoSeleccionadoId?: number;

  currentStudentsCount: number = 0;

  private formSubscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private vacantesService: VacantesService,
    private entidadesService: EntidadesService,
    private unidadesCentroService: UnidadesCentroService,
    private alumnadoService: AlumnadoService,
    public dialogRef: MatDialogRef<VacanteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vacante?: Vacante },
    private snackBar: MatSnackBar
  ) {

    const initialCurrentStudentsCount = this.data?.vacante?.current_students_count || 0;
    this.currentStudentsCount = initialCurrentStudentsCount;

    this.vacanteForm = this.fb.group({
      id_entidad: [null, Validators.required],
      id_unidad_centro: [null, Validators.required],
      num_alumnos: [null, [Validators.required, Validators.min(1), minCapacityValidator(this.currentStudentsCount)]],
    });
  }

  ngOnInit(): void {
    this.loadEntidades();
    this.loadUnidadesCentro();

    if (this.data && this.data.vacante) {
      this.isEditMode = true;
      this.vacanteId = this.data.vacante.id_vacante;
      this.vacanteForm.patchValue({
        id_entidad: this.data.vacante.id_entidad,
        id_unidad_centro: this.data.vacante.id_unidad_centro,
        num_alumnos: this.data.vacante.num_alumnos
      });

      this.currentStudentsCount = this.data.vacante.current_students_count || 0;

      if (this.vacanteId) {
        this.loadAlumnosAsignados(this.vacanteId);
        // Si estamos en modo edición y ya hay una unidad de centro, cargar alumnos disponibles para esa unidad
        if (this.data.vacante.id_unidad_centro) {
          this.loadAlumnosDisponiblesApi(this.data.vacante.id_unidad_centro);
        }
      }
    }

    this.formSubscription.add(
      this.vacanteForm.get('id_unidad_centro')?.valueChanges.subscribe(idUnidadCentro => {
        if (idUnidadCentro) {
          this.loadAlumnosDisponiblesApi(idUnidadCentro);
        } else {
          this.alumnosDisponiblesParaAsignar = [];
          this.allAlumnosFromApi = [];
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  loadEntidades(): void {
    this.isLoadingEntidades = true;
    this.entidadesService.get().pipe(
      finalize(() => this.isLoadingEntidades = false)
    ).subscribe(
      (response) => {
        if (response.ok && response.data) {
          this.entidades = response.data;
        } else {
          this.snackBar.open(`Error al cargar entidades: ${response.message}`, 'Cerrar', { duration: 3000 });
        }
      },
      (error) => {
        this.snackBar.open('Error al conectar con el servidor para cargar entidades', 'Cerrar', { duration: 3000 });
        console.error('Error cargando entidades:', error);
      }
    );
  }

  loadUnidadesCentro(): void {
    this.isLoadingUnidadesCentro = true;
    this.unidadesCentroService.get().pipe(
      finalize(() => this.isLoadingUnidadesCentro = false)
    ).subscribe(
      (response) => {
        if (response.ok && response.data) {
          this.unidadesCentro = response.data as UnidadCentro[];
        } else {
          this.snackBar.open(`Error al cargar unidades de centro: ${response.message}`, 'Cerrar', { duration: 3000 });
        }
      },
      (error) => {
        this.snackBar.open('Error al conectar con el servidor para cargar unidades de centro', 'Cerrar', { duration: 3000 });
        console.error('Error cargando unidades de centro:', error);
      }
    );
  }

  loadAlumnosAsignados(idVacante: number): void {
    this.vacantesService.getAlumnosVacante(idVacante).subscribe(
      (response) => {
        if (response.ok && response.data) {
          this.alumnosAsignados = response.data.map((alumnoApi: any) => ({
            id: String(alumnoApi.id_alumno),
            nombre: alumnoApi.nombre,
            apellidos: alumnoApi.apellidos,
            id_unidad_centro: Number(alumnoApi.id_unidad_centro)
          })) as Alumnado[];
          this.filterAvailableAlumnos();
        } else {
          this.alumnosAsignados = [];
          this.snackBar.open(`Error al cargar alumnos asignados: ${response.message}`, 'Cerrar', { duration: 3000 });
          this.filterAvailableAlumnos();
        }
      },
      (error) => {
        this.alumnosAsignados = [];
        this.snackBar.open('Error al conectar con el servidor cargando asignados', 'Cerrar', { duration: 3000 });
        console.error('Error cargando alumnos asignados:', error);
        this.filterAvailableAlumnos();
      }
    );
  }

  loadAlumnosDisponiblesApi(idUnidadCentro: number): void {
    if (!idUnidadCentro) {
      this.alumnosDisponiblesParaAsignar = [];
      this.allAlumnosFromApi = [];
      return;
    }

    this.alumnadoService.getAlumnadoUnidadCentro(idUnidadCentro).subscribe(
      (response) => {
        if (response.ok && response.data) {
          this.allAlumnosFromApi = response.data.map((alumnoApi: any) => ({
            id: String(alumnoApi.id),
            nombre: alumnoApi.nombre,
            apellidos: alumnoApi.apellidos,
            id_unidad_centro: Number(alumnoApi.id_unidad_centro)
          })) as Alumnado[];
          this.filterAvailableAlumnos();
        } else {
          this.allAlumnosFromApi = [];
          this.snackBar.open(`Error al cargar alumnos disponibles: ${response.message}`, 'Cerrar', { duration: 3000 });
          this.filterAvailableAlumnos();
        }
      },
      (error) => {
        this.allAlumnosFromApi = [];
        this.snackBar.open('Error al conectar con el servidor cargando disponibles', 'Cerrar', { duration: 3000 });
        console.error('Error cargando alumnos disponibles:', error);
        this.filterAvailableAlumnos();
      }
    );
  }

  filterAvailableAlumnos(): void {
    const assignedIds = new Set(this.alumnosAsignados.map(a => a.id));
    this.alumnosDisponiblesParaAsignar = this.allAlumnosFromApi.filter(
      (alumno) => !assignedIds.has(alumno.id)
    );
  }

  addAlumno(): void {
    if (this.alumnoSeleccionadoId && this.vacanteId) {
      this.vacantesService.addAlumnoVacante(this.vacanteId, String(this.alumnoSeleccionadoId)).subscribe(
        (response) => {
          if (response.ok) {
            this.snackBar.open('Alumno añadido correctamente', 'Cerrar', { duration: 3000 });
            this.reloadAlumnosLists();
            this.alumnoSeleccionadoId = undefined;
          } else {
            this.snackBar.open(`Error al añadir alumno: ${response.message}`, 'Cerrar', { duration: 3000 });
          }
        },
        (error) => {
          this.snackBar.open('Error al conectar con el servidor', 'Cerrar', { duration: 3000 });
          console.error('Error al añadir alumno:', error);
        }
      );
    } else {
      this.snackBar.open('Por favor, selecciona un alumno y asegúrate de que la vacante esté en modo edición.', 'Cerrar', { duration: 3000 });
    }
  }

  removeAlumno(alumno: Alumnado): void {
    if (this.vacanteId && alumno.id) {
      this.vacantesService.removeAlumnoVacante(this.vacanteId, alumno.id).subscribe(
        (response) => {
          if (response.ok) {
            this.snackBar.open('Alumno eliminado correctamente', 'Cerrar', { duration: 3000 });
            this.reloadAlumnosLists();
          } else {
            this.snackBar.open(`Error al eliminar alumno: ${response.message}`, 'Cerrar', { duration: 3000 });
          }
        },
        (error) => {
          this.snackBar.open('Error al conectar con el servidor', 'Cerrar', { duration: 3000 });
          console.error('Error al eliminar alumno:', error);
        }
      );
    }
  }

  private reloadAlumnosLists(): void {
    if (this.vacanteId) {
      this.loadAlumnosAsignados(this.vacanteId);
      const currentUnidadCentroId = this.vacanteForm.get('id_unidad_centro')?.value;
      if (currentUnidadCentroId) {
        this.loadAlumnosDisponiblesApi(currentUnidadCentroId);
      } else {
        this.alumnosDisponiblesParaAsignar = [];
        this.allAlumnosFromApi = [];
      }
    }
  }

  // --- Métodos de formulario principales ---
  onSubmit(): void {
    if (this.vacanteForm.valid) {
      const formValue = this.vacanteForm.value;

      const vacanteData: Vacante = {
        id_entidad: formValue.id_entidad,
        id_unidad_centro: formValue.id_unidad_centro,
        num_alumnos: formValue.num_alumnos,
        ...(this.isEditMode && this.vacanteId && { id_vacante: this.vacanteId })
      };

      if (this.isEditMode && this.vacanteId) {
        this.vacantesService.updateVacante(vacanteData).subscribe(
          (response) => {
            this.handleFormResponse(response, 'Vacante actualizada correctamente');
          },
          (error) => {
            this.snackBar.open('Error al conectar con el servidor', 'Cerrar', { duration: 3000 });
            console.error('Error al actualizar vacante:', error);
          }
        );
      } else {
        this.vacantesService.createVacante(vacanteData).subscribe(
          (response) => {
            this.handleFormResponse(response, 'Vacante creada correctamente');
          },
          (error) => {
            this.snackBar.open('Error al conectar con el servidor', 'Cerrar', { duration: 3000 });
            console.error('Error al crear vacante:', error);
          }
        );
      }
    } else {
      this.snackBar.open('Por favor, rellena todos los campos obligatorios.', 'Cerrar', { duration: 3000 });
      this.vacanteForm.markAllAsTouched();
    }
  }

  handleFormResponse(response: any, successMessage: string): void {
    if (response && response.ok) {
      this.snackBar.open(successMessage, 'Cerrar', { duration: 3000 });
      this.dialogRef.close({ ok: true, data: response.data });
    } else if (response && response.message) {
      this.snackBar.open(`Error: ${response.message}`, 'Cerrar', { duration: 3000 });
    } else {
      this.snackBar.open('Error desconocido', 'Cerrar', { duration: 3000 });
    }
  }

  onCancel(): void {
    this.dialogRef.close({ ok: false });
  }
}
