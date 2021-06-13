module.exports = (knex, attributes) =>{

    //for getting data form attributes table

    attributes.get("/attributes",(req, res)=>{
        knex("*").from("attribute")
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

    //for getting data by attribute id
    attributes.get("/attributes/:attribute_id",(req, res)=>{
        knex("*").from("attribute").where("attribute_id",req.params.attribute_id)
        .then(
            data =>{
                res.send(data);
                console.log(data);
            }
        ).catch(
            err => {
                res.send(err);
                console.log(err);
            }
        )
    });

    //for getting data from attribute value table by attribute id
    attributes.get("/attributes/values/:attribute_id",(req, res)=>{
        knex.select("attribute_value_id","value").from("attribute_value").where("attribute_id",req.params.attribute_id)
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


    // Getting data from all attributes by product id
    attributes.get('/attributes/inProduct/:product_id',(req,res)=>{
        knex.from('product_attribute')
        .innerJoin('attribute_value','product_attribute.attribute_value_id','attribute_value.attribute_value_id')
        .innerJoin('attribute','attribute_value.attribute_id','attribute.attribute_id')
        .select('attribute_value.attribute_value_id','attribute_value.value','attribute.name')
        .where('product_id',req.params.product_id)
        .then(data=>{
            res.send(data);
            console.log(data);
        })
        .catch(err=>{
            console.log(err);
            res.send(err)
        });

    });

}