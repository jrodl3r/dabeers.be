import { Pipe, PipeTransform } from '@angular/core';

import { IUserProfiles } from '../../models/user';

@Pipe({
  name: 'SortUserPipe'
})
export class SortUserPipe implements PipeTransform {

  transform(users: Array<String>, profiles: IUserProfiles, direction: String): Array<String> {
    if (direction === 'asc') {
      return users.sort((a, b) => {
        if (profiles[a.toString()].email > profiles[b.toString()].email) { return -1; }
        if (profiles[a.toString()].email < profiles[b.toString()].email) { return 1; }
        return 0;
      });
    } else if (direction === 'desc') {
      return users.sort((a, b) => {
        if (profiles[a.toString()].email < profiles[b.toString()].email) { return -1; }
        if (profiles[a.toString()].email > profiles[b.toString()].email) { return 1; }
        return 0;
      });
    }
  }

}
