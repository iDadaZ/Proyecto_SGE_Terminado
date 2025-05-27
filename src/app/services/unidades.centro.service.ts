import { Injectable } from '@angular/core';
import { UnidadCentro } from '../shared/interfaces/unidades-centro';
import { ApiResponse } from '../shared/interfaces/api-response';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../shared/common.service';
import { URL_API } from 'src/environments/environment';
import { Alumnado } from '../shared/interfaces/alumnado';

const ENDPOINT = 'unidades_centro';


@Injectable({
  providedIn: 'root'
})
export class UnidadesCentroService {

  UnidadCentro: UnidadCentro[];
  unidadCentroSeleccionada: UnidadCentro;
  alumnoSeleccionado: Alumnado;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  get() {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, { headers: this.commonService.headers });
  }

  getAllUnidadesCentro() {
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, { headers: this.commonService.headers });
  }

  addUnidadCentro(UnidadCentro: UnidadCentro) {
    const body = JSON.stringify(UnidadCentro);
    return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, { headers: this.commonService.headers });
  }

  editUnidadCentro(UnidadCentro: UnidadCentro) {
    const body = JSON.stringify(UnidadCentro);
    return this.http.put<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, { headers: this.commonService.headers });
  }

  deleteUnidadCentro(id: number|string) {
    return this.http.delete<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id=${id}`, {headers: this.commonService.headers });
  }
  setUnidadCentro(UnidadCentro: UnidadCentro){
    this.unidadCentroSeleccionada = UnidadCentro;
  }

  setDatosBasicosUnidadCentro(formUnidadCentro: any){
    this.unidadCentroSeleccionada.id_unidad_centro = formUnidadCentro.id_unidad_centro;
    this.unidadCentroSeleccionada.unidad_centro = formUnidadCentro.unidad_centro;
    this.unidadCentroSeleccionada.id_ciclo = formUnidadCentro.id_ciclo;
    this.unidadCentroSeleccionada.observaciones = formUnidadCentro.observaciones;
    this.unidadCentroSeleccionada.nombre_centro = formUnidadCentro.nombre_centro;
  }

  setAlumnosUnidadCentro(formUnidadCentro: any){
    this.alumnoSeleccionado.id = formUnidadCentro.id;
    this.alumnoSeleccionado.nombre = formUnidadCentro.nombre;
    this.alumnoSeleccionado.apellidos = formUnidadCentro.apellidos;
    this.alumnoSeleccionado.fecha_nacimiento = formUnidadCentro.fecha_nacimiento;
    this.alumnoSeleccionado.linkedin = formUnidadCentro.linkedin;
    this.alumnoSeleccionado.nivel_ingles = formUnidadCentro.nivel_ingles;
    this.alumnoSeleccionado.minusvalia = formUnidadCentro.minusvalia;
    this.alumnoSeleccionado.otra_formacion = formUnidadCentro.otra_formacion;
    this.alumnoSeleccionado.idUnidadCentro = formUnidadCentro.id_unidad_centro;
  }
}
