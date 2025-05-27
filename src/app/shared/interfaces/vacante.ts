import { Alumnado } from "./alumnado";

export interface Vacante {
  id_vacante: number;
  entidad: string;
  unidad: string;
  num_alumnos: number;
  alumnos?: Alumnado[]; // Array de alumnos asignados a la vacante (opcional)
  }
