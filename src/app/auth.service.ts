// app/auth.service.ts
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class Auth {
  private userUrl = 'http://localhost:30000/user';
  //使用者資訊
  userProfile;

  // Configure Auth0
  lock = new Auth0Lock('05Do3jcn1zucqIw58tpB9e7MEbcUrOti', 'kuolun.auth0.com', {});

  constructor(private _http: Http, private router: Router) {
    //假設登入後切換到profile頁面，這時profile已經存到localStorage
    //service先把profile存到local variable，profile component就可以直接使用，不用再去LocalStorage抓
    //從localStorage取出的要parse為JS object
    this.userProfile = JSON.parse(localStorage.getItem('profile'));

    // 設定'authenticated' event發生時，要作的事
    this.lock.on("authenticated", (authResult) => {
      console.log('Auth:', authResult);
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          throw new Error(error);
        }
        // 先呼叫checkUser(),false才建立
        //於DB建立newUser
        if (!this.checkDBUser(profile)) {
          this.createUser(profile)
            .subscribe(
            data => {
              //後端回傳成功才存到localStorage
              //把token跟profile存到localstorage
              localStorage.setItem('id_token', authResult.idToken);
              localStorage.setItem('profile', JSON.stringify(data.savedUser));
              // 把DB回傳的user指向userProfile
              console.log('savedUser:', data.savedUser);
              this.userProfile = data.savedUser;
            },
            err => {
              //錯誤的話要把user logout()
              console.log(err);
              this.logout();
            });
        } else {
          console.log('User already in DB,load user data');
          this.loadUser(profile)
            .subscribe(data => {
              console.log('LoadedUser:', data.loadedUser);

              // 把載入的user存到localStorage
              localStorage.setItem('id_token', authResult.idToken);
              localStorage.setItem('profile', JSON.stringify(data.loadedUser));

              this.userProfile = data.loadedUser;
            });
        }
      })
    });
  }

  /**
 * Create a user
 */

  createUser(profile) {
    // 加上header info
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    //body要轉成string,headers要用物件
    return this._http.post('http://localhost:3000/newUser',
      profile, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Check User是否存在DB
   */
  checkDBUser(profile) {
    return this._http.get(`http://localhost:3000/checkDBUser/${profile.email}`)
      .map(res => res.json())
      .subscribe(data => data.user ? true : false);
  }

  /**
   * 載入DB User資料
   */
  loadUser(profile) {
    return this._http.get(`http://localhost:3000/user/${profile.email}`)
      .map(res => res.json());
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
    this.router.navigate(['/']);
  }

}
