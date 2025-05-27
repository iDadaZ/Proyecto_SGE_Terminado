import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UnidadesCentroService } from 'src/app/services/unidades.centro.service';
import { UnidadCentro } from 'src/app/shared/interfaces/unidades-centro';
import { Alumnado } from 'src/app/shared/interfaces/alumnado';
import { DatosUnidadCentroComponent } from '../datos-unidad-centro.component';
import { UNIDAD_CENTRO_UNIDAD_CENTRO, CLOSE, ERROR } from 'src/app/shared/messages';
import { UNIDAD_CENTRO_ALUMNO } from '../../../shared/messages';
import { Ciclo } from 'src/app/shared/interfaces/ciclo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-datos-basicos-unidad-centro',
  templateUrl: './datos-basicos-unidad-centro.component.html',
  styleUrls: ['./datos-basicos-unidad-centro.component.scss']
})
export class DatosBasicosUnidadCentroComponent implements OnInit {

  datosBasicosUnidadCentroForm: FormGroup;
  unidadCentro: UnidadCentro;
  alumno: Alumnado[];

  UNIDAD_CENTRO: String;

  constructor(
    private datosUnidadCentro: DatosUnidadCentroComponent,
    public unidadCentroService: UnidadesCentroService,

  ) {
    this.alumno = this.datosUnidadCentro.datosEditarUnidadCentro.alumno;
  }

  ngOnInit(): void {
    this.UNIDAD_CENTRO = UNIDAD_CENTRO_UNIDAD_CENTRO;
    this.setForm();

    this.datosBasicosUnidadCentroForm.valueChanges.subscribe(form => {
      this.unidadCentroService.setDatosBasicosUnidadCentro(form);
    })
  }

  setForm(): void {
    this.datosBasicosUnidadCentroForm = new FormGroup({
      id_unidad_centro: new FormControl(this.unidadCentroService.unidadCentroSeleccionada?.id_unidad_centro, Validators.required),
      unidad_centro: new FormControl(this.unidadCentroService.unidadCentroSeleccionada?.unidad_centro, Validators.required),
      id_ciclo: new FormControl(this.unidadCentroService.unidadCentroSeleccionada?.id_ciclo, Validators.required),
      observaciones: new FormControl(this.unidadCentroService.unidadCentroSeleccionada?.observaciones),
      nombre_centro: new FormControl(this.unidadCentroService.unidadCentroSeleccionada?.nombre_centro)
    });
  }
}
