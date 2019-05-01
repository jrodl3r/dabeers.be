import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { SystemService } from './system.service';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(
    private system: SystemService,
    private toastr: ToastrService
  ) { }

  info(msg: string) {
    if (this.system.isBrowser()) {
      this.toastr.info(msg);
    }
    this.log(msg);
  }

  success(msg: string) {
    if (this.system.isBrowser()) {
      this.toastr.success(msg);
    }
  }

  warn(msg: string) {
    if (this.system.isBrowser()) {
      this.toastr.error(msg);
    }
  }

  error(msg: string, err: string = '') {
    if (this.system.isBrowser()) {
      this.toastr.error(msg);
    }
    console.error(err ? err : msg);
  }

  log(msg: string) {
    console.log(msg);
  }

}
