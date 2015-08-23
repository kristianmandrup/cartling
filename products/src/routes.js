'use strict';

// See https://github.com/alexmingoia/koa-resource-router/
var Resource = require('koa-resource-router');
var product = require('./controllers/product');

export default function(app) {
  var router = app.router;
  var auth = app.auth;

  var products = new Resource('products', {
    // GET /products
    index: function *(next) {
      yield product.list(this);
    },
    // GET /products/new
    new: function *(next) {
      yield product.get(this);
    },
    // POST /products
    create: function *(next) {
      yield product.create(this);
    },
    // GET /products/:id
    show: function *(next) {
      yield product.get(this);
    },
    // GET /products/:id/edit
    edit: function *(next) {
      yield product.get(this);
    },
    // PUT /products/:id
    update: function *(next) {
      product.update(this);
    },
    // DELETE /products/:id
    destroy: function *(next) {
      product.close(this);
    }
  });
  app.use(products.middleware());
  return app;
}
