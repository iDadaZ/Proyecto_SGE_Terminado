import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CLOSE, ENTIDAD_UNIDADES_CENTRO } from '../../shared/messages';
import { UnidadCentro } from 'src/app/shared/interfaces/unidades-centro';
import { UnidadesCentroService } from 'src/app/services/unidades.centro.service';


@Component({
  selector: 'app-delete-unidades-centro',
  templateUrl: './delete-unidades-centro.component.html',
  styleUrls: ['./delete-unidades-centro.component.scss']
})
export class DeleteUnidadesCentroComponent implements OnInit {

  ENTIDAD: String;

  constructor(
    public dialogRef: MatDialogRef<DeleteUnidadesCentroComponent>,
    @Inject(MAT_DIALOG_DATA) public unidadCentro: UnidadCentro,
    public servicioUnidadesCentro: UnidadesCentroService,
    public snackBar: MatSnackBar,
  )
  {   }

  ngOnInit(): void {
    this.ENTIDAD = ENTIDAD_UNIDADES_CENTRO;
  }

  onNoClick(): void {
    this.dialogRef.close({ ok: false });
  }

  async confirmDelete() {
    const RESPONSE = await this.servicioUnidadesCentro.deleteUnidadCentro(this.unidadCentro.id_unidad_centro).toPromise();
    if (RESPONSE.ok) {
      this.snackBar.open(RESPONSE.message, CLOSE, { duration: 5000 });
      this.dialogRef.close({ ok: RESPONSE.ok, data: RESPONSE.data });
    } else { this.snackBar.open(RESPONSE.message, CLOSE, { duration: 5000 }); }
  }

}
