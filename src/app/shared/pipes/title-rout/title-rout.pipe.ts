import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titlerout'
})
export class TitleRoutPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    return value.split(' ').join('_');
  }

}
