class Cart {
  constructor(previousCart) {
    this.items = previousCart.items || {};
    this.shipping = previousCart.shipping || {};
    for (let id in this.items) {
      this.items[id].price = this.items[id].item.pricing.retail * this.items[id].quantity;
    }
    this.price = this.getPrice();
    this.total = this.total();
  }

  add(item, id, qty) {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, quantity: 0, price: 0 };
    }
    storedItem.quantity += parseInt(qty, 10);
    console.log('storedItem.price = ', storedItem.price);
    console.log('storedItem.item.pricing.retail = ', storedItem.item.pricing.retail);
    storedItem.price = storedItem.item.pricing.retail * storedItem.quantity, 10;
  }

  remove(id) {
    delete this.items[id];
  }

  updateQuantity(id, qty) {
    let storedItem = this.items[id];
    switch (qty) {
    case '+1':
      storedItem.quantity += 1;
      break;
    case '-1':
      if (storedItem.quantity <= 1) {
        delete this.items[id];
      } else {
        storedItem.quantity -= 1;
      }
      break;
    default:
      storedItem.quantity = qty;
    }
    storedItem.price = storedItem.item.pricing.retail * storedItem.quantity;
  }

  cartItems() {
    let arr = [];
    for (const id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  }

  getPrice() {
    let price = 0.0;
    for (let id in this.items) {
      // this.items[id].price = parseFloat(this.items[id].item.pricing.retail) * parseFloat(this.items[id].quantity);
      price += this.items[id].price;
    }
    return price;
  }

  total() {
    let sub = this.getPrice();
    let total = sub;
    if (!this.shipping.method) {
      total = sub * 1.2375;
    } else {
      total = sub * (1.0875 + parseFloat(this.shipping.method));
    }
    return total;
  }

  quantity() {
    let quantity = 0;
    for (const id in this.items) {
      quantity += this.items[id].quantity;
    }
    // console.log(quantity);
    return quantity;
  }
}

module.exports = Cart;