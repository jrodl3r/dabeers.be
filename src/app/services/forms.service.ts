import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  validate(data?: any, form?: any, errors?: any, msgs?: any, fields?: any) {
    if (!form) { return; }

    for (const field in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, field) && (fields.indexOf(field) > -1)) {
        errors[field] = ''; // reset errors
        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = msgs[field];

          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key) ) {
                errors[field] += `${(messages as {[key: string]: string})[key]}`;
              }
            }
          }
        }
      }
    }
  }

  emailsMatch(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
      const confirmEmail = control.value;
      const newEmailControl = control.root.get('newEmail');

      if (newEmailControl) {
        const newEmail = newEmailControl.value;

        if (newEmail !== confirmEmail) {
          return { matchingEmail: true };
        }
      }

      return null;
    }
  }

  passwordsMatch(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
      const confirmPassword = control.value;
      const newPasswordControl = control.root.get('newPassword');

      if (newPasswordControl) {
        const newPassword = newPasswordControl.value;

        if (newPassword !== confirmPassword && confirmPassword.length > 5) {
          return { matchingPassword: true };
        }
      }

      return null;
    }
  }

}
