import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlumnadoService } from 'src/app/services/alumnado.service';
import { Alumnado } from 'src/app/shared/interfaces/alumnado';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ALUMNO, CLOSE } from 'src/app/shared/messages';

@Component({
  selector: 'app-delete-alumno',
  templateUrl: './delete-alumno.component.html',
  styleUrls: ['./delete-alumno.component.scss']
})
export class DeleteAlumnoComponent implements OnInit {

  ALUMNADO: string;

  constructor(
    public dialogRef: MatDialogRef<DeleteAlumnoComponent>,
    @Inject(MAT_DIALOG_DATA) public alumno: Alumnado,
    public servicioAlumno: AlumnadoService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.ALUMNADO = ALUMNO;
  }

  onNoClick(): void{
    this.dialogRef.close({ok:false});
  }

  async confirmDelete(){
  const alumnoId = this.alumno.id;
  const RESPONSE = await this.servicioAlumno.deleteAlumnado(alumnoId).toPromise();
    if (RESPONSE.ok){
      this.snackBar.open(RESPONSE.message, CLOSE, {duration: 5000});
      this.dialogRef.close({ok:RESPONSE.ok, data: RESPONSE.data});
    }else{
      this.snackBar.open(RESPONSE.message, CLOSE, {duration:5000})
    }
  }

}
