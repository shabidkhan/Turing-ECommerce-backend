module.exports = (knex, shipping)=>{

    // Return shippings regions
    shipping.get("/shipping/regions",(req, res)=>{
        knex("shipping_region")
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

    // Return shippings regions
    shipping.get("/shipping/regions/:shipping_region_id",(req, res)=>{
        knex("shipping").where("shipping_region_id",req.params.shipping_region_id)
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
    })

}