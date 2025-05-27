import { Pipe , PipeTransform } from '@angular/core'

@Pipe({
  name: 'edad'
})

export class EdadPipe implements PipeTransform{

  transform(fecha_nacimiento: any): number {
      if(!fecha_nacimiento) return null;

      const fechaNacimiento = new Date(fecha_nacimiento);

      const now = new Date();
      let edad = now.getFullYear() - fechaNacimiento.getFullYear();
      let month = now.getMonth() - fechaNacimiento.getMonth();
      let day = now.getDate() - fechaNacimiento.getDate();

      if(month<0 || (month === 0 && day<0)){
        edad--;
      }
      return edad;
  }
}
