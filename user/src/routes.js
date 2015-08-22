// See https://github.com/alexmingoia/koa-resource-router/
var Resource = require('koa-resource-router');
var user = require('../controllers/user');

module.exports = function(app) {
  var router = app.router;
  var auth = app.auth;

  var users = new Resource('users', {
    // GET /users
    index: function *(next) {
      yield user.list(this);
    },
    // GET /users/new
    new: function *(next) {
      yield user.get(this);
    },
    // POST /users
    create: function *(next) {
      yield user.create(this);
    },
    // GET /users/:id
    show: function *(next) {
      yield user.get(this);
    },
    // GET /users/:id/edit
    edit: function *(next) {
      yield user.get(this);
    },
    // PUT /users/:id
    update: function *(next) {
      user.update(this);
    },
    // DELETE /users/:id
    destroy: function *(next) {
      user.close(this);
    }
  });
  app.use(users.middleware());
  return app;
}
