import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  totalCount = 100;
  product;
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
    const url = 'https://starwars-json-server-ewtdxbyfdz.now.sh/people/';
    const api = 'https://starwars-json-server-ewtdxbyfdz.now.sh/';
    const id = this._route.snapshot.params['id'];
    this._http.get(url + id)
      // 把res body內的string轉成json
      .map((response: Response) => response.json())
      // 幫image檔名加上url
      .map(product => Object.assign({}, product, { image: api + product.image }))
      .subscribe(product => this.product = product);
  }

}
