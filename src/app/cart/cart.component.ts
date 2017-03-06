import { Http } from '@angular/http';
import { Auth } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart;
  isloading = true;
  user;

  constructor(private auth: Auth,
    private _http: Http) {
    //從service抓資料
    this.user = this.auth.userProfile;
  }



  ngOnInit() {
    this._http.get(`http://localhost:3000/cart/${this.user.email}`)
      // 把res body內的string轉成json
      .map((res) => res.json().cart)
      .subscribe(cart => {
        console.log(cart);
        this.isloading = false;
        this.cart = cart
      });
  }

  totalCost() {
    let total = 0;
    this.cart.forEach(item => total += item.quantity * item.subtotal);
    return total;
  }

}
