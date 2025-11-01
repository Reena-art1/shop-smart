import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.interface';

interface CartItem {
  product: Product;
  quantity: number;
}
import { Product } from '../../models/product.interface';
import { Subject, takeUntil } from 'rxjs';

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-container">
      <header class="cart-header">
        <h1>Shopping Cart</h1>
        @if (cartItems().length > 0) {
          <span class="item-count">{{ getTotalItems() }} items</span>
        }
      </header>

      @if ((cartItems$ | async)?.length === 0) {
        <div class="empty-cart">
          <img src="assets/empty-cart.png" alt="Empty Cart" class="empty-cart-image">
          <p>Your cart is empty</p>
          <a routerLink="/products" class="continue-shopping">Continue Shopping</a>
        </div>
      } @else {
        <div class="cart-grid">
          <div class="cart-items">
            @for (item of cartItems$ | async; track item.product.id) {
              <div class="cart-item" [class.out-of-stock]="item.product.stockQuantity === 0">
                <div class="item-image">
                  <img [src]="item.product.imageUrl" [alt]="item.product.name" loading="lazy">
                  @if (item.product.stockQuantity === 0) {
                    <div class="stock-overlay">Out of Stock</div>
                  }
                </div>
                <div class="item-content">
                  <div class="item-details">
                    <h3>{{ item.product.name }}</h3>
                    <p class="item-category">{{ item.product.category }}</p>
                    <p class="item-price">{{ item.product.price | currency }} each</p>
                    @if (item.product.stockQuantity > 0 && item.product.stockQuantity < 5) {
                      <p class="stock-warning">Only {{ item.product.stockQuantity }} left in stock!</p>
                    }
                  </div>
                  <div class="item-actions">
                    <div class="quantity-controls">
                      <button 
                        (click)="updateQuantity(item.product.id, item.quantity - 1)" 
                        [disabled]="item.quantity <= 1"
                        aria-label="Decrease quantity">
                        −
                      </button>
                      <span class="quantity">{{ item.quantity }}</span>
                      <button 
                        (click)="updateQuantity(item.product.id, item.quantity + 1)"
                        [disabled]="item.quantity >= item.product.stockQuantity"
                        aria-label="Increase quantity">
                        +
                      </button>
                    </div>
                    <p class="item-total">{{ (item.product.price * item.quantity) | currency }}</p>
                    <button 
                      class="remove-btn" 
                      (click)="removeItem(item.product.id)"
                      aria-label="Remove item">
                      <span class="remove-icon">×</span>
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>

          <div class="cart-summary">
            <div class="summary-content">
              <h2>Order Summary</h2>
              <div class="summary-details">
                <div class="summary-row">
                  <span>Subtotal ({{ getTotalItems() }} items)</span>
                  <span>{{ getSubtotal() | currency }}</span>
                </div>
                <div class="summary-row">
                  <span>Shipping</span>
                  <span class="free-shipping">FREE</span>
                </div>
                @if (getSubtotal() < 50) {
                  <div class="free-shipping-message">
                    Add {{ (50 - getSubtotal()) | currency }} more for FREE shipping
                  </div>
                }
                <div class="summary-row total">
                  <span>Total</span>
                  <span>{{ getSubtotal() | currency }}</span>
                </div>
              </div>
              <div class="summary-actions">
                <button class="checkout-btn" [disabled]="hasOutOfStockItems()">
                  {{ hasOutOfStockItems() ? 'Some items are out of stock' : 'Proceed to Checkout' }}
                </button>
                <button class="clear-btn" (click)="clearCart()">
                  Clear Cart
                </button>
                <a routerLink="/products" class="continue-shopping-link">
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .cart-header {
      display: flex;
      align-items: baseline;
      gap: 15px;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e1e8ee;
    }

    .cart-header h1 {
      margin: 0;
      color: #2c3e50;
      font-size: 2rem;
    }

    .item-count {
      color: #7f8c8d;
      font-size: 1.1rem;
    }

    .empty-cart {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .empty-cart-image {
      width: 200px;
      height: auto;
      margin-bottom: 20px;
      opacity: 0.7;
    }

    .empty-cart p {
      font-size: 1.2rem;
      color: #7f8c8d;
      margin: 20px 0;
    }

    .cart-grid {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 30px;
    }

    .cart-items {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .cart-item {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 20px;
      padding: 20px;
      border-bottom: 1px solid #e1e8ee;
      position: relative;
    }

    .cart-item:last-child {
      border-bottom: none;
    }

    .item-image {
      position: relative;
      width: 120px;
      height: 120px;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }

    .stock-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(231, 76, 60, 0.8);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      border-radius: 8px;
    }

    .item-content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .item-details h3 {
      margin: 0 0 5px 0;
      font-size: 1.2rem;
      color: #2c3e50;
    }

    .item-category {
      color: #7f8c8d;
      font-size: 0.9rem;
      margin: 5px 0;
    }

    .item-price {
      color: #2c3e50;
      font-weight: 500;
      margin: 5px 0;
    }

    .stock-warning {
      color: #e67e22;
      font-size: 0.9rem;
      margin: 5px 0;
    }

    .item-actions {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-top: 10px;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #f8f9fa;
      padding: 5px;
      border-radius: 20px;
    }

    .quantity-controls button {
      width: 30px;
      height: 30px;
      border-radius: 15px;
      border: none;
      background-color: #3498db;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }

    .quantity-controls button:disabled {
      background-color: #bdc3c7;
      cursor: not-allowed;
    }

    .quantity {
      min-width: 30px;
      text-align: center;
      font-weight: 500;
    }

    .item-total {
      font-weight: bold;
      color: #2c3e50;
      margin: 0;
      min-width: 80px;
    }

    .remove-btn {
      background: none;
      border: none;
      color: #e74c3c;
      cursor: pointer;
      font-size: 1.5rem;
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
    }

    .remove-btn:hover {
      color: #c0392b;
    }

    .cart-summary {
      position: sticky;
      top: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 20px;
    }

    .summary-content h2 {
      margin: 0 0 20px 0;
      color: #2c3e50;
    }

    .summary-details {
      margin-bottom: 20px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      color: #2c3e50;
    }

    .summary-row.total {
      border-top: 1px solid #e1e8ee;
      margin-top: 10px;
      padding-top: 20px;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .free-shipping {
      color: #27ae60;
      font-weight: 500;
    }

    .free-shipping-message {
      background: #f1f8ff;
      color: #3498db;
      padding: 10px;
      border-radius: 4px;
      font-size: 0.9rem;
      margin: 10px 0;
      text-align: center;
    }

    .summary-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .checkout-btn, .clear-btn {
      width: 100%;
      padding: 15px;
      border: none;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .checkout-btn {
      background-color: #2ecc71;
      color: white;
    }

    .checkout-btn:hover:not(:disabled) {
      background-color: #27ae60;
    }

    .checkout-btn:disabled {
      background-color: #bdc3c7;
      cursor: not-allowed;
    }

    .clear-btn {
      background-color: #e74c3c;
      color: white;
    }

    .clear-btn:hover {
      background-color: #c0392b;
    }

    .continue-shopping, .continue-shopping-link {
      display: inline-block;
      color: #3498db;
      text-decoration: none;
      font-weight: 500;
      margin-top: 15px;
      text-align: center;
      width: 100%;
      transition: color 0.2s;
    }

    .continue-shopping:hover, .continue-shopping-link:hover {
      color: #2980b9;
    }

    @media (max-width: 900px) {
      .cart-grid {
        grid-template-columns: 1fr;
      }

      .cart-summary {
        position: static;
        margin-top: 20px;
      }
    }

    @media (max-width: 600px) {
      .cart-item {
        grid-template-columns: 80px 1fr;
      }

      .item-image {
        width: 80px;
        height: 80px;
      }

      .item-actions {
        flex-wrap: wrap;
      }

      .quantity-controls {
        width: 100%;
        justify-content: center;
      }

      .item-total {
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class CartComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  private currentItems: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.currentItems = items;
        this.cartItemsSubject.next(items);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTotalItems(): number {
    return this.currentItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.currentItems.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );
  }

  hasOutOfStockItems(): boolean {
    return this.currentItems.some(item => item.product.stockQuantity === 0);
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}