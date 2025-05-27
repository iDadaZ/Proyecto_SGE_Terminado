import { Overlay } from '@angular/cdk/overlay';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlumnadoService } from 'src/app/services/alumnado.service';
import { UnidadesCentroService } from 'src/app/services/unidades.centro.service';
import { Alumnado } from 'src/app/shared/interfaces/alumnado';
import { Permises } from 'src/app/shared/interfaces/api-response';
import { UnidadCentro } from 'src/app/shared/interfaces/unidades-centro';
import { AddAlumnoComponent } from './add-alumno/add-alumno.component';
import { DeleteAlumnoComponent } from './delete-alumno/delete-alumno.component';
import { EditAlumnoComponent } from './edit-alumno/edit-alumno.component';
import { ActivatedRoute, Params } from '@angular/router';



@Component({
  selector: 'app-alumnos-unidad-centro',
  templateUrl: './alumnos-unidad-centro.component.html',
  styleUrls: ['./alumnos-unidad-centro.component.scss']
})
export class AlumnosUnidadCentroComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<Alumnado> = new MatTableDataSource();

  nombreFilter = new FormControl('');
  apellidosFilter = new FormControl('');
  fecha_nacimientoFilter = new FormControl('');
  linkedinFilter = new FormControl('');

  unidadCentro: UnidadCentro;
  idUnidadCentro: any;
  finalIdCentro: any
  alumno: Alumnado;
  permises: Permises;
  selection: SelectionModel<Alumnado>
  displayedColumns: string[];

  private filterValues = {
    nombre: '',
    apellidos: '',
    fecha_nacimiento: '',
    linkedin: ''
  };

  constructor(
    public dialog: MatDialog,
    private alumnosService: AlumnadoService,
    private overlay: Overlay,
    public unidadCentroService: UnidadesCentroService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      // Captura del parámetro de la URL (si existe)
      this.idUnidadCentro = params['id'];
      console.log('QueryParam ID:', params);

      // Captura de unidad seleccionada en el servicio (si existe)
      this.unidadCentro = this.unidadCentroService.unidadCentroSeleccionada;

      // Decide cuál ID usar
      this.finalIdCentro = this.unidadCentro?.id_unidad_centro ?? this.idUnidadCentro;

      console.log('UnidadCentro antes de llamar al servicio:', this.finalIdCentro);

      // Llama al servicio con el ID correcto
      this.getAlumnosUnidadCentro(this.finalIdCentro);
    });
  }




  async addAlumno(idUnidadCentro: number) {
    const dialogRef = this.dialog.open(AddAlumnoComponent, {
      data: idUnidadCentro,
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });

    const RESULT = await dialogRef.afterClosed().toPromise();
    if (RESULT) {
      if (RESULT.ok) {
        this.ngOnInit();
      }
    }
  }

  async deleteAlumno(alumno: Alumnado) {
    const dialogRef = this.dialog.open(DeleteAlumnoComponent, {
      data: alumno,
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });

    const RESULT = await dialogRef.afterClosed().toPromise();
    if (RESULT) {
      if (RESULT.ok) {
        this.ngOnInit();
      }
    }
  }

  async editAlumno(alumno: Alumnado, unidad : UnidadCentro) {
    const DATA = {alumno, unidad}
    const dialogRef = this.dialog.open(EditAlumnoComponent, {
      data: DATA,
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });

    const RESULT = await dialogRef.afterClosed().toPromise();
    if (RESULT) {
      if (RESULT.ok) {
        this.ngOnInit();
      }
    }
  }

  async getAlumnosUnidadCentro(unidadCentro: any) {
    console.log('Unidad centro pasada al get:', unidadCentro);
    const RESPONSE = await this.alumnosService.getAlumnadoUnidadCentro(unidadCentro).toPromise();
    this.permises = RESPONSE.permises;

    if (RESPONSE.ok) {
      this.alumnosService.alumnado = RESPONSE.data as Alumnado[];
      console.log(this.alumnosService.alumnado);
      this.displayedColumns = ['nombre', 'apellidos', 'fecha_nacimiento', 'linkedin', 'actions'];
      this.dataSource.data = this.alumnosService.alumnado;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = this.createFilter();
      this.selection = new SelectionModel<Alumnado>(false, [this.alumno])
      this.onChanges();
    }
  }

  createFilter(): (alumno: Alumnado, filter: string) => boolean {
    const filterFunction = (alumno: Alumnado, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      return alumno.nombre.toLowerCase().includes(searchTerms.nombre.toLowerCase()) &&
        alumno.apellidos.toLowerCase().includes(searchTerms.apellidos.toLowerCase()) &&
        alumno.fecha_nacimiento.toString().includes(searchTerms.fecha_nacimiento) &&
        alumno.linkedin.toLowerCase().includes(searchTerms.linkedin.toLowerCase());
    };
    return filterFunction;
  }

  onChanges() {
    this.nombreFilter.valueChanges.subscribe(value => {
      this.filterValues.nombre = value;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
    this.apellidosFilter.valueChanges.subscribe(value => {
      this.filterValues.apellidos = value;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
    this.fecha_nacimientoFilter.valueChanges.subscribe(value => {
      this.filterValues.fecha_nacimiento = value;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
    this.linkedinFilter.valueChanges.subscribe(value => {
      this.filterValues.linkedin = value;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
  }
}
