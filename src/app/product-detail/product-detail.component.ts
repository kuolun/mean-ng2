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

    console.info('quantity:' + this.quantity);
    console.info('subtotal:' + this.subtotal());
    console.info('product.price:' + this.product.price);


    //購買產品資料
    var item = {
      productid: this.product._id,
      quantity: this.quantity,
      subtotal: this.subtotal()
    };

    //增加cart array的item
    cartData.cart.push(item);

    //增加cartData的總金額
    cartData.totalValue += this.subtotal();



    //更新DB(async)
    //傳入的資料為item，會放在req.body內
    this._http.put('http://localhost:3000/updateCart', {
      item: item,
      clientID: this.auth.userProfile.clientID
    }).
      subscribe(user => console.log(user));
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

}
