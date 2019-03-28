import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activeItemsPipe'
})
export class ActiveItemsPipe implements PipeTransform {

  transform(items: any) {
    return items ? items.filter(item => item.value.isActive === true) : items;
  }

}
