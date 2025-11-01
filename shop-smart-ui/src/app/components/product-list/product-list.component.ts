import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="product-list">
      <header class="product-header">
        <h1>Our Products</h1>
        <div class="filters">
          <select [(ngModel)]="selectedCategory" (change)="filterProducts()" class="category-filter">
            <option value="">All Categories</option>
            @for (category of categories; track category) {
              <option [value]="category">{{ category }}</option>
            }
          </select>
        </div>
      </header>

      @if (loading) {
        <div class="loading">
          <p>Loading products...</p>
        </div>
      } @else if (filteredProducts.length === 0) {
        <div class="no-products">
          <p>No products found</p>
        </div>
      } @else {
        <div class="products-grid">
          @for (product of filteredProducts; track product.id) {
            <div class="product-card">
              <div class="product-image">
                <img [src]="product.imageUrl" [alt]="product.name" loading="lazy">
                @if (product.stockQuantity <= 5 && product.stockQuantity > 0) {
                  <span class="stock-warning">Only {{ product.stockQuantity }} left!</span>
                } @else if (product.stockQuantity === 0) {
                  <span class="out-of-stock">Out of Stock</span>
                }
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-category">{{ product.category }}</p>
                <p class="product-description">{{ product.description | slice:0:100 }}...</p>
                <p class="product-price">{{ product.price | currency }}</p>
              </div>
              <div class="product-actions">
                <button 
                  class="add-to-cart-btn" 
                  (click)="addToCart(product)"
                  [disabled]="product.stockQuantity === 0 || isInCart(product.id)"
                  [class.in-cart]="isInCart(product.id)">
                  @if (isInCart(product.id)) {
                    In Cart ({{ getCartQuantity(product.id) }})
                  } @else if (product.stockQuantity === 0) {
                    Out of Stock
                  } @else {
                    Add to Cart
                  }
                </button>
                <a [routerLink]="['/product', product.id]" class="view-details-btn">
                  View Details
                </a>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .product-list {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding: 0 20px;
    }

    h1 {
      font-size: 2.5rem;
      color: #2c3e50;
      margin: 0;
    }

    .category-filter {
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      background-color: white;
    }

    .loading, .no-products {
      text-align: center;
      padding: 40px;
      color: #7f8c8d;
      font-size: 1.2rem;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 25px;
      padding: 20px;
    }

    .product-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .product-card:hover {
      transform: translateY(-5px);
    }

    .product-image {
      position: relative;
      padding-top: 75%;
      overflow: hidden;
    }

    .product-image img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-image img {
      transform: scale(1.05);
    }

    .stock-warning, .out-of-stock {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: bold;
    }

    .stock-warning {
      background-color: #f1c40f;
      color: #34495e;
    }

    .out-of-stock {
      background-color: #e74c3c;
      color: white;
    }

    .product-info {
      padding: 20px;
      flex-grow: 1;
    }

    .product-name {
      margin: 0;
      font-size: 1.2rem;
      color: #2c3e50;
      margin-bottom: 8px;
    }

    .product-category {
      color: #7f8c8d;
      font-size: 0.9rem;
      margin: 5px 0;
    }

    .product-description {
      color: #34495e;
      font-size: 0.9rem;
      line-height: 1.4;
      margin: 10px 0;
    }

    .product-price {
      font-size: 1.3rem;
      font-weight: bold;
      color: #2c3e50;
      margin: 10px 0;
    }

    .product-actions {
      padding: 20px;
      display: flex;
      gap: 10px;
      flex-direction: column;
    }

    .add-to-cart-btn, .view-details-btn {
      width: 100%;
      padding: 12px;
      border-radius: 6px;
      font-weight: 600;
      text-align: center;
      transition: all 0.3s ease;
    }

    .add-to-cart-btn {
      background-color: #3498db;
      color: white;
      border: none;
      cursor: pointer;
    }

    .add-to-cart-btn:hover:not(:disabled) {
      background-color: #2980b9;
    }

    .add-to-cart-btn:disabled {
      background-color: #bdc3c7;
      cursor: not-allowed;
    }

    .add-to-cart-btn.in-cart {
      background-color: #27ae60;
    }

    .view-details-btn {
      background-color: transparent;
      color: #3498db;
      border: 2px solid #3498db;
      text-decoration: none;
    }

    .view-details-btn:hover {
      background-color: #f7f9fc;
    }

    @media (max-width: 768px) {
      .product-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
        padding: 10px;
      }

      .product-card {
        margin-bottom: 15px;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  loading: boolean = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      products => {
        this.products = products;
        this.filteredProducts = products;
        this.categories = [...new Set(products.map(product => product.category))].sort();
        this.loading = false;
      },
      error => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    );
  }

  filterProducts(): void {
    this.filteredProducts = this.selectedCategory
      ? this.products.filter(product => product.category === this.selectedCategory)
      : this.products;
  }

  addToCart(product: Product): void {
    if (product.stockQuantity > 0 && !this.isInCart(product.id)) {
      this.cartService.addToCart(product);
    }
  }

  isInCart(productId: number): boolean {
    return this.cartService.isInCart(productId);
  }

  getCartQuantity(productId: number): number {
    return this.cartService.getItemQuantity(productId);
  }
}