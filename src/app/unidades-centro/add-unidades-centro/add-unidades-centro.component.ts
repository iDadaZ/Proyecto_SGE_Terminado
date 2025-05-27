import { UnidadCentro } from './../../shared/interfaces/unidades-centro';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CLOSE, INVALID_FORM, ENTIDAD_FAMILIA, ENTIDAD_UNIDADES_CENTRO } from '../../shared/messages';
import { UnidadesCentroService } from 'src/app/services/unidades.centro.service';

@Component({
  selector: 'app-add-unidades-centro',
  templateUrl: './add-unidades-centro.component.html',
  styleUrls: ['./add-unidades-centro.component.scss']
})
export class AddUnidadesCentroComponent implements OnInit {
  unidadCentroForm: FormGroup;

  ENTIDAD: String;

  constructor(public dialogRef: MatDialogRef<AddUnidadesCentroComponent>,
    private snackBar: MatSnackBar,
    private servicioUnidadesCentro: UnidadesCentroService
  ){ }

  ngOnInit(): void {
    this.unidadCentroForm = new FormGroup({
      unidad_centro: new FormControl(null, Validators.required),
      id_ciclo: new FormControl(null, Validators.required),
      observaciones: new FormControl(null)
    });
    this.ENTIDAD = ENTIDAD_UNIDADES_CENTRO;
  }

  async confirmAdd() {
    if (this.unidadCentroForm.valid) {
      const unidad_centro = this.unidadCentroForm.value as UnidadCentro;

      const RESPONSE = await this.servicioUnidadesCentro.addUnidadCentro(unidad_centro).toPromise();
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
