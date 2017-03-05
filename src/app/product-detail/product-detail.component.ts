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
  totalCount = 1;
  product;
  isloading = true;
  constructor(
    private _route: ActivatedRoute,
    private _http: Http,
    private _router: Router,
    private auth: Auth) {

  }

  onBack() {
    this._router.navigate(['/']);
  }

  subtotal(): number {
    return this.totalCount * this.product.price
  }

  changeQty(num) {
    this.totalCount += num;
    if (this.totalCount < 1)
      this.totalCount = 1;
  }

  ngOnInit() {
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
