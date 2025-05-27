import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UnidadesCentroService } from '../../services/unidades.centro.service';
import { DatosEditarUnidadCentro } from 'src/app/shared/interfaces/datos-editar-unidad-centro';
import { CLOSE } from 'src/app/shared/messages';
import { UnidadCentro } from 'src/app/shared/interfaces/unidades-centro';

@Component({
  selector: 'app-datos-unidad-centro',
  templateUrl: './datos-unidad-centro.component.html',
  styleUrls: ['./datos-unidad-centro.component.scss']
})

export class DatosUnidadCentroComponent implements OnInit{
  @ViewChild(RouterOutlet, {static: false}) outlet: RouterOutlet;
  rutaSeleccionada: string;
  unidadCentroForm: FormGroup;

  //No me haria falta, ya que inyectamos el dato mediante datosEditarUnidadCentro mediante @Inject(MAT_DIALOG-DATA) haciendo referencia al DIALOGREF (unidades-centro.component)
  unidadCentro: UnidadCentro;

  constructor(
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public datosEditarUnidadCentro: any,
    private unidadCentroService: UnidadesCentroService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DatosUnidadCentroComponent>,
  ) { }


  ngOnInit(): void {

    console.log(this.datosEditarUnidadCentro)


    //  this.unidadCentroService.setUnidadCentro(this.datosEditarUnidadCentro.unidadCentro);

    this.rutaSeleccionada = this.router.url.substring(1);
    this.rutaSeleccionada = this.rutaSeleccionada.split('/')[0];
    this.router.navigate([`/${this.rutaSeleccionada}`, {outlets: {sidebar: 'datos-basicos-unidad-centro'}}])

  }

  navega(ruta: string, id?: number){

    if (id){
      console.log(id)
      this.router.navigate([`/${this.rutaSeleccionada}`, {outlets: {sidebar: ruta + "/" + id}}]);
    }else{
    this.router.navigate([`/${this.rutaSeleccionada}`, {outlets: {sidebar: ruta}}]);
    }
  }

  async save() {
    console.log(this.datosEditarUnidadCentro.unidadCentro)
    this.unidadCentroService.setUnidadCentro(this.datosEditarUnidadCentro.unidadCentro);
    const RESPONSE = await this.unidadCentroService.editUnidadCentro(this.datosEditarUnidadCentro.unidadCentro).toPromise();
    if(RESPONSE.ok){
      console.log(RESPONSE);
      console.log('hola')
      this.snackBar.open(RESPONSE.message, CLOSE, {duration:5000});
      this.dialogRef.close({ok: RESPONSE.ok, unidadCentro: this.datosEditarUnidadCentro.unidadCentro});
      console.log('buenas tardes')

    }else{
      this.snackBar.open(RESPONSE.message, CLOSE, { duration: 5000 });
    }
  }

  onNoClick() {
    this.dialogRef.close({ unidadCentro: this.datosEditarUnidadCentro.unidadCentro });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

