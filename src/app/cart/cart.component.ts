import { RequestOptions, Http, Headers, } from '@angular/http';
import { Auth } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {


  //載入購物車資料
  // cart=[];

  isloading = true;

  // 目前登入的user資料(來自DB)
  user;

  // service存放的user資料(for Nav bar)
  userProfile = this.auth.userProfile;


  // totalValue = 0;

  takePaymentResult: string;


  //Stripe付款
  constructor(private auth: Auth, private _http: Http) {

  }



  ngOnInit() {
    //因service內只有productid
    //所以需要從後端load完整product才能顯示圖片
    this.auth.loadUser(this.userProfile)
      .subscribe(data => {
        this.user = data.loadedUser;
        console.log(this.user);
      });
  }

  // 購物車總金額
  totalCost() {
    let total = 0;
    this.user.data.cart.forEach(item => total += item.quantity * item.subtotal);
    console.info('total=', total);
    return total;
  }


  // 點pay button觸發，從stripe取回token
  openCheckout() {
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_gYmq7G71sVayHcy4J8SjZHKA',
      locale: 'auto',
      token: token => this.takePayment(token)
    }
    );

    console.log(this.user.data.totalValue);

    handler.open({
      name: 'Shop Smart Site',
      description: 'Pay with Stripe',
      amount: this.user.data.totalValue * 100,// cent
      allowRememberMe: false
    });
  }

  //從購物車移除prodcut
  removeProduct(productIndex) {
    console.log('remove index:', productIndex);


    //更新service的總金額
    this.userProfile.data.totalValue -= this.userProfile.data.cart[productIndex].subtotal;

    //更新NavBar的cart (userService)
    //放後面，不然砍掉了就無法用要remove那項去算金額
    this.userProfile.data.cart.splice(productIndex, 1);
    console.log('current cart after remove:', this.userProfile.data.cart);


    //更新localVariable user(for DB)
    this.user.data.cart.splice(productIndex, 1);


    // 重新計算總金額(for DB)
    this.user.data.totalValue = this.totalCost();


    //要updata DB
    let updatedItem = {
      cart: this.user.data.cart,
      totalValue: this.user.data.totalValue
    }

    console.info('updatedItem', updatedItem);

    //更新DB(async)
    //傳入的資料為updatedItem，會放在req.body內
    this._http.put('http://localhost:3000/remove', {
      updatedItem: updatedItem,
      email: this.user.email
    }).
      subscribe(user => console.info('updatedItem:', user));


  }

  // 送token跟結帳金額給後端
  takePayment(token: any) {
    let body = {
      tokenId: token.id,
      amount: this.user.data.totalValue,
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
        this.user.data.cart = []
        this.user.data.totalValue = 0
        localStorage.setItem('profile', JSON.stringify(this.user));

        //清空navbar Cart(Service)
        this.userProfile.data.cart = [];

        //送出成功訊息
        this.takePaymentResult = "Your payment process is completeted!!";
      },
      error => console.log(error.message),
      () => console.log('Authentication Complete')
      )
  }

}
