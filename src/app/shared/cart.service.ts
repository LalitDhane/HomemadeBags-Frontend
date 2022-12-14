import { Injectable } from '@angular/core';
import { Product } from '../Models/Product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartProductList: Product[] = JSON.parse(localStorage.getItem("CartProductList") || "[]");
  checkOutValueObject = {
    subTotal :  0,
    cartSize : 0,
    shippingCharges : 0,
    isCheckedOut:false
  };
  constructor() {
  }

  getProducts(): Product[] {
    return this.cartProductList;
  }
  
  findAndGetProductIndex(product:Product) {
    return this.cartProductList.findIndex(
      (element) => element._id === product._id
    );
  }

  addProduct(product: Product) {
    const existingProductIndex = this.findAndGetProductIndex(product);
    if (existingProductIndex !== -1) {
      this.cartProductList[existingProductIndex].quantity++;
    } else {
      product.quantity = 1;
      this.cartProductList.push(product);
    }
  }

  removeProduct(product: Product) {
    this.cartProductList.forEach((element, index) => {
      if (element._id === product._id) this.cartProductList.splice(index, 1);
    });
  }

  getCartProductList() {
    return this.cartProductList;
  }

  increaseQuantity(product:Product) {
    const productIndex = this.findAndGetProductIndex(product);
    this.cartProductList[productIndex].quantity++;
  }

  decreaseQuantity(product:Product) {
    const productIndex = this.findAndGetProductIndex(product);
    if(this.cartProductList[productIndex].quantity > 1)
      this.cartProductList[productIndex].quantity--;
  }

  updateLocalStorage() {
    localStorage.setItem("CartProductList",JSON.stringify(this.cartProductList));
  }

  getCheckOutValueObject() {
    return JSON.parse(localStorage.getItem("CheckOutValueObject") || "{}");
  }

  updateAndReturnCheckOutValueObject() {
    this.checkOutValueObject.subTotal = 0;
    this.cartProductList?.forEach((product) => {
      this.checkOutValueObject.subTotal += product.specialPrice * product.quantity;
    });
    this.checkOutValueObject.cartSize = this.cartProductList.length;
    this.checkOutValueObject.shippingCharges = this.checkOutValueObject.subTotal * 0.05;
    localStorage.setItem("CheckOutValueObject",JSON.stringify(this.checkOutValueObject));
    return this.checkOutValueObject;
  }
}
