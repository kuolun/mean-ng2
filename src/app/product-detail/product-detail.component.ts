import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  totalCount = 100;
  product;
  isloading = true;
  constructor(
    private _route: ActivatedRoute,
    private _http: Http,
    private _router: Router) {

  }

  onBack() {
    this._router.navigate(['/']);
  }

  subtotal(): number {
    return 10;
  }

  addQty(number) {
    return 1
  }

  ngOnInit() {
    const url = 'http://localhost:3000/product';
    const id = this._route.snapshot.params['id'];
    this._http.get(`${url}/${id}`)
      // 把res body內的string轉成json
      .map((response: Response) => response.json())
      // 幫image檔名加上url
      .map(data => data.product)
      .subscribe(product => {
        this.isloading = false;
        this.product = product
      });
  }

}
