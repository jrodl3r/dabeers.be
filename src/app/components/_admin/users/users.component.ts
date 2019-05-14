import { Component } from '@angular/core';

import { AdminService } from '../admin.service';
import { BeerService } from '../../../services/beer.service';
import { VoteService } from '../../../services/vote.service';

import { IUser } from '../../../models/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  activeUser: IUser;
  activeUserVotes: Array<any>;
  isUserModalActive: Boolean = false;

  constructor(
    public voteService: VoteService,
    public beerService: BeerService,
    public adminService: AdminService) {
    this.resetActiveUser();
  }

  setActiveUser(uid: String) {
    this.activeUser = this.adminService.users.filter(user => user.uid === uid)[0];
  }

  resetActiveUser() {
    this.activeUser = null;
  }

  showUserModal(uid: String) {
    this.setActiveUser(uid);
    this.activeUserVotes = this.voteService.getUserVotes(uid);
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
