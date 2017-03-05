import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
  constructor(private http: Http) { }
  private userUrl = 'http://localhost:30000/user';
  /**
   * Get a single user
   */
  getUser(id) {
    return this.http.get(`${this.userUrl}/${id}`).map(res => res.json());
  }


  /**
   * Create a user
   */

  /**
   * Add product
   */

  /**
   * Remove product
   */

  /**
   * Checkout
   */
}
