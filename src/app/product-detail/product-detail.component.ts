import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Auth } from './../auth.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  //此產品數量
  quantity = 1;
  product;
  isloading = true;

  constructor(
    private _route: ActivatedRoute,
    private _http: Http,
    private _router: Router,
    private auth: Auth) {
  }

  ngOnInit() {
    //用id抓取這個product資料
    const url = 'http://localhost:3000/product';
    const id = this._route.snapshot.params['id'];
    this._http.get(`${url}/${id}`)
      // 把res body內的string轉成json
      .map((res) => res.json().product)
      .subscribe(product => {
        this.isloading = false;
        this.product = product
      });
  }

  // 回首頁
  onBack() {
    this._router.navigate(['/']);
  }

  //小計
  subtotal(): number {
    return this.quantity * this.product.price
  }

  // 購買數量
  changeQty(num) {
    this.quantity += num;
    if (this.quantity < 1)
      this.quantity = 1;
  }

  /**
   * product`加到購物車
   */
  addToCart() {
    //購物車資料
    let cartData = this.auth.userProfile.data;

    console.info('quantity:', this.quantity);
    console.info('product.price:', this.product.price);
    console.info('subtotal:', this.subtotal());
    console.log('OldtotalValue', cartData.totalValue);

    //購買產品資料
    var item = {
      product: this.product._id,
      quantity: this.quantity,
      subtotal: this.subtotal()
    };

    //增加cart array的item
    cartData.cart.push(item);

    //增加cartData的總金額
    cartData.totalValue += this.subtotal();

    console.log('totalValue', cartData.totalValue);

    //更新DB(async)
    //傳入的資料為item，會放在req.body內
    this._http.put('http://localhost:3000/updateCart', {
      newCart: cartData.cart,
      newTotal: cartData.totalValue,
      // 不能用clientID,2個user都一樣?
      // clientID: this.auth.userProfile.clientID
      email: this.auth.userProfile.email
    }).
      subscribe(user => console.log(user));
  }



}
