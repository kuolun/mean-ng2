import { products } from '../data';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products;
  categories;
  url = 'http://localhost:3000/products/';


  constructor(private _http: Http) {
  }

  // 取得產品目錄
  getCategory() {
    // this.categories = this._http.get(urls)
    //   //取得response物件的body部分轉成json格式
    //   .map(res => res.json());
    let urls = 'http://localhost:3000/categories/all'
    this.categories =
      this._http.get(urls)
        .map(res => res.json().categories);
  }

  getProducts(filter?) {
    let url = 'http://localhost:3000/productsall';

    //如果有filter，就把url換掉
    if (filter && filter.id) {
      url = this.url;
      url += filter.id;
    }


    // products是obs，所以template那邊要用async
    this.products = this._http.get(url)
      .map(res => res.json().products);
  }

  reloadProducts(filter) {
    this.getProducts(filter);
  }

  ngOnInit() {
    this.getProducts();
    this.getCategory();
  }

}
