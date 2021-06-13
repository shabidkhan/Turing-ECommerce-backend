const express = require('express');
const router = express.Router();
const knex = require('../database/databaseConnector');
const jwt =require("jsonwebtoken")

// Here are creating 
require('../controllers/departments')(knex,router);

require("../controllers/categories")(knex,router);

require("../controllers/attributes")(knex, router);

require("../controllers/products")(knex, router);

require("../controllers/customers")(knex, jwt, router);

require("../controllers/orders") (knex,jwt, router);

require("../controllers/shoppingcart")(knex, router);

require("../controllers/tax")(knex, router);

require("../controllers/shipping")(knex, router);




module.exports = router;