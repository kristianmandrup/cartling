'use strict';

import Common from 'cartling-common';
const common = Common();
const errors = common.errors;
const models = require('cartling-models');
const User = models.User;

export default {
  list: async function() {
    // return all users from User model
    await User.find();
  },
  get: async function(id) {
    // return user by id
    await User.find({id: id});
  },
  create: async function(args) {
    await User.create(args);
  },
  update: async function(args) {
    await User.update(args);
  },
  delete: async function(id) {
    await User.find().delete();
  },

  authenticate: async function() {
    try {
      let req = this.req;
      if (!req.body) { return res.json(400, 'body required'); }

      var username = req.body.username;
      var password = req.body.password;

      token = await User.getAccessToken(username, password);
      res.json(token);
    } catch(err) {
      errors.sendError(res, err);
    }
  }
};
