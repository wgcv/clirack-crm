import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showtime'
})
export class ShowtimePipe implements PipeTransform {

  transform(date1: string, date2: string, time = 120, args?: any): boolean {
	if(this.dateFromISO8601(date1).getTime() - this.dateFromISO8601(date2).getTime()>300000){
		return true;
	}
	return false;
  }
dateFromISO8601(isostr) {
    var parts = isostr.match(/\d+/g);
    return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
	}
}
