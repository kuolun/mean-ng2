import { Auth } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user;
  constructor(private auth: Auth) {
    this.user = this.auth.userProfile;
  }

  ngOnInit() {
  }

}
