import { UserService } from './shared/services/user.service';
// app/auth.service.ts

import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class Auth {
  userProfile;

  // Configure Auth0
  lock = new Auth0Lock('05Do3jcn1zucqIw58tpB9e7MEbcUrOti', 'kuolun.auth0.com', {});

  constructor(private _userservice: UserService) {
    //假設登入後切換到profile頁面，這時profile已經存到localStorage
    //service先把profile存到local variable，profile component就可以直接使用，不用再去LocalStorage抓
    //從localStorage取出的要parse為JS object
    this.userProfile = JSON.parse(localStorage.getItem('profile'));

    // Add callback for lock `authenticated` event
    this.lock.on("authenticated", (authResult) => {
      console.log('Auth:', authResult);
      // this.lock.getProfile(authResult.idToken, (error, profile) => {
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          throw new Error(error);
        }
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('profile', JSON.stringify(profile));
        this.userProfile = profile;

        //存newUser到DB
        this._userservice.createUser(profile)
          .subscribe(savedUser => {
            console.log('new user created:', savedUser)
            this.userProfile.cart = savedUser.cart;
          });
      })
    });
  }

  public login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  public authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  }

  public logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    this.userProfile = null;
  }
}
