import { Alumnado } from "./alumnado";

export interface Vacante {
  id_vacante: number;
  id_entidad?: number;
  id_unidad_centro: number;
  entidad: string;
  unidad: string;
  num_alumnos: number;
  alumnos?: Alumnado[]; // Array de alumnos asignados a la vacante (opcional)
  }
