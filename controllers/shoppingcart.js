module.exports = (knex, shoppingcarts)=>{

    // Get all shopping carts
    shoppingcarts.get("/shoppingcart/generateUniqueId", (req, res)=>{
        knex.select("cart_id").from("shopping_cart")
        .then(
            data =>{
                res.send(data);
                console.log(data);
            }
        ).catch(
            err =>{
                res.send(err);
                console.log(err);
            }
        )
    });

    // Add shopping cart
    shoppingcarts.post("/shoppingcart/add",(req, res)=>{
        var cart_body =req.body
        console.log(cart_body);
        var cart_details = {}
        cart_details.cart_id = cart_body.cart_id
        cart_details.product_id = cart_body.product_id
        cart_details.attributes = cart_body.attributes
        cart_details.quantity  = cart_body.quantity 
        cart_details.buy_now = cart_body.buy_now
        cart_details.added_on = cart_body.added_on
        knex("shopping_cart").insert(cart_details)
        .then(
            primary =>{
                knex.select("shopping_cart.item_id","shopping_cart.cart_id","shopping_cart.product_id","shopping_cart.attributes","shopping_cart.quantity","shopping_cart.buy_now","shopping_cart.added_on","product.price")
                .columns([
                    knex.raw("sum(product.price * shopping_cart.quantity) as subtotal")
                  ])
                .from("shopping_cart")
                .rightOuterJoin("product","product.product_id","shopping_cart.product_id")
                .where("item_id",primary)
                .then(
                    data =>{
                        res.send(data);
                        console.log(data);
                    }
                ).catch(
                    err =>{
                        res.send(err);
                        console.log(err);
                    }
                )
            }
        ).catch(
            err =>{
                res.send(err);
                console.log(err);
            }
        )
    });

    // Get shopping cart from it's cart id
    shoppingcarts.get("/shoppingcart/:cart_id",(req, res)=>{
        knex().from("shopping_cart").where("cart_id",req.params.cart_id)
        .then(
            data =>{
                res.send(data);
                console.log(data);
            }
        ).catch(
            err =>{
                res.send(err);
                console.log(err);
            }
        )
    });

    // Edit shopping cart from it's item id
    shoppingcarts.put("/shoppingcart/update/:item_id",(req,res)=>{
        var cart_body =req.body
        var cart_details = {}
        cart_details.cart_id = cart_body.cart_id
        cart_details.product_id = cart_body.product_id
        cart_details.attributes = cart_body.attributes
        cart_details.quantity  = cart_body.quantity 
        cart_details.buy_now = cart_body.buy_now
        cart_details.added_on = cart_body.added_on
        knex("shopping_cart").where("item_id",req.params.item_id)
        .update(cart_details)
        .then(
            item_id =>{
                console.log(item_id);
                knex().from("shopping_cart")
                .where("item_id",item_id)
                .then(
                    data =>{
                        res.send(data);
                        console.log(data);
                    }
                ).catch(
                    err =>{
                        res.send(err);
                        console.log(err);
                    }
                )
            }
        ).catch(
            err =>{
                res.send(err);
                console.log(err);
            }
        )
    });

    // Delete shopping cart from it's cart id
    shoppingcarts.delete("/shoppingcart/empty/:cart_id",(req, res)=>{
        knex("shopping_cart").where("cart_id",req.params.cart_id)
        .del()
        .then(
            message =>{
                res.send(message+" cart has been deleted!")
                console.log("cart has been deleted!");
            }
        ).catch(
            err =>{
                res.send(err);
                console.log(err);
            }
        )
    });

    // move to shopping cart into cart 
    shoppingcarts.get("/shoppingcart/moveToCart/:item_id",(req,res)=>{
        knex.schema.createTable('cart', function(table){
            table.increments('item_id').primary();
            table.string('cart_id');
            table.integer('product_id');
            table.string('attributes');
            table.integer('quantity');
            table.integer('subtotal');
            table.integer('price');
            table.integer('buy_now');
            table.datetime('added_on');
         }).then(() => {
            console.log("cart table created successfully....")
         }).catch(() => {
            console.log("cart table is already exists!");
        }).finally(()=>{
            var id = req.params.item_id
            knex.select("shopping_cart.item_id","shopping_cart.cart_id","shopping_cart.product_id","shopping_cart.attributes","shopping_cart.quantity","shopping_cart.buy_now","shopping_cart.added_on","product.price")
            .from("shopping_cart")
            .columns([
                knex.raw("sum(product.price * shopping_cart.quantity) as subtotal")
              ])
            .rightOuterJoin("product","product.product_id","shopping_cart.product_id")
            .where("item_id",id)
            .then(
                data =>{
                    console.log(data);
                    knex("cart").insert(data)
                    .where("item_id",id)
                    .then(
                        () =>{
                            res.send({"Good": "data move from shopping_cart to cart successfully!"});
                            console.log({"Good": "data move from shopping_cart to cart successfully!"});
                        }
                    ).catch(
                        err =>{   // In this case we got error on console but we get cart on browser
                            res.send({"Error": "this id is not available in shopping_cart"});
                            console.log({"Error": "this id is not available in shopping_cart"});
                        }
                    )
                }
            ).catch(
                err =>{
                    res.send(err);
                    console.log(err);
                }
            )
        });
       
    });

    // Get total amount
    shoppingcarts.get("/shoppingcart/totalAmount/:cart_id",(req,res)=>{
        var id = req.params.cart_id
        knex("cart").sum("subtotal as total_amount")
        .where("cart_id",id)
        .then((
            data =>{
                res.send(data);
                console.log(data);
            }
        )).catch(
            err =>{
                res.send(err);
                console.log(err);
            }
        )
    });

    // Move shopping cart into later
    shoppingcarts.get("/shoppingcart/saveForLater/:item_id",(req,res)=>{
        knex.schema.createTable('later', function(table){
            table.increments('item_id').primary();
            table.string('cart_id');
            table.integer('product_id');
            table.string('attributes');
            table.integer('quantity');
            table.integer('subtotal');
            table.integer('price');
            table.integer('buy_now');
            table.datetime('added_on');
         }).then(() => {
            console.log("cart table created successfully....")
         }).catch(() => {
            console.log("cart table is already exists!");
        }).finally(()=>{
            var id = req.params.item_id
            knex.select("shopping_cart.item_id","shopping_cart.cart_id","shopping_cart.product_id","shopping_cart.attributes","shopping_cart.quantity","shopping_cart.buy_now","shopping_cart.added_on","product.price")
            .from("shopping_cart")
            .columns([
                knex.raw("sum(product.price * shopping_cart.quantity) as subtotal")
              ])
            .rightOuterJoin("product","product.product_id","shopping_cart.product_id")
            .where("item_id",id)
            .then(
                data =>{
                    console.log(data);
                    knex("later").insert(data)
                    .where("item_id",id)
                    .then(
                        () =>{
                            res.send({"Good": "data move from shopping_cart to later successfully!"});
                            console.log({"Good": "data move from shopping_cart to later successfully!"});
                        }
                    ).catch(
                        err =>{   // In this case we got error on console but we get cart on browser
                            res.send({"Error": "sorry! this item_id is not available in this table."});
                            console.log({"Error": "sorry! this item_id is not available in this table."});
                        }
                    )
                }
            ).catch(
                err =>{
                    res.send(err);
                    console.log(err);
                }
            )
        });
       
    });

    // Get Products saved for latter
    shoppingcarts.get("/shopping_cart/getSaved/:cart_id", (req, res) =>{
        let cart_id = req.params.cart_id;
        knex
        .select(
            'item_id',
            'product.name',
            'shopping_cart.attributes',
            'product.price'
        )
        .from('shopping_cart')
        .join('product', function(){
            this.on('shopping_cart.product_id', 'product.product_id')
        })
        .where('shopping_cart.cart_id', cart_id)
        .then((data) =>{
            res.send(data);
        }).catch((err) =>{
            console.log(err);
        })
    })

    // Remove a product in the cart
    shoppingcarts.delete("/shopping_cart/removeProduct/:item_id", (req, res) =>{
        let item_id = req.params.item_id;
        knex
        .select('*')
        .from('shopping_cart')
        .where('item_id', item_id)
        .delete()
        .then((data) =>{
            console.log("data delete successfully!")
            res.send("data delete successfully!")
        }).catch((err) =>{
            console.log(err);
        })
    })
}