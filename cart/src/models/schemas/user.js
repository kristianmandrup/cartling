var CartClass = require('./cart');
UserClass.hasMany('carts', CartClass);

module.exports = UserClass;
