// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_uxg0FRXwXVLJidLOj1Xvm6AJ");

(async function() {
  // Create a Customer:
  const customer = await stripe.customers.create({
    source: 'tok_mastercard',
    email: 'paying.user@example.com',
  });

  // Charge the Customer instead of the card:
  const charge = await stripe.charges.create({
    amount: 1000,
    currency: 'usd',
    customer: 'CUSTOMER',
  });

  // YOUR CODE: Save the customer ID and other info in a database for later.

})();

(async function() {
  // When it's time to charge the customer again, retrieve the customer ID.
  const charge = stripe.charges.create({
    amount: 1500, // $15.00 this time
    currency: 'usd',
    customer: 'CUSTOMER', // Previously stored, then retrieved
  });
})();
