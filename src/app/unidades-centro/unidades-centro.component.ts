import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { UnidadCentro } from '../shared/interfaces/unidades-centro';
import { Permises } from '../shared/interfaces/api-response';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UnidadesCentroService } from '../services/unidades.centro.service';
import { Overlay } from '@angular/cdk/overlay';
import { DeleteUnidadesCentroComponent } from './delete-unidades-centro/delete-unidades-centro.component';
import { EditUnidadesCentroComponent } from './edit-unidades-centro/edit-unidades-centro.component';
import { AddUnidadesCentroComponent } from './add-unidades-centro/add-unidades-centro.component';
import { DatosUnidadCentroComponent } from './datos-unidad-centro/datos-unidad-centro.component';


@Component({
  selector: 'app-unidades-centro',
  templateUrl: './unidades-centro.component.html',
  styleUrls: ['./unidades-centro.component.scss']
})
export class UnidadesCentroComponent implements OnInit {

  dataSource: MatTableDataSource<UnidadCentro> = new MatTableDataSource();

  idUnidadCentro = new FormControl();
  unidadCentro = new FormControl();
  idCiclo = new FormControl();
  observaciones = new FormControl();

  permises: Permises;

  displayedColumns: string[];
  private filterValues = {id_unidad_centro: '', unidad_centro: '', id_ciclo: '', observaciones: ''};
  paginator: any;
  sort: any;


  constructor(
    public dialog: MatDialog,
    private UnidadesCentroService: UnidadesCentroService,
    private overlay: Overlay
  ) { }

  ngOnInit(): void {
    this.getUnidadesCentro();
    this.createFilter();
    this.onChanges();
  }


  async getUnidadesCentro() {
    const RESPONSE = await this.UnidadesCentroService.getAllUnidadesCentro().toPromise();
    this.permises = RESPONSE.permises;

    if (RESPONSE.ok) {

      this.UnidadesCentroService.UnidadCentro = RESPONSE.data as UnidadCentro[];
      this.displayedColumns = ['id_unidad_centro', 'unidad_centro', 'id_ciclo', 'observaciones','actions'];
      this.dataSource.data = this.UnidadesCentroService.UnidadCentro;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = this.createFilter();
      this.onChanges();
    }
  }

  async addUnidadCentro() {
    const DIALOGREF = this.dialog.open(AddUnidadesCentroComponent, { scrollStrategy: this.overlay.scrollStrategies.noop() });
    const RESULT = await DIALOGREF.afterClosed().toPromise();
    if (RESULT) {
      if (RESULT.ok) {
        this.UnidadesCentroService.UnidadCentro.push(RESULT.data);
        this.dataSource.data = this.UnidadesCentroService.UnidadCentro;
        this.ngOnInit();
      }
    }
  }

  async editUnidadCentro(UnidadCentro: UnidadCentro) {
    const DIALOGREF = this.dialog.open(EditUnidadesCentroComponent, { data: UnidadCentro, scrollStrategy: this.overlay.scrollStrategies.noop() });
    const RESULT = await DIALOGREF.afterClosed().toPromise();
    if (RESULT) {
      if (RESULT.ok) {
        this.UnidadesCentroService.editUnidadCentro(RESULT.data);
        this.dataSource.data = this.UnidadesCentroService.UnidadCentro;
        this.ngOnInit();
      }
    }
  }

  async deleteUnidadCentro(unidad: UnidadCentro) {
    const DIALOGREF = this.dialog.open(DeleteUnidadesCentroComponent, { data: unidad, scrollStrategy: this.overlay.scrollStrategies.noop() });
    const RESULT = await DIALOGREF.afterClosed().toPromise();
    if (RESULT) {
      if (RESULT.ok) {
        this.UnidadesCentroService.deleteUnidadCentro(RESULT.data);
        this.dataSource.data = this.UnidadesCentroService.UnidadCentro;
        this.ngOnInit();
      }
    }
  }

  async datosUnidadCentro(unidad: UnidadCentro){
    console.log("UnidadCentro modal:", unidad)

  const CENTRO = unidad;

  if (CENTRO){
    console.log("UnidadCentro enviado al modal:", CENTRO );

    const DIALOGREF = this.dialog.open(DatosUnidadCentroComponent,{
      width:'70em',
      maxWidth:'70em',
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      disableClose: true,
      data:unidad
    });

    const RESULT = await DIALOGREF.afterClosed().toPromise();
    await this.getUnidadesCentro();
  }
  }


  createFilter(): (UnidadCentro: UnidadCentro, filter: string) => boolean {
    const filterFunction = (UnidadCentro: UnidadCentro, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);

      if(UnidadCentro.observaciones==null){
        UnidadCentro.observaciones="Sin observaciones";
      }

      return UnidadCentro.id_unidad_centro.toString().indexOf(searchTerms.id_ciclo) !== -1
        && UnidadCentro.unidad_centro.toLowerCase().indexOf(searchTerms.observaciones.toLowerCase()) !== -1
        && UnidadCentro.observaciones.toLowerCase().indexOf(searchTerms.observaciones.toLowerCase()) !== -1
        && String(UnidadCentro.id_ciclo).toLowerCase().indexOf(String(searchTerms.unidad_centro).toLowerCase()) !== -1;


    };

    return filterFunction;
  }

  onChanges() {
    this.idUnidadCentro.valueChanges.subscribe(value => {
        this.filterValues.id_unidad_centro = value;
        this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.unidadCentro.valueChanges
    .subscribe(value => {
        this.filterValues.unidad_centro = value;
        this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.idCiclo.valueChanges
    .subscribe(value => {
        this.filterValues.id_ciclo = value;
        this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.observaciones.valueChanges
    .subscribe(value => {
        this.filterValues.observaciones = value;
        this.dataSource.filter = JSON.stringify(this.filterValues);
    });
  }

}
