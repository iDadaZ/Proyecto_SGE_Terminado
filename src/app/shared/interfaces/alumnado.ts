export interface Alumnado {
  id: string;
  nombre: String;
  apellidos: String;
  fecha_nacimiento: String;
  linkedin?: String;
  nivel_ingles:'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  minusvalia: number;
  otra_formacion?: String;
  id_unidad_centro: number;
}
