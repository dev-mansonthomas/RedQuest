import {Pipe, PipeTransform} from '@angular/core';

export type ParisDateFormat = 'medium' | 'fullDate' | 'H' | 'mm';

@Pipe({
  name: 'parisDate'
})
export class ParisDatePipe implements PipeTransform {

  transform(value: string | Date | null | undefined, format: ParisDateFormat = 'medium'): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const date = typeof value === 'string' ? this.parseString(value) : value;
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }

    switch (format) {
      case 'H':
        return this.parisHour(date);
      case 'mm':
        return this.parisMinute(date);
      case 'fullDate':
        return this.formatWith(date, {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
      case 'medium':
      default:
        return this.formatWith(date, {
          day: 'numeric', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        });
    }
  }

  private parseString(s: string): Date {
    if (/Z|[+\-]\d{2}:?\d{2}$/.test(s)) {
      return new Date(s);
    }
    return new Date(s.replace(' ', 'T') + 'Z');
  }

  private formatWith(date: Date, opts: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', ...opts }).format(date);
  }

  private parisHour(date: Date): string {
    const parts = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris', hour: '2-digit', hour12: false
    }).formatToParts(date);
    const hour = (parts.find(p => p.type === 'hour') || { value: '0' }).value;
    return String(parseInt(hour, 10));
  }

  private parisMinute(date: Date): string {
    const parts = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris', minute: '2-digit', hour: '2-digit', hour12: false
    }).formatToParts(date);
    const minute = (parts.find(p => p.type === 'minute') || { value: '00' }).value;
    return minute.length < 2 ? '0' + minute : minute;
  }

}
