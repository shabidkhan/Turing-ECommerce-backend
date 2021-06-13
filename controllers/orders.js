const customers = require("./customers");

module.exports = (knex, jwt, orders)=>{

    // Insert orders/Create a Order
    orders.post("/orders",(req,res)=>{
        var cart_id = req.body.cart_id;
        // var shipping_id = req.body.shipping_id;
        // var tax_id = req.body.tax_id;
        var token = req.headers.cookie
        console.log(token);
        if (token){
            token = token.slice(4)
            jwt.verify(token,"123",(err,data)=>{
                knex
                .select("*")
                .from("shopping_cart")
                .where("cart_id",cart_id)
                .join("product",'shopping_cart.product_id','product.product_id')
                .then((data)=>{
                    knex("orders").insert({
                        "total_amount":data[0].quantity*data[0].price,
                        "created_on":new Date(),
                        "customer_id":token.customer_id,
                        "shipping_id":req.body.shipping_id,
                        "tax_id":req.body.tax_id
                    })
                    .then((result)=>{
                        knex("order_detail").insert({
                            "unit_cost":data[0].price,
                            "quantity":data[0].quantity,
                            "product_name":data[0].name,
                            "attributes":data[0].attributes,
                            "product_id":data[0].product_id,
                            "order_id":result[0]
                        })
                        .then((detail)=>{
                            knex.select("*").from("shopping_cart").where("cart_id",cart_id).delete()
                            .then(()=>{
                                res.send({"order Id":result[0]})
                            }).catch(()=>{
                                res.send({"error":"error in deleting data"})
                            })
                        }).catch(()=>{
                            res.send({"error":"error in insserting data in orders detail."})
                        })
                    });
                })    
            });
        }
    });

// Get orders by customer
    orders.get("/orders/inCustomer",(req,res)=>{
        var token = req.headers.cookie
        if (token){
            token = token.slice(4)
            jwt.verify(token,"123", (err, data)=>{
                var id = data.customer_id
                console.log(id);
                knex("orders")
                .where("customer_id",id)
                .then(
                    data =>{
                        res.send(data);
                        console.log(data);
                    }
                ).catch(
                    err=>{
                    res.send(err);
                    console.log(err);
                })
            })
        }else{
            console.log({"msg":"Please loggin your id!"});
            res.send({"msg":"Please loggin your id!"})
        }
    })

    //Get Info about Order
    orders.get("/orders/:order_id",(req, res)=>{
        var order_id = req.params.order_id;
        var token =req.headers.cookie
        if (token){
            knex("order_detail")
            .where("order_id",order_id)
            .then(
                data =>{
                    res.send(data)
                    console.log(data);
                }
            ).catch(
                err =>{
                    res.send(err);
                    console.log(err);
                }
            )
        }

    });

    // Get orders by order id
    orders.get("/orders/shortDetail/:order_id",(req, res)=>{
        var token = req.headers.cookie;
        token = token.slice(4)
        var verified_token = jwt.verify(token, "123")
        knex
        .select(
            'orders.order_id',
            'orders.total_amount',
            'orders.created_on',
            'orders.shipped_on',
            'orders.status',
            'order_detail.product_name as name'
        )
        .from('orders')
        .join('order_detail','orders.order_id','order_detail.order_id')
        .where('orders.order_id', req.params.order_id)
        .then((data) =>{
            console.log("data");
            res.send(data)
        }).catch((err) =>{
            console.log(err);
        })
    })

    
}