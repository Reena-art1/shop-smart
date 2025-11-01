import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-detail" *ngIf="product">
      <div class="product-image">
        <img [src]="product.imageUrl" [alt]="product.name">
      </div>
      <div class="product-info">
        <h2>{{ product.name }}</h2>
        <p class="description">{{ product.description }}</p>
        <p class="price">{{ product.price | currency }}</p>
        <p class="stock">In Stock: {{ product.stockQuantity }}</p>
        <div class="actions">
          <button (click)="addToCart()" [disabled]="product.stockQuantity === 0">
            Add to Cart
          </button>
          <a routerLink="/products" class="back-link">Back to Products</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-detail {
      display: flex;
      gap: 40px;
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .product-image {
      flex: 1;
    }
    .product-image img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
    }
    .product-info {
      flex: 1;
    }
    .description {
      margin: 20px 0;
      line-height: 1.6;
    }
    .price {
      font-size: 24px;
      font-weight: bold;
      color: #2c3e50;
    }
    .stock {
      color: #7f8c8d;
      margin: 10px 0;
    }
    .actions {
      margin-top: 20px;
    }
    button {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 10px;
    }
    button:disabled {
      background-color: #bdc3c7;
      cursor: not-allowed;
    }
    button:hover:not(:disabled) {
      background-color: #2980b9;
    }
    .back-link {
      display: inline-block;
      color: #3498db;
      text-decoration: none;
      padding: 12px 24px;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product?: Product;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.productService.getProduct(id).subscribe(
        product => this.product = product
      );
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
    }
  }
}