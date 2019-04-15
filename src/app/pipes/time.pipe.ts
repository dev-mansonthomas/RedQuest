import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(minutes: number, args?: any): string {
    const hours = Math.floor(minutes / 60);
    if (hours === 0) {
      return args ? this.minutesText(minutes, args.small) : this.minutesText(minutes);
    } else {
      const remainingMinutes = minutes - (hours * 60);
      return args ? this.hoursAndminutesText(hours, remainingMinutes, args.small) : this.hoursAndminutesText(hours, remainingMinutes);
    }
  }

  private minutesText(minutes: number, small: boolean = false): string {
    if (minutes === 0) {
      return '';
    }
    return small
      ? `${minutes}min`
      : ` ${minutes} minutes`;
  }

  private hoursAndminutesText(hours: number, minutes: number, small: boolean = false): string {
    return this.hoursText(hours, small) + this.minutesText(minutes, small);
  }

  private hoursText(hours: number, small: boolean) {
    const hoursNotSmallText = hours <= 1 ? 'heure' : 'heures';
    return small
      ? `${hours}h`
      : `${hours} ${hoursNotSmallText}`;
  }

}
