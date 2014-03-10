phrixus
=======

A Shopping Cart system utilizing [Volos](https://github.com/apigee/volos) and [Usergrid](https://github.com/usergrid/usergrid) designed to service that can be used by a variety of applications via a REST API, optionally executes in [Apigee Edge](http://apigee.com), and maintains its data in Usergrid in a well-defined schema.


Getting Started
===============
Phrixus is intended to be a REST library that will be integrated into a larger ecommerce solution. However, you may start by using with the library as a stand-alone app. The quickest way to start playing:

1. copy config/development-sample.js to config/development.js
2. edit config/development.js to reflect your usergrid settings
3. install & start redis
4. run bin/register
5. run bin/app.js
6. start making curl requests!


Functionality
=============
* Maintain multiple carts associated to a customer id
* Maintain product line items associated to a cart
* Maintain a customer's active shopping cart
* Merge carts together (close cart, clone items and add to target cart)
* Close carts (maintain archive data forever)
* Maintain anonymous carts (associated to a session id)
* Assign an anonymous cart to a user
* Automatically close anonymous carts after a configurable inactivity period
* Require valid OAuth authentication and scope(s) for access to functionality
* Provide for post-oauth plugin for fine-grained access control of changes
* Emit state change events for all entities (integration & analytics)
* Store state changes for analytics
* Log all operations


API
===

Carts (requires OAuth scope: 'cart')
-----------------------------------

| API | Description |
| --- | ----------- |
| POST /carts | create a new cart |
| PUT /carts/:id | update the cart |
| GET /carts/?q='query' | retrieve a list of (open and closed) carts with optional Usergrid query. |
| GET /carts/:id | retrieve a cart & associated line items by id or name |
| DELETE /cart/:id?merge=:targetCartId | close the cart. merge is optional. on error during copy, cart will not be closed. cart may be unclosed by update: status = 'open' |
| POST /carts/:id/items/:id { sku: '<sku>', quantity: 1, price: 99.99 } | add a cart line item |
| PUT /carts/:id/items/:id { sku: '<sku>', quantity: 1, price: 99.99 } | update cart line item |
| DELETE /carts/:id/items/:id | remove a cart line item |


Logged in user-scoped carts (requires OAuth scope: 'mycart')
----------------------------------------------------------

| API | Description |
| --- | ----------- |
| POST /my/carts | create a new cart |
| PUT /my/carts/:id | update the cart |
| GET /carts/?q='query' | retrieve a list of my open carts with optional Usergrid query. |
| GET /my/carts/:id | retrieve one of my open carts & associated line items by id or name.|
| DELETE /my/carts/:id?merge=:targetCartId | close the cart. merge is optional. on error during copy, cart will not be closed. cart may be unclosed by update: status = 'open' |
| POST /my/carts/:id/items/:id { sku: '<sku>', quantity: 1, price: 99.99 } | add a cart line item |
| PUT /my/carts/:id/items/:id { sku: '<sku>', quantity: 1, price: 99.99 } | update cart line item |
| DELETE /my/carts/:id/items/:id | remove a cart line item |


Users (requires OAuth scope: 'user')
------------------------------------

Note: This is stub functionality that may be replaced by an existing user management system.

| API | Description |
| --- | ----------- |
| POST /users { username: 'foo', password: 'foo' } | create a new user |
| GET /users/?q='query' | retrieve a list of users with optional Usergrid query |
| GET /user/:id | retrieve a user |
| PUT /user/:id | update a user |
| DELETE /user/:id | delete a user |

