class Cart{
  constructor(previousCart) {
    this.items = previousCart.items || {};
  }

  add(item, id) {
    let storedItem = this.items[id];
    if(!storedItem) {
      storedItem = this.items[id] = { item: item, quantity: 0, price: 0 };
    }
    storedItem.quantity += 1;
    storedItem.price = storedItem.item.price * storedItem.item.quantity;

  }

  cartItems() {
    let arr = [];
    for(const id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  }

  price() {
    let price = 0.0;
    for(const id in this.items) {
      price += this.items[id].price;
    }
    return price;
  }

  quantity() {
    let quantity = 0;
    for(const id in this.items) {
      quantity += this.items[id].quantity;
    }
    return quantity;
  }
}

module.exports = Cart;