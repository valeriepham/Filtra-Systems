class Cart{
  constructor(previousCart) {
    this.items = previousCart.items || {};
  }

  add(item, id, qty) {
    let storedItem = this.items[id];
    if(!storedItem) {
      storedItem = this.items[id] = { item: item, quantity: 0, price: 0 };
    }
    storedItem.quantity += parseInt(qty, 10);
    // console.log('storedItem.price = ', storedItem.price);
    // console.log('storedItem.item.pricing.retail = ', storedItem.item.pricing.retail);
    storedItem.price = storedItem.item.pricing.retail * storedItem.quantity;

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
    // console.log(price);
    return price;
  }

  quantity() {
    let quantity = 0;
    for(const id in this.items) {
      quantity += this.items[id].quantity;
    }
    // console.log(quantity);
    return quantity;
  }
}

module.exports = Cart;