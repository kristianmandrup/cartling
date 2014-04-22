'use strict';

var Usergrid = require('usergrid');
var AUTH_CLIENT_ID = Usergrid.AUTH_CLIENT_ID;
var AUTH_APP_USER = Usergrid.AUTH_APP_USER;
var request = require('request');
var _ = require('lodash');
var inflection = require('inflection');

// changed to return the statusCode with the error
Usergrid.client.prototype.request = function (options, callback) {
  var self = this;
  var method = options.method || 'GET';
  var endpoint = options.endpoint;
  var body = options.body || {};
  var qs = options.qs || {};
  var mQuery = options.mQuery || false; //is this a query to the management endpoint?
  var orgName = this.get('orgName');
  var appName = this.get('appName');
  if(!mQuery && !orgName && !appName){
    if (typeof(this.logoutCallback) === 'function') {
      return this.logoutCallback(true, 'no_org_or_app_name_specified');
    }
  }
  var uri;
  if (mQuery) {
    uri = this.URI + '/' + endpoint;
  } else {
    uri = this.URI + '/' + orgName + '/' + appName + '/' + endpoint;
  }

  if (this.authType === AUTH_CLIENT_ID) {
    qs['client_id'] = this.clientId;
    qs['client_secret'] = this.clientSecret;
  } else if (this.authType === AUTH_APP_USER && self.getToken()) {
    qs['access_token'] = self.getToken();
  }

  if (this.logging) {
    console.log('calling: ' + method + ' ' + uri);
  }
  this._start = new Date().getTime();
  var callOptions = {
    method: method,
    uri: uri,
    json: body,
    qs: qs
  };
  request(callOptions, function (err, r, data) {
    if (err) { callback(err, data); }
    if (self.buildCurl) {
      options.uri = r.request.uri.href;
      self.buildCurlCall(options);
    }
    self._end = new Date().getTime();
    if(r.statusCode === 200) {
      if (self.logging) {
        console.log('success (time: ' + self.calcTimeDiff() + '): ' + method + ' ' + uri);
      }
      callback(err, data);
    } else {
      err = true;
      data.statusCode = r.statusCode;
      if ((r.error === 'auth_expired_session_token') ||
        (r.error === 'auth_missing_credentials')   ||
        (r.error === 'auth_unverified_oath')       ||
        (r.error === 'expired_token')   ||
        (r.error === 'unauthorized')   ||
        (r.error === 'auth_invalid')) {
        //this error type means the user is not authorized. If a logout function is defined, call it
        var error = r.body.error;
        var errorDesc = r.body.error_description;
        if (self.logging) {
          console.log('Error (' + r.statusCode + ')(' + error + '): ' + errorDesc);
        }
        //if the user has specified a logout callback:
        if (typeof(self.logoutCallback) === 'function') {
          self.logoutCallback(err, data);
        } else  if (typeof(callback) === 'function') {
          callback(err, data);
        }
      } else {
        var error = r.body.error;
        var errorDesc = r.body.error_description;
        if (self.logging) {
          console.log('Error (' + r.statusCode + ')(' + error + '): ' + errorDesc);
        }
        if (typeof(callback) === 'function') {
          callback(err, data);
        }
      }
    }
  });
};

// changed because getEntityId is just plain broken
Usergrid.entity.prototype.getEntityId = function (entity) {
  return entity.get('uuid') || entity.get('username') || entity.get('name') || false;
};

// changed to allow non-uuid identifiers (ie. could be 'name' or 'username')
// also, fixed a bug where the callback could be called twice
Usergrid.entity.prototype.destroy = function (callback) {
  var self = this;
  var type = this.get('type');
  var id = this.get('uuid') || this.get('username') || this.get('name');
  if (!id) {
    if (typeof(callback) === 'function') {
      var error = 'Error trying to delete object - no uuid or name specified.';
      if (self._client.logging) {
        console.log(error);
      }
      return callback(true, error);
    }
  }
  type += '/' + this.get('uuid');
  var options = {
    method:'DELETE',
    endpoint:type
  };
  this._client.request(options, function (err, data) {
    if (err && self._client.logging) {
      console.log('entity could not be deleted');
    } else {
      self.set(null);
    }
    if (typeof(callback) === 'function') {
      callback(err, data);
    }
  });
};

// changed to allow passing options - actually, just takes the 'qs' key for now
// also changes to pluralize the type
Usergrid.entity.prototype.getConnections = function (connection, opts, callback) {

  if (_.isFunction(opts)) { callback = opts; opts = undefined; }

  var self = this;

  //connector info
  var connectorType = inflection.pluralize(this.get('type'));
  var connector = this.getEntityId(this);
  if (!connector) {
    if (typeof(callback) === 'function') {
      var error = 'Error in getConnections - no uuid specified.';
      if (self._client.logging) {
        console.log(error);
      }
      callback(true, error);
    }
    return;
  }

  var endpoint = connectorType + '/' + connector + '/' + connection + '/';
  var options = {
    method:'GET',
    endpoint:endpoint
  };
  if (opts && opts.qs) { options.qs = opts.qs; }
  this._client.request(options, function (err, data) {
    if (err && self._client.logging) {
      console.log('entity connections could not be retrieved');
    }

    self[connection] = {};

    var length = data.entities.length;
    for (var i=0;i<length;i++)
    {
      if (data.entities[i].type === 'user'){
        self[connection][data.entities[i].username] = data.entities[i];
      } else {
        self[connection][data.entities[i].name] = data.entities[i];
      }
    }

    if (typeof(callback) === 'function') {
      callback(err, data, data.entities);
    }
  });
};


// adding a "delete by query" function
Usergrid.client.prototype.delete = function(opts, callback) {
  if (_.isFunction(opts)) { callback = opts; opts = undefined; }

  if (!opts.qs.q) { opts.qs.q = '*'; }

  var options = {
    method: 'DELETE',
    endpoint: opts.type,
    qs: opts.qs
  };
  var self = this;
  this.request(options, function (err, data) {
    if (err && self.logging) {
      console.log('entities could not be deleted');
    }
    if (typeof(callback) === 'function') {
      callback(err, data);
    }
  });
}