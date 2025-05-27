import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vacante } from '../shared/interfaces/vacante';
import { ApiResponse } from '../shared/interfaces/api-response';
import { CommonService } from '../shared/common.service';

const API_URL = 'http://79.72.60.13/app.radfpd.es/api/private';
const ENDPOINT_VACANTES = 'vacantes.php';
const ENDPOINT_ALUMNOS_VACANTE = 'vacantes_alumnos.php';
const ENDPOINT_ALUMNOS_DISPONIBLES = 'alumnos_disponibles.php';
const ENDPOINT_VACANTES_PENDIENTES = 'vacantes_pendientes.php';

@Injectable({
  providedIn: 'root'
})
export class VacantesService {

  constructor(private http: HttpClient, private CommonService: CommonService) { }

  getVacantes(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${API_URL}/${ENDPOINT_VACANTES}`, { headers: this.CommonService.getHeaders() });
  }

  createVacante(vacante: Vacante): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${API_URL}/${ENDPOINT_VACANTES}`, vacante, { headers: this.CommonService.getHeaders() });
  }

  updateVacante(vacante: Vacante): Observable<ApiResponse> {
    const url = `${API_URL}/${ENDPOINT_VACANTES}/${vacante.id_vacante}`; // Añadir el ID a la URL
    return this.http.put<ApiResponse>(url, vacante, { headers: this.CommonService.getHeaders() });
  }

  deleteVacante(idVacante: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${API_URL}/${ENDPOINT_VACANTES}?id=${idVacante}`, { headers: this.CommonService.getHeaders() });
  }

  getAlumnosVacante(idVacante: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${API_URL}/${ENDPOINT_ALUMNOS_VACANTE}?id_vacante=${idVacante}`, { headers: this.CommonService.getHeaders() });
  }

  addAlumnoVacante(idVacante: number, idAlumno: string): Observable<ApiResponse> {
    const body = { id_vacante: idVacante, id_alumno: idAlumno };
    return this.http.post<ApiResponse>(`${API_URL}/${ENDPOINT_ALUMNOS_VACANTE}`, body, { headers: this.CommonService.getHeaders() });
  }

  removeAlumnoVacante(idVacante: number, idAlumno: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${API_URL}/${ENDPOINT_ALUMNOS_VACANTE}?id_vacante=${idVacante}&id_alumno=${idAlumno}`, { headers: this.CommonService.getHeaders() });
  }

  getAlumnosDisponibles(idVacante?: number): Observable<ApiResponse> {
    const url = idVacante
      ? `${API_URL}/${ENDPOINT_ALUMNOS_DISPONIBLES}?id_vacante=${idVacante}`
      : `${API_URL}/${ENDPOINT_ALUMNOS_DISPONIBLES}`;
    return this.http.get<ApiResponse>(url, { headers: this.CommonService.getHeaders() });
  }

  getVacantesPendientes(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${API_URL}/${ENDPOINT_VACANTES_PENDIENTES}`, { headers: this.CommonService.getHeaders() });
  }

}
