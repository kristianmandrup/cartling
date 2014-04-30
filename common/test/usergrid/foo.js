'use strict';

var _ = require('lodash');
var usergrid  = require('../helpers').libs.usergrid;
var validators = usergrid.validators;

var FooClass = {};
usergrid.define(FooClass, Foo);
module.exports = FooClass;

FooClass.attrs('name', 'email');

var BarClass = require('./bar');
FooClass.hasMany('bars', BarClass);

FooClass.validates({
  name:  [ validators.required ],
  email: [ validators.email ]
});

function Foo() {
}
