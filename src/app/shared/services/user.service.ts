import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Auth } from './../../auth.service';

@Injectable()
export class UserService {

  constructor(private _http: Http, private auth: Auth) {
  }
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
    headers.append('Content-Type', 'application/json');
    //body要轉成string,headers要用物件
    return this._http.post('http://localhost:3000/newUser',
      profile, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Add products
   */
  addProduct(item) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let productInfo = {
      item: item,
      clientID: this.auth.userProfile.clientID
    };

    return this._http.put('/updateCart',
      productInfo, { headers: headers }).
      map(res => res.json());

  }




  /**
   * Remove product
   */

  /**
   * Checkout
   */
}
