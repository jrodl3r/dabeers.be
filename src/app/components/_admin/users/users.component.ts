import { Component } from '@angular/core';

import { AdminService } from '../admin.service';

import { IUser } from '../../../models/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  activeUser: IUser;
  isUserModalActive: Boolean = false;

  constructor(public adminService: AdminService) {
    this.resetActiveUser();
  }

  setActiveUser(id: String) {
    this.activeUser = this.adminService.users.filter(user => user.uid === id)[0];
  }

  resetActiveUser() {
    this.activeUser = null;
  }

  showUserModal(id: String) {
    this.setActiveUser(id);
    this.isUserModalActive = true;
  }

  hideModal(event: Event) {
    event.stopPropagation();
    setTimeout(() => {
      this.resetActiveUser();
      this.isUserModalActive = false;
    }, 100);
  }

}
