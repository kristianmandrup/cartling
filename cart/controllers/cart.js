'use strict';

var models = require('../models');
var Cart = models.Cart;

var cartController = {
  list:
    function(req, res) {
      Cart.all(function(err, reply) {
        if (err) { return res.json(500, err); }
        res.json(reply);
      });
    },

  get:
    function(req, res) {
      var id = req.params.id;
      if (!id) { return res.json(400, 'missing id'); }
      Cart.find(id, function(err, reply) {
        if (err) { return res.json(err); }
        res.json(reply);
      });
    },

  create:
    function(req, res) {
      if (!req.body) { return res.json(400, 'body required'); }
      var attributes = req.body;
      Cart.create(attributes, function(err, reply) {
        // todo: check specifically for validation errors
        if (err) { return res.json(400, err); }
        res.json(reply);
      });
    },

  update:
    function(req, res) {
      if (!req.body) { return res.json(400, 'body required'); }
      var attributes = JSON.parse(req.body);
      Cart.update(attributes, function(err, reply) {
        if (err) { return res.json(err); }
        res.json(reply);
      });
    },

  close:
    function(req, res) {
      var id = req.params.id;
      if (!id) { return res.json(400, 'missing id'); }
      return res.json(501, 'TODO'); // todo
    }
};
module.exports = cartController;
