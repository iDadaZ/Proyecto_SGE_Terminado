import { Injectable } from '@angular/core';
import { Alumnado } from '../shared/interfaces/alumnado';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../shared/common.service';
import { ApiResponse } from '../shared/interfaces/api-response';
import { URL_API } from 'src/environments/environment';

const ENDPOINT = 'alumnado';

@Injectable({
  providedIn: 'root'
})
export class AlumnadoService {

  alumnado: Alumnado[];

  constructor(private http: HttpClient, private CommonService: CommonService) { }

  addAlumnado(alumno : Alumnado) {
      const body = JSON.stringify(alumno);
      return this.http.post<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, { headers: this.CommonService.headers });
    }

  editAlumnado(alumno : Alumnado) {
    const body = JSON.stringify(alumno);
    return this.http.put<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, body, { headers: this.CommonService.headers });
  }

  deleteAlumnado(id : String) {
    return this.http.delete<ApiResponse>(`${URL_API}/${ENDPOINT}.php?id=${id}`, { headers: this.CommonService.headers });
  }

  getAlumnadoUnidadCentro(unidadCentro : any) {
    console.log("unidadCentro enviado:", unidadCentro);
    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php?unidadCentro=${unidadCentro}`, { headers: this.CommonService.headers });
  }

  // **Nuevo método para obtener la lista de alumnos**
  getAlumnos() {
  return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, { headers: this.CommonService.headers });
}
}
