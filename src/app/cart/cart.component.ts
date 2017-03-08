import { RequestOptions, Http, Headers, } from '@angular/http';
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

  // 目前登入的user資料
  user;

  totalValue = 0;

  takePaymentResult: string;


  //Stripe付款
  constructor(private auth: Auth,
    private _http: Http) {
    //從service抓目前登入user資料
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
        this.totalCost();
      });
  }

  totalCost() {
    this.cart.forEach(item => this.totalValue += item.quantity * item.subtotal);
    return this.totalValue;
  }


  // 點pay button觸發，從stripe取回token
  openCheckout() {
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_gYmq7G71sVayHcy4J8SjZHKA',
      locale: 'auto',
      token: token => this.takePayment(token)
    }
    );

    console.log(this.totalValue);

    handler.open({
      name: 'Shop Smart Site',
      description: 'Pay with Stripe',
      amount: this.totalValue * 100,// cent
      allowRememberMe: false
    });
  }

  // 送token跟結帳金額給後端
  takePayment(token: any) {
    let body = {
      tokenId: token.id,
      amount: this.totalValue,
      userEmail: token.email,
      user: this.user
    }

    //把body轉成String
    let bodyString = JSON.stringify(body)
    let headers = new Headers({ 'Content-Type': 'application/json' })
    let options = new RequestOptions({ headers: headers })

    this._http.post('http://localhost:3000/stripepayment', bodyString, options)
      .subscribe(
      res => {
        console.log('data:', res.json().status)
        // 清空localStorage的cart資料
        this.user.data.cart=[]
        this.user.data.totalValue=0
        localStorage.setItem('profile', JSON.stringify(this.user));
      },
      error => console.log(error.message),
      () => console.log('Authentication Complete')
      )
  }

}
