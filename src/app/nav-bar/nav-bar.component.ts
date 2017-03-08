import { Auth } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  constructor(private auth: Auth) { }

  ngOnInit() {
  }

  sum() {
    //取出購物車資料
    let cart = this.auth.userProfile.data.cart
    let sum = 0;
    cart.forEach(item => {
      sum += item.quantity;
    });

    return sum;
  }

}

