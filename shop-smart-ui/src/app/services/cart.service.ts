import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Product } from '../models/product.interface';

interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private readonly STORAGE_KEY = 'shopping_cart';

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem(this.STORAGE_KEY);
    if (savedCart) {
      try {
        this.cartItems = JSON.parse(savedCart);
        this.cartSubject.next([...this.cartItems]);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }

  private saveCart(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  getCartItemCount(): Observable<number> {
    return this.cartSubject.pipe(
      map(items => items.reduce((count, item) => count + item.quantity, 0))
    );
  }

  addToCart(product: Product, quantity: number = 1): void {
    if (quantity <= 0) {
      console.error('Invalid quantity. Must be greater than 0.');
      return;
    }

    if (quantity > product.stockQuantity) {
      console.error('Not enough stock available.');
      return;
    }

    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity <= product.stockQuantity) {
        existingItem.quantity = newQuantity;
      } else {
        console.error('Cannot add more items than available in stock.');
        return;
      }
    } else {
      this.cartItems.push({ product, quantity });
    }
    
    this.cartSubject.next([...this.cartItems]);
    this.saveCart();
  }

  removeFromCart(productId: number): void {
    const initialLength = this.cartItems.length;
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    
    if (this.cartItems.length !== initialLength) {
      this.cartSubject.next([...this.cartItems]);
      this.saveCart();
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 0) {
      console.error('Invalid quantity. Must be 0 or greater.');
      return;
    }

    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      if (quantity > item.product.stockQuantity) {
        console.error('Cannot set quantity higher than available stock.');
        return;
      }

      if (quantity === 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.cartSubject.next([...this.cartItems]);
        this.saveCart();
      }
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartSubject.next([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getTotal(): Observable<number> {
    return this.cartSubject.pipe(
      map(items => items.reduce(
        (total, item) => total + (item.product.price * item.quantity), 
        0
      ))
    );
  }

  isInCart(productId: number): boolean {
    return this.cartItems.some(item => item.product.id === productId);
  }

  getItemQuantity(productId: number): number {
    const item = this.cartItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }
}