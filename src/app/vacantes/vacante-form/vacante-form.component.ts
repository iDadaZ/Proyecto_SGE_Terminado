import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VacantesService } from '../../services/vacantes.service';
import { EntidadesService } from '../../services/entidades.service'; // <--- NUEVA IMPORTACIÓN
import { Vacante } from '../../shared/interfaces/vacante';
import { Alumnado } from '../../shared/interfaces/alumnado';
import { Entidad } from '../../shared/interfaces/entidad'; // <--- NUEVA IMPORTACIÓN
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators'; // <--- NUEVA IMPORTACIÓN para el indicador de carga

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

  entidades: Entidad[] = []; // <--- NUEVA PROPIEDAD: Lista para almacenar las entidades disponibles
  isLoadingEntidades: boolean = false; // <--- NUEVA PROPIEDAD: Indicador de carga para entidades

  isEditMode: boolean = false;
  vacanteId?: number;
  alumnoSeleccionadoId?: number;

  constructor(
    private fb: FormBuilder,
    private vacantesService: VacantesService,
    private entidadesService: EntidadesService, // <--- INYECCIÓN DEL SERVICIO DE ENTIDADES
    public dialogRef: MatDialogRef<VacanteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vacante?: Vacante },
    private snackBar: MatSnackBar
  ) {
    this.vacanteForm = this.fb.group({
      id_entidad: [null, Validators.required], // <--- CAMBIADO: Ahora es id_entidad y es numérico
      unidad: ['', Validators.required],
      numAlumnos: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.loadEntidades(); // <--- NUEVA LLAMADA: Carga las entidades al iniciar el componente

    if (this.data && this.data.vacante) {
      this.isEditMode = true;
      this.vacanteId = this.data.vacante.id_vacante;
      // PatchValue usa los nombres de los controles del formulario.
      // Ahora el campo del formulario es 'id_entidad'.
      this.vacanteForm.patchValue({
        id_entidad: this.data.vacante.id_entidad, // Asigna el ID de la entidad
        unidad: this.data.vacante.unidad,
        numAlumnos: this.data.vacante.num_alumnos
      });

      if (this.vacanteId) {
        this.loadAlumnosAsignados(this.vacanteId);
        this.loadAlumnosDisponiblesApi(this.vacanteId);
      }
    }
  }

  // <--- NUEVO MÉTODO: Cargar entidades desde el servicio de entidades
  loadEntidades(): void {
    this.isLoadingEntidades = true; // Iniciar el indicador de carga
    this.entidadesService.get().pipe( // Llama al método get() de tu EntidadesService
      finalize(() => this.isLoadingEntidades = false) // Detener el indicador al finalizar
    ).subscribe(
      (response) => {
        if (response.ok && response.data) {
          this.entidades = response.data; // Asigna los datos de las entidades
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

  // Carga los alumnos ya asignados a la vacante actual
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

  // Carga todos los alumnos del sistema desde alumnos_disponibles.php
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

  // Filtra los alumnos que están disponibles para asignar (no están ya en la vacante actual)
  filterAvailableAlumnos(): void {
    if (this.allAlumnosFromApi && this.alumnosAsignados) {
      this.alumnosDisponiblesParaAsignar = this.allAlumnosFromApi.filter(
        (alumno) => !this.alumnosAsignados.some((asignado) => asignado.id === alumno.id)
      );
    }
  }

  // Añade el alumno seleccionado a la vacante
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

  // Elimina un alumno de la vacante
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

  // Método auxiliar para recargar las listas de alumnos después de una operación
  private reloadAlumnosLists(): void {
    if (this.vacanteId) {
      this.loadAlumnosAsignados(this.vacanteId);
      this.loadAlumnosDisponiblesApi(this.vacanteId);
    }
  }

  // --- Métodos de formulario principales ---
  onSubmit(): void {
    if (this.vacanteForm.valid) {
      // Los datos del formulario ya incluyen 'id_entidad' como número
      const vacanteData: Vacante = this.vacanteForm.value;
      if (this.isEditMode && this.vacanteId) {
        vacanteData.id_vacante = this.vacanteId;
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
