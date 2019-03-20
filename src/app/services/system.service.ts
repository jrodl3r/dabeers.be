import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  isBrowser = () => {
    return typeof window !== 'undefined';
  }

  isOnline = () => {
    return this.isBrowser() ? navigator.onLine : false;
  }

}
