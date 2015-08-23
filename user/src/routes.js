// See https://github.com/alexmingoia/koa-resource-router/
var Resource = require('koa-resource-router');
var user = require('../controllers/user');

export default function(app) {
  var router = app.router;
  var auth = app.auth;

  var users = new Resource('users', {
    // GET /users
    index: async function() {
      await user.list(this);
    },
    // GET /users/new
    new: async function() {
      await user.get(this);
    },
    // POST /users
    create: async function() {
      await user.create(this);
    },
    // GET /users/:id
    show: async function() {
      await user.get(this);
    },
    // GET /users/:id/edit
    edit: async function() {
      await user.get(this);
    },
    // PUT /users/:id
    update: async function() {
      await user.update(this);
    },
    // DELETE /users/:id
    destroy: async function() {
      await user.close(this);
    }
  });
  app.use(users.middleware());
  return app;
}
