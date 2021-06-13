const { text } = require("express");

module.exports = (knex, taxes)=>{
    
    // Get all taxes
    taxes.get("/tax",(req,res)=>{
        knex("tax")
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

    // Get tax from it's id
    taxes.get("/tax/:tax_id",(req,res)=>{
        knex("tax").where("tax_id",req.params.tax_id)
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