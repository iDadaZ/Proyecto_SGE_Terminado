import { UnidadCentro } from './../../shared/interfaces/unidades-centro';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CLOSE, INVALID_FORM, ENTIDAD_UNIDADES_CENTRO } from '../../shared/messages';
import { UnidadesCentroService } from 'src/app/services/unidades.centro.service';


@Component({
  selector: 'app-edit-unidades-centro',
  templateUrl: './edit-unidades-centro.component.html',
  styleUrls: ['./edit-unidades-centro.component.scss']
})
export class EditUnidadesCentroComponent implements OnInit {
  unidadCentroForm: FormGroup;

  ENTIDAD: String;

  constructor(public dialogRef: MatDialogRef<EditUnidadesCentroComponent>,
    private snackBar: MatSnackBar,
    private servicioUnidadesCentro: UnidadesCentroService,
    @Inject(MAT_DIALOG_DATA) public UnidadCentro: UnidadCentro
  ){ }

  ngOnInit(): void {
    this.ENTIDAD = ENTIDAD_UNIDADES_CENTRO;
    this.unidadCentroForm = new FormGroup({
      id_unidad_centro: new FormControl(this.UnidadCentro.id_unidad_centro,Validators.required),
      unidad_centro: new FormControl(this.UnidadCentro.unidad_centro, Validators.required),
      id_ciclo: new FormControl(this.UnidadCentro.id_ciclo, Validators.required),
      observaciones: new FormControl(this.UnidadCentro.observaciones)
    });
  }

  async confirmEdit() {
    if (this.unidadCentroForm.valid) {
      const unidad_centro = this.unidadCentroForm.value as UnidadCentro;

      const RESPONSE = await this.servicioUnidadesCentro.editUnidadCentro(unidad_centro).toPromise();
      if (RESPONSE.ok) {
        this.snackBar.open(RESPONSE.message, CLOSE, { duration: 5000 });
        this.dialogRef.close({ok: RESPONSE.ok, data: RESPONSE.data});
      } else {
        this.snackBar.open(RESPONSE.message, CLOSE, { duration: 5000 });
      }
    } else {
      this.snackBar.open(INVALID_FORM, CLOSE, { duration: 5000 });
    }
  }

  onNoClick() {
    this.dialogRef.close({ok: false});
  }
}
