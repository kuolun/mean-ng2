import { Auth } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile;
  constructor(private auth: Auth) {
    this.profile = this.auth.userProfile;
  }

  ngOnInit() {
  }

}
