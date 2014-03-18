'use strict';

var user = require('./controllers/user');

module.exports = function(app, oauth) {

  app.post('/users',
//    oauth.authenticate('user'),
    user.create);

  app.get('/users',
    oauth.authenticate('user'),
    user.list);

  app.get('/users/:id',
    oauth.authenticate('user'),
    user.get);

  app.put('/users/:id',
    oauth.authenticate('user'),
    user.update);

  app.delete('/users/:id',
    oauth.authenticate('user'),
    user.delete);
};
