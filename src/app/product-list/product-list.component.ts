import { products } from '../data';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  // products: Array<any> = products;
  products;
  url = 'https://starwars-json-server-ewtdxbyfdz.now.sh/people';
  api = 'https://starwars-json-server-ewtdxbyfdz.now.sh/';

  constructor(private _http: Http) {

  }

  ngOnInit() {
    // products是obs，所以template那邊要用async
    this.products = this._http.get(this.url)
      .map(products => {
        //回傳一維array
        return products.json()
          .map(product => Object.assign({}, product, { image: this.api + product.image }))
      });
  }

}
