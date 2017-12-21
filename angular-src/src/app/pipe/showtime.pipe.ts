import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showtime'
})
export class ShowtimePipe implements PipeTransform {

transform(date1: string, date2='1992-11-25T11:49:07.000Z', time = 120) {
	if ((Date.parse(date1) - Date.parse(date2))>300000) {
		return true;
	}else{
		return false;

	}
  }

}
