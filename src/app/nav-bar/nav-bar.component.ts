import { UserService } from './../shared/services/user.service';
import { Auth } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  cart;
  constructor(private auth: Auth) { }

  ngOnInit() {
    this.cart = this.auth.userProfile.cart;
  }

  sum() {
    let result = 0;
    this.cart.forEach(product => {
      result += product.quantity;
    });
    return result;
  }

}
