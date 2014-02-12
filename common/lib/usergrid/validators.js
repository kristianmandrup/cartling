'use strict';

var _ = require('lodash');
var validator = require('validator');

var required = function(str) {
  if (str === undefined || str === null || str === '') {
    return '%s is required';
  }
};

var validator_specs = {
  email:        [ validator.isEmail,        '%s is not a valid email address'],
  url:          [ validator.isURL,          '%s is not a valid url' ],
  alpha:        [ validator.isAlpha,        '%s must only include alpha characters (A-Z)' ],
  numeric:      [ validator.isNumeric,      '%s must only include digits (0-9)' ],
  alphanumeric: [ validator.isAlphanumeric, '%s must only include alpha or numeric digits (A-Z and 0-9)' ],
  date:         [ validator.isDate,         '%s is not a valid date' ]
};

var validateSpec = function(spec, str) {
  if (str && !spec[0](str)) { return spec[1]; }
};

var validators = {};
validators.required = required;
_.each(validator_specs, function(spec,name) {
  validators[name] = _.partial(validateSpec, spec);
});

module.exports = validators;


/*
These are provider by the 'validator' module imported above...

equals(str, comparison) - check if the string matches the comparison.
contains(str, seed) - check if the string contains the seed.
matches(str, pattern [, modifiers]) - check if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').
isEmail(str) - check if the string is an email.
isURL(str) - check if the string is an URL.
isIP(str [, version]) - check if the string is an IP (version 4 or 6).
isAlpha(str) - check if the string contains only letters (a-zA-Z).
isNumeric(str) - check if the string contains only numbers.
isAlphanumeric(str) - check if the string contains only letters and numbers.
isHexadecimal(str) - check if the string is a hexadecimal number.
isHexColor(str) - check if the string is a hexadecimal color.
isLowercase(str) - check if the string is lowercase.
isUppercase(str) - check if the string is uppercase.
isInt(str) - check if the string is an integer.
isFloat(str) - check if the string is a float.
isDivisibleBy(str, number) - check if the string is a number that's divisible by another.
isNull(str) - check if the string is null.
isLength(str, min [, max]) - check if the string's length falls in a range.
isUUID(str [, version]) - check if the string is a UUID (version 3, 4 or 5).
isDate(str) - check if the string is a date.
isAfter(str [, date]) - check if the string is a date that's after the specified date (defaults to now).
isBefore(str [, date]) - check if the string is a date that's before the specified date.
isIn(str, values) - check if the string is in a array of allowed values.
isCreditCard(str) - check if the string is a credit card.
isISBN(str [, version]) - check if the string is an ISBN (version 10 or 13).

 */