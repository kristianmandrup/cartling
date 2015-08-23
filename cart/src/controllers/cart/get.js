import parse from 'co-parse';

var models = require('cartling-models');
var helpers = require('../helpers');
import helpers from '../helpers';
const common = helpers.common;
const errors = common.errors;


export default async function() {
  try {
    let req = this.req;
    let res = this.res;    
    let id = common.util.getId(this);
    let cart = await Cart.get(id);
    await cart.fetchItems();
    res.json(cart);
  } catch(err) {
    errors.sendError(res, err);
  }
};
