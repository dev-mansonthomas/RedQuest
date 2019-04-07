import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(minutes: number, args?: any): string {
    let hours = Math.floor(minutes / 60);
    if (hours === 0) {
      return `${minutes} minutes`;
    } else if (hours === 1) {
      let remainingMinutes = minutes - 60;
      return `1 heure et ${remainingMinutes} minutes`
    } else {
      let remainingMinutes = minutes - (hours * 60);
      return `${hours} heures et ${remainingMinutes} minutes`
    }
  }

}
