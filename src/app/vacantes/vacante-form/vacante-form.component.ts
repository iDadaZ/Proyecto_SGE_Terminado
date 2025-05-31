import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VacantesService } from '../../services/vacantes.service';
import { EntidadesService } from '../../services/entidades.service';
import { UnidadesCentroService } from 'src/app/services/unidades.centro.service';
import { Vacante } from '../../shared/interfaces/vacante';
import { Alumnado } from '../../shared/interfaces/alumnado';
import { Entidad } from '../../shared/interfaces/entidad';
import { UnidadCentro } from '../../shared/interfaces/unidades-centro'; // <-- Importación de la interfaz de Unidad de Centro
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-vacante-form',
  templateUrl: './vacante-form.component.html',
  styleUrls: ['./vacante-form.component.scss']
})
export class VacanteFormComponent implements OnInit {

  vacanteForm: FormGroup;
  alumnosAsignados: Alumnado[] = [];
  alumnosDisponiblesParaAsignar: Alumnado[] = [];
  allAlumnosFromApi: Alumnado[] = [];

  entidades: Entidad[] = [];
  isLoadingEntidades: boolean = false;

  unidadesCentro: UnidadCentro[] = []; // <-- Propiedad para almacenar las unidades de centro
  isLoadingUnidadesCentro: boolean = false; // <-- Indicador de carga para unidades de centro

  isEditMode: boolean = false;
  vacanteId?: number;
  alumnoSeleccionadoId?: number;

  constructor(
    private fb: FormBuilder,
    private vacantesService: VacantesService,
    private entidadesService: EntidadesService,
    private unidadesCentroService: UnidadesCentroService, // <-- Inyección del servicio de Unidades de Centro
    public dialogRef: MatDialogRef<VacanteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vacante?: Vacante },
    private snackBar: MatSnackBar
  ) {
    this.vacanteForm = this.fb.group({
      id_entidad: [null, Validators.required],
      // ELIMINADO: 'unidad'
      id_unidad_centro: [null, Validators.required], // <-- NUEVO CAMPO: id_unidad_centro
      num_alumnos: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.loadEntidades();
    this.loadUnidadesCentro(); // <-- Carga las unidades de centro al iniciar el componente

    if (this.data && this.data.vacante) {
      this.isEditMode = true;
      this.vacanteId = this.data.vacante.id_vacante;
      // PatchValue usa los nombres de los controles del formulario.
      this.vacanteForm.patchValue({
        id_entidad: this.data.vacante.id_entidad,
        // ELIMINADO: unidad: this.data.vacante.unidad,
        id_unidad_centro: this.data.vacante.id_unidad_centro, // <-- Asigna el ID de la unidad de centro
        num_alumnos: this.data.vacante.num_alumnos // El backend devuelve num_alumnos, el formulario usa num_alumnos
      });

      if (this.vacanteId) {
        this.loadAlumnosAsignados(this.vacanteId);
        this.loadAlumnosDisponiblesApi(this.vacanteId);
      }
    }
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

  // MÉTODO MODIFICADO: Cargar unidades de centro usando .get()
  loadUnidadesCentro(): void {
    this.isLoadingUnidadesCentro = true;
    this.unidadesCentroService.get().pipe( // <-- Llamada a .get()
      finalize(() => this.isLoadingUnidadesCentro = false)
    ).subscribe(
      (response) => {
        if (response.ok && response.data) {
          this.unidadesCentro = response.data as UnidadCentro[]; // Castear a UnidadCentro[]
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
            id: Number(alumnoApi.id_alumno),
            nombre: alumnoApi.nombre,
            apellidos: alumnoApi.apellidos
          })) as Alumnado[];
          this.filterAvailableAlumnos();
        } else {
          this.alumnosAsignados = [];
          this.snackBar.open(`Error al cargar alumnos asignados: ${response.message}`, 'Cerrar', { duration: 3000 });
        }
      },
      (error) => {
        this.alumnosAsignados = [];
        this.snackBar.open('Error al conectar con el servidor cargando asignados', 'Cerrar', { duration: 3000 });
        console.error('Error cargando alumnos asignados:', error);
      }
    );
  }

  loadAlumnosDisponiblesApi(idVacante?: number): void {
    this.vacantesService.getAlumnosDisponibles(idVacante).subscribe(
      (response) => {
        if (response.ok && response.data) {
          this.allAlumnosFromApi = response.data.map((alumnoApi: any) => ({
            id: Number(alumnoApi.id),
            nombre: alumnoApi.nombre,
            apellidos: alumnoApi.apellidos
          })) as Alumnado[];
          this.filterAvailableAlumnos();
        } else {
          this.allAlumnosFromApi = [];
          this.snackBar.open(`Error al cargar alumnos disponibles: ${response.message}`, 'Cerrar', { duration: 3000 });
        }
      },
      (error) => {
        this.allAlumnosFromApi = [];
        this.snackBar.open('Error al conectar con el servidor cargando disponibles', 'Cerrar', { duration: 3000 });
        console.error('Error cargando alumnos disponibles:', error);
      }
    );
  }

  filterAvailableAlumnos(): void {
    if (this.allAlumnosFromApi && this.alumnosAsignados) {
      this.alumnosDisponiblesParaAsignar = this.allAlumnosFromApi.filter(
        (alumno) => !this.alumnosAsignados.some((asignado) => asignado.id === alumno.id)
      );
    }
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
    }
  }

  removeAlumno(alumno: Alumnado): void {
    if (this.vacanteId && alumno.id) {
      this.vacantesService.removeAlumnoVacante(this.vacanteId, String(alumno.id)).subscribe(
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
      this.loadAlumnosDisponiblesApi(this.vacanteId);
    }
  }

  // --- Métodos de formulario principales ---
  onSubmit(): void {
    if (this.vacanteForm.valid) {
      const formValue = this.vacanteForm.value;

      const vacanteData: Vacante = {
        id_entidad: formValue.id_entidad,
        id_unidad_centro: formValue.id_unidad_centro,
        num_alumnos: formValue.num_alumnos, // Mapeamos el nombre del campo del formulario
        // Asegúrate de que id_vacante esté presente si es modo edición
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
