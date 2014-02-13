'use strict';

var _ = require('lodash');
var usergrid  = require('../helpers').libs.usergrid;
var validators = usergrid.validators;

usergrid.define(this, Foo);

function Foo() {

  this.validates({
    name:  [ validators.required ],
    email: [ validators.email ]
  });

}
