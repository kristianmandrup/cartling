'use strict';

// See https://github.com/alexmingoia/koa-resource-router/
var Resource = require('koa-resource-router');
var bodyParser = require('koa-bodyparser');
var product = require('./controllers/product');

export default function(app) {
  var router = app.router;
  var auth = app.auth;

  var products = new Resource('products', {
    // GET /products
    index: async function() {
      await product.list(this);
    },
    // GET /products/new
    new: async function() {
      await product.get(this);
    },
    // POST /products
    create: async function() {
      await product.create(this);
    },
    // GET /products/:id
    show: async function() {
      await product.get(this);
    },
    // GET /products/:id/edit
    edit: async function() {
      await product.get(this);
    },
    // PUT /products/:id
    update: async function() {
      await product.update(this);
    },
    // DELETE /products/:id
    destroy: async function() {
      await product.close(this);
    }
  });
  app.use(products.middleware());
  app.use(bodyParser());
  return app;
}
