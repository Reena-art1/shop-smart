import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.interface';

interface ProductsResponse {
  products: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsUrl = 'assets/data/products.json';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<ProductsResponse>(this.productsUrl)
      .pipe(
        map(response => response.products)
      );
  }

  getProduct(id: number): Observable<Product | undefined> {
    return this.http.get<ProductsResponse>(this.productsUrl)
      .pipe(
        map(response => response.products.find(product => product.id === id))
      );
  }
}