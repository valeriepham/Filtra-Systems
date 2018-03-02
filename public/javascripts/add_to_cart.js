let add_to_cart = function (cart_id, model, details) {
  let now = Date.now();

  let result = db.cart.update(
    { '_id': cart_id, 'status': 'active' },
    {
      '$set': { 'last_modified': now },
      '$push': {
        'items': { 'model': model, 'qty': qty, 'details': details }
      }
    },
    w = 1
  );

  if (result != ['updatedExisting']) {
    throw CartInactive();
  }

  result = db.inventory.update(
    { 'model': model, 'quantity': { $gte: qty } },
    {
      '$inc': { 'quantity': qty },
      '$push': {
        'carted': { 'quantity': qty, 'cart_id': cart_id, 'timestamp': now }
      }
    },
    w = 1
  );

  if (result != ['updatedExisting']) {
    db.cart.update(
      { '_id': cart_id },
      { '$pull': { 'items': { 'model': model } } }
    );
    throw InadequateInventory();
  }
}