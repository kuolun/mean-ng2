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
  categories;
  url = 'https://starwars-json-server-ewtdxbyfdz.now.sh/people';
  api = 'https://starwars-json-server-ewtdxbyfdz.now.sh/';

  // 抓gender分類male,female,n/a
  // https://starwars-json-server-ewtdxbyfdz.now.sh/people?gender=n/a

  constructor(private _http: Http) {

  }

  // 取得產品目錄
  getCategory() {
    // let urls = 'https://starwars-json-server-ewtdxbyfdz.now.sh/species';
    // this.categories = this._http.get(urls)
    //   //取得response物件的body部分轉成json格式
    //   .map(res => res.json());

    this.categories = [
      {
        id: 1,
        gender: 'male'
      }, {
        id: 2,
        gender: 'female'
      }, {
        id: 3,
        gender: 'n/a'
      },];
  }

  getProducts(filter?) {
    let url = this.url;
    if (filter && filter.gender)
      url += "?gender=" + filter.gender;

    // products是obs，所以template那邊要用async
    this.products = this._http.get(url)
      .map(products => {
        //回傳一維array
        return products.json()
          .map(product => Object.assign({}, product, { image: this.api + product.image }))
      });
  }

  reloadProducts(filter) {
    this.getProducts(filter);
  }

  ngOnInit() {
    this.getProducts();
    this.getCategory();
  }

}
