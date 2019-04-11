import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailToNamePipe'
})
export class EmailToNamePipe implements PipeTransform {

  transform(email: String): String {
    const user = /(.*)?\.(.*)?@/.exec(email.toString()) || [];
    if (user.length) {
      return `${user[1]} ${user[2]}`;
    }
    return email;
  }

}
