import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'weight'
})
export class WeightPipe implements PipeTransform {

  transform(weight: number, args?: any): string {
    const kilos = weight / 1000;
    return `${kilos.toFixed(2)} kg`;
  }

}
