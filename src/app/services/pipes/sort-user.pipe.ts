import { Pipe, PipeTransform } from '@angular/core';

import { IUser } from '../../models/user';

@Pipe({
  name: 'SortUserPipe'
})
export class SortUserPipe implements PipeTransform {

  transform(users: Array<IUser>, direction: String) {
    if (direction === 'asc') {
      return users.sort((a, b) => {
        if (a.email > b.email) { return -1; }
        if (a.email < b.email) { return 1; }
        return 0;
      });
    } else if (direction === 'desc') {
      return users.sort((a, b) => {
        if (a.email < b.email) { return -1; }
        if (a.email > b.email) { return 1; }
        return 0;
      });
    }
  }

}
