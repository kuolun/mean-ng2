import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
  constructor(private _http: Http) { }
  private userUrl = 'http://localhost:30000/user';
  /**
   * Get a single user
   */
  getUser(id) {
    return this._http.get(`${this.userUrl}/${id}`).map(res => res.json());
  }


  /**
   * Create a user
   */

  createUser(profile) {
    // 加上header info
    const headers = new Headers();
    console.log('profile:', profile);
    //body要轉成string,headers要用物件
    return this._http.post('http://localhost:3000/newUser',
      profile, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Add productｓ
   */

  /**
   * Remove product
   */

  /**
   * Checkout
   */
}
