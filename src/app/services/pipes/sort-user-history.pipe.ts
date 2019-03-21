import { Pipe, PipeTransform } from '@angular/core';

import { IUserHistory } from 'src/app/models/history';

@Pipe({
  name: 'SortUserHistoryPipe'
})
export class SortUserHistoryPipe implements PipeTransform {

  transform(keys: Array<String>, history: IUserHistory, direction: String): Array<String> {
    if (direction === 'asc') {
      return keys.sort((a, b) => {
        if (history[a.toString()].email > history[b.toString()].email) { return -1; }
        if (history[a.toString()].email < history[b.toString()].email) { return 1; }
        return 0;
      });
    } else if (direction === 'desc') {
      return keys.sort((a, b) => {
        if (history[a.toString()].email < history[b.toString()].email) { return -1; }
        if (history[a.toString()].email > history[b.toString()].email) { return 1; }
        return 0;
      });
    }
  }

}
