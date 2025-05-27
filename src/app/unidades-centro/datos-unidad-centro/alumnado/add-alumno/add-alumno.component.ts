import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlumnadoService } from 'src/app/services/alumnado.service';
import { CLOSE, INVALID_FORM, ENTIDAD_ENTIDAD } from 'src/app/shared/messages';
import { UNIDAD_CENTRO_ALUMNO } from '../../../../shared/messages';
import { Alumnado } from 'src/app/shared/interfaces/alumnado';

@Component({
  selector: 'app-add-alumno',
  templateUrl: './add-alumno.component.html',
  styleUrls: ['./add-alumno.component.scss']
})
export class AddAlumnoComponent implements OnInit {
  alumnoForm: FormGroup;
  alumnos: Alumnado[] = [];

  UNIDAD_CENTRO_ALUMNO: String;

  constructor(public dialogRef: MatDialogRef<AddAlumnoComponent>,
    private snackBar: MatSnackBar,
    private servicioAlumnos: AlumnadoService,

  ) { }

  ngOnInit(): void {
    this.alumnoForm = new FormGroup({
      id_unidad_centro: new FormControl(null, Validators.required),
      // id: new FormControl(null, Validators.required),  LO QUITO PARA QUE SE GENERE AUTOMATICAMENTE
      nombre: new FormControl(null, Validators.required),
      apellidos: new FormControl(null, Validators.required),
      fecha_nacimiento: new FormControl(null, Validators.required),
      linkedin: new FormControl(null),
      nivel_ingles: new FormControl(null),
      minusvalia: new FormControl(null, Validators.required),
      otra_formacion: new FormControl(null)
    })
  }

  async confirmAdd() {
    if (this.alumnoForm.valid) {
      const formValue = { ...this.alumnoForm.value };

      // Formatear fecha
      const fecha = new Date(formValue.fecha_nacimiento);
      formValue.fecha_nacimiento = fecha.toISOString().split('T')[0];

      // Validar nivel_ingles
      const nivelesValidos = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      if (!nivelesValidos.includes(formValue.nivel_ingles)) {
        formValue.nivel_ingles = 'A1';
      }

      const RESPONSE = await this.servicioAlumnos.addAlumnado(formValue).toPromise();
      console.log(formValue);

      if (RESPONSE.ok) {
        this.snackBar.open(RESPONSE.message, CLOSE, { duration: 5000 });
        this.dialogRef.close({ ok: RESPONSE.ok, data: RESPONSE.data });

        this.servicioAlumnos.getAlumnos().subscribe((alumnosActualizados) => {
          // Asigna los alumnos actualizados a la variable que está mostrando la lista
          this.alumnos = alumnosActualizados.data;
        });
      }
    }
  }



  onNoClick() {
    this.dialogRef.close({ok: false});
  }

}
