import { Alumnado } from "./alumnado";

export interface Vacante {
  id_vacante: number;
  id_entidad?: number;
  entidad?: string;
//  unidad: string;  clase fantasma, no la voy a eliminar de la BDD por miedo ( es el ultimo cambio y estoy asustao ;p)
  num_alumnos: number;
  alumnos?: Alumnado[]; // Array de alumnos asignados a la vacante (opcional)

   id_unidad_centro?: number;
   unidad_centro?: String;
  }
