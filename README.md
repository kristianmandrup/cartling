phrixus.next
============

An open source node.js shopping cart (and ultimately an ecommerce system) service.

This refactored version of phrixus is a WIP. It aims to have no coupling to any specific backend or framework. The models used should expose a standard interface. There should be a `phrixus-models` reference implementation package for Mongo DB via Keystone or Mongoose, but it should be easy to swap in whichever backend adhering to the same API.

The routes and controllers should be set up to work with Express 4 or Koa, again using a common API wrapper.

Getting Started Locally
=======================

Phrixus is intended to be a set of REST modules that may be integrated into a larger ecommerce solution. However, the quickest way to start playing with the system is to see the libraries integrated into an example web-based ecommerce app:

1.	copy app/config/development-sample.js to app/config/development.js ('development' is selected as default config)
2.	edit app/config/development.js to reflect your usergrid settings (and optionally, passport settings)
3.	install & start redis
4.	run `npm install` (this will link the Phrixus modules in this repo locally)
5.	run `bin/create_sample_products`
6.	run `bin/register`
7.	run `node app/app.js`
8.	check the output and open your browser to [http://localhost:3000]() (or start making curl requests)

Deploying to Apigee
===================

1.	copy app/config/apigee-sample.js to app/config/apigee-{env}.js (where {env} is your apigee environment, ie. 'test')
2.	edit app/config/apigee-{env}.js to reflect your hosted usergrid settings (and optionally, passport settings)  
3.	run `NODE_ENV=apigee-{env} bin/create_sample_products`
4.	run `NODE_ENV=apigee-{env} bin/register`
5.	run 'npm install' in the app directory
6.	use apigeetool to deploy the app directory

// todo: make registration and populate part of a deployment command line?

A note about configuration
==========================

App configuration is done using a standard mechanism based on NODE_ENV.

Cart Functionality
==================

-	Maintain multiple carts associated to a customer id
-	Maintain product line items associated to a cart
-	Maintain a customer's active shopping cart
-	Merge carts together (close cart, clone items and add to target cart)
-	Close carts (maintain archive data forever)
-	Maintain anonymous carts (associated to a session id)
-	Assign an anonymous cart to a user
-	Automatically close anonymous carts after a configurable inactivity period
-	Require valid OAuth authentication and scope(s) for access to functionality
-	Provide for post-oauth plugin for fine-grained access control of changes
-	Emit state change events for all entities (integration & analytics)
-	Store state changes for analytics
-	Log all operations

Cart API
========

Carts (requires OAuth scope: 'cart')
------------------------------------

| API                                                                   | Description                                                                                                                       |
|:----------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------|
| POST /carts                                                           | create a new cart                                                                                                                 |
| PUT /carts/:id                                                        | update the cart                                                                                                                   |
| GET /carts/?q='query'                                                 | retrieve a list of (open and closed) carts with optional Usergrid query.                                                          |
| GET /carts/:id                                                        | retrieve a cart & associated line items by id or name                                                                             |
| DELETE /cart/:id?merge=:targetCartId                                  | close the cart. merge is optional. on error during copy, cart will not be closed. cart may be unclosed by update: status = 'open' |
| POST /carts/:id/items/:id { sku: '<sku>', quantity: 1, price: 99.99 } | add a cart line item                                                                                                              |
| PUT /carts/:id/items/:id { sku: '<sku>', quantity: 1, price: 99.99 }  | update cart line item                                                                                                             |
| DELETE /carts/:id/items/:id                                           | remove a cart line item                                                                                                           |

Logged in user-scoped carts (requires OAuth scope: 'mycart')
------------------------------------------------------------

| API                                                                      | Description                                                                                                                       |
|:-------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------|
| POST /my/carts                                                           | create a new cart                                                                                                                 |
| PUT /my/carts/:id                                                        | update the cart                                                                                                                   |
| GET /carts/?q='query'                                                    | retrieve a list of my open carts with optional Usergrid query.                                                                    |
| GET /my/carts/:id                                                        | retrieve one of my open carts & associated line items by id or name.                                                              |
| DELETE /my/carts/:id?merge=:targetCartId                                 | close the cart. merge is optional. on error during copy, cart will not be closed. cart may be unclosed by update: status = 'open' |
| POST /my/carts/:id/items/:id { sku: '<sku>', quantity: 1, price: 99.99 } | add a cart line item                                                                                                              |
| PUT /my/carts/:id/items/:id { sku: '<sku>', quantity: 1, price: 99.99 }  | update cart line item                                                                                                             |
| DELETE /my/carts/:id/items/:id                                           | remove a cart line item                                                                                                           |

Users (requires OAuth scope: 'user')
------------------------------------

Note: This is stub functionality that may be replaced by an existing user management system.

| API                                              | Description                                           |
|:-------------------------------------------------|:------------------------------------------------------|
| POST /users { username: 'foo', password: 'foo' } | create a new user                                     |
| GET /users/?q='query'                            | retrieve a list of users with optional Usergrid query |
| GET /user/:id                                    | retrieve a user                                       |
| PUT /user/:id                                    | update a user                                         |
| DELETE /user/:id                                 | delete a user                                         |
