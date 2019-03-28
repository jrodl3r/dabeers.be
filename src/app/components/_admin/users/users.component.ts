import { Component, OnInit } from '@angular/core';

import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(
    public profileService: ProfileService
  ) { }

  ngOnInit() {
    this.profileService.getUsers();
  }

}
