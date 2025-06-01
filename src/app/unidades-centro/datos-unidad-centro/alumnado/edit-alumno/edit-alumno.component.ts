import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlumnadoService } from 'src/app/services/alumnado.service';
import { Alumnado } from 'src/app/shared/interfaces/alumnado';
import { DatePipe } from '@angular/common';
import { ALUMNO, CLOSE, ERROR } from 'src/app/shared/messages';
import { UnidadCentro } from '../../../../shared/interfaces/unidades-centro';

@Component({
  selector: 'app-edit-alumno',
  templateUrl: './edit-alumno.component.html',
  styleUrls: ['./edit-alumno.component.scss']
})
export class EditAlumnoComponent implements OnInit {

  alumnoForm: FormGroup;
  alumnado: string;
  alumno: Alumnado;
  unidadCentro: UnidadCentro;

  constructor(
    public dialogRef: MatDialogRef<EditAlumnoComponent>,
    private snackBar: MatSnackBar,
    private servicioAlumnado: AlumnadoService,
    @Inject(MAT_DIALOG_DATA) public data: { alumno: Alumnado, unidadCentro: UnidadCentro },
    private datePipe: DatePipe,
  ) {
    this.alumno = data.alumno;
    this.unidadCentro = data.unidadCentro;
  }

  ngOnInit(): void {
    this.setForm();
  }

  setForm() {
    console.log(this.alumno);
    this.alumnoForm = new FormGroup({
      nombre: new FormControl(this.alumno.nombre, [Validators.required, Validators.maxLength(100)]),
      apellidos: new FormControl(this.alumno.apellidos, [Validators.required, Validators.maxLength(100)]),
      fecha_nacimiento: new FormControl(this.alumno.fecha_nacimiento ? new String(this.alumno.fecha_nacimiento) : null, Validators.required),
      linkedin: new FormControl(this.alumno.linkedin, [Validators.pattern(/^(https?:\/\/)?([\w]+\.)?linkedin\.com\/.*$/i), Validators.maxLength(255)]),
      nivel_ingles: new FormControl(this.alumno.nivel_ingles),
      minusvalia: new FormControl(this.alumno.minusvalia, [Validators.min(0), Validators.max(100)]),
      otra_formacion: new FormControl(this.alumno.otra_formacion, Validators.maxLength(500)),
      id_unidad_centro: new FormControl(this.alumno.id_unidad_centro, Validators.maxLength(20))
    });
    this.alumnado = ALUMNO;
  }

  /*
  async confirmEdit() {
    if (this.alumnoForm.valid) {
      const alumnoForm = {
        ...this.alumnoForm.value,
        id: this.alumno.id, // <--- Añadir ID original
        fecha_nacimiento: this.datePipe.transform(this.alumnoForm.value.fecha_nacimiento, 'yyyy-MM-dd') // cuidado con 'MM' mayúscula
      };
  }*/

      async confirmEdit() {
        if (this.alumnoForm.valid) {
          const formValues = this.alumnoForm.value;
          const formattedDate = this.datePipe.transform(formValues.fecha_nacimiento, 'yyyy-MM-dd');

          const alumnoForm: Alumnado = { // <-- Explicitly type alumnoForm as Alumnado
            id: this.alumno.id,
            nombre: formValues.nombre,
            apellidos: formValues.apellidos,
            fecha_nacimiento: formattedDate,
            linkedin: formValues.linkedin,
            nivel_ingles: formValues.nivel_ingles,
            minusvalia: formValues.minusvalia,
            otra_formacion: formValues.otra_formacion,
            id_unidad_centro: this.alumnoForm.get('id_unidad_centro')?.value
          };

          //alumado.id_Unidad_Centro = unidadCentro.idUnidadCentro

          console.log('Datos al backend:', alumnoForm);

          try {
            const RESPONSE = await this.servicioAlumnado.editAlumnado(alumnoForm).toPromise();
            console.log('Respuesta:', RESPONSE);
            if (RESPONSE.ok) {
              this.snackBar.open(RESPONSE.message, CLOSE, { duration: 5000 });
              this.dialogRef.close({ ok: RESPONSE.ok, data: RESPONSE.data });
            } else {
              this.snackBar.open(RESPONSE.message || ERROR, CLOSE, { duration: 5000 });
            }
          } catch (error) {
            console.error('Error llamando al servicio:', error);
            this.snackBar.open(ERROR, CLOSE, { duration: 5000 });
          }
        } else {
          this.snackBar.open(ERROR, CLOSE, { duration: 5000 });
        }
      }

  onNoClick() {
    this.dialogRef.close({ ok: false });
  }

}
