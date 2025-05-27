// src/app/vacantes/vacante-form/vacante-form.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VacantesService } from '../../services/vacantes.service'; // Tu servicio
import { Vacante } from '../../shared/interfaces/vacante';
import { Alumnado } from '../../shared/interfaces/alumnado';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatTableDataSource } from '@angular/material/table'; // No es necesario si no usas MatTable

@Component({
  selector: 'app-vacante-form',
  templateUrl: './vacante-form.component.html',
  styleUrls: ['./vacante-form.component.scss']
})
export class VacanteFormComponent implements OnInit {

  vacanteForm: FormGroup;
  alumnosAsignados: Alumnado[] = []; // Alumnos actualmente en esta vacante
  alumnosDisponiblesParaAsignar: Alumnado[] = []; // Alumnos que aún no están asignados a esta vacante
  allAlumnosFromApi: Alumnado[] = []; // Todos los alumnos obtenidos de alumnos_disponibles.php

  isEditMode: boolean = false;
  vacanteId?: number;
  alumnoSeleccionadoId?: number; // **Importante: Usaremos 'number' para el ID seleccionado en el UI**

  constructor(
    private fb: FormBuilder,
    private vacantesService: VacantesService, // Tu servicio inyectado
    public dialogRef: MatDialogRef<VacanteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vacante?: Vacante },
    private snackBar: MatSnackBar
  ) {
    this.vacanteForm = this.fb.group({
      entidad: ['', Validators.required],
      unidad: ['', Validators.required],
      numAlumnos: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.vacante) {
      this.isEditMode = true;
      this.vacanteId = this.data.vacante.id_vacante;
      this.vacanteForm.patchValue(this.data.vacante);

      if (this.vacanteId) {
        this.loadAlumnosAsignados(this.vacanteId);
        this.loadAlumnosDisponiblesApi(this.vacanteId); // Cargar todos y luego filtrar
      }
    } else {
      // Si estamos creando una nueva vacante, la sección de alumnos no será visible
      // hasta que la vacante sea creada y se entre en modo edición.
    }
  }

  // Carga los alumnos ya asignados a la vacante actual usando tu método `getAlumnosVacante`
  loadAlumnosAsignados(idVacante: number): void {
    this.vacantesService.getAlumnosVacante(idVacante).subscribe( // Usamos tu método getAlumnosVacante
      (response) => {
        if (response.ok && response.data) {
          // **MAPEO NECESARIO**: Tu PHP devuelve `id_alumno` (string), nuestra interfaz espera `id` (number)
          this.alumnosAsignados = response.data.map((alumnoApi: any) => ({
            id: Number(alumnoApi.id_alumno), // Convertir a number y asignar a 'id'
            nombre: alumnoApi.nombre,
            apellidos: alumnoApi.apellidos
          })) as Alumnado[];
          this.filterAvailableAlumnos(); // Vuelve a filtrar los disponibles después de cargar asignados
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
    this.vacantesService.getAlumnosDisponibles(idVacante).subscribe( // Usamos tu método getAlumnosDisponibles
      (response) => {
        if (response.ok && response.data) {
          // Asume que alumnos_disponibles.php devuelve 'id', 'nombre', 'apellidos'
          // Si el ID de alumnos_disponibles.php es string, también necesitarás Number() aquí
          this.allAlumnosFromApi = response.data.map((alumnoApi: any) => ({
            id: Number(alumnoApi.id), // Asegúrate de que 'id' de la API se convierte a number
            nombre: alumnoApi.nombre,
            apellidos: alumnoApi.apellidos
          })) as Alumnado[];
          this.filterAvailableAlumnos(); // Filtra los que ya están asignados
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
      // **IMPORTANTE**: Convertimos el ID a string antes de enviarlo al servicio
      // porque tu servicio espera `idAlumno: string`.
      this.vacantesService.addAlumnoVacante(this.vacanteId, String(this.alumnoSeleccionadoId)).subscribe(
        (response) => {
          if (response.ok) {
            this.snackBar.open('Alumno añadido correctamente', 'Cerrar', { duration: 3000 });
            this.reloadAlumnosLists(); // Recargar ambas listas
            this.alumnoSeleccionadoId = undefined; // Resetear el select
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
      // **IMPORTANTE**: Convertimos el ID a string antes de enviarlo al servicio
      // porque tu servicio espera `idAlumno: string`.
      this.vacantesService.removeAlumnoVacante(this.vacanteId, String(alumno.id)).subscribe(
        (response) => {
          if (response.ok) {
            this.snackBar.open('Alumno eliminado correctamente', 'Cerrar', { duration: 3000 });
            this.reloadAlumnosLists(); // Recargar ambas listas
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

  // --- Métodos de formulario principales (ya los tenías) ---
  onSubmit(): void {
    if (this.vacanteForm.valid) {
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
      // Si se crea una nueva vacante con éxito, podemos cerrar el diálogo.
      // Si el backend devuelve el ID de la nueva vacante, podríamos considerar
      // pasar a modo edición para esa vacante, pero por ahora solo cerramos.
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
