import { products } from '../data';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  // products: Array<any> = products;
  products;
  categories;
  url = 'http://localhost:3000/products/';
  url2= 'http://localhostt:3000/productsall';
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
    let urls = 'http://localhost:3000/categories/all'
    this.categories =
      this._http.get(urls)
        .map(res => res.json());
        
  }

  getProducts(filter?) {
    let url = this.url2;
    if (filter && filter.id)
    {
      url = this.url;
      url +=  filter.id;
    }
      

    // products是obs，所以template那邊要用async
    this.products = this._http.get('http://localhost:3000/productsall')
      .map(res => res.json());
  }

  reloadProducts(filter) {
    this.getProducts(filter);
  }

  ngOnInit() {
    this.getProducts();
    // this.getCategory();
  }

}
