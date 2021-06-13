module.exports = (knex,categories)=>{
    
    // for all categories
    categories.get("/categories",(req,res)=>{
        knex("*").from("category")
        .then(
            data=>{
                res.send(data);
                console.log(data);

            }
        ).catch(
            err=>{
                res.send(err);
                console.log(err);
            }
        );
    });

    //Getting data by category id
    categories.get("/categories/:category_id",(req,res)=>{
        knex("*").from("category").where("category_id",req.params.category_id)
        .then(
            data=>{
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

    //getting data by product id
    categories.get("/categories/inProduct/:product_id",(req,res)=>{
        
        knex("*").from("category")
        .rightOuterJoin('product_category', 'category.category_id', 'product_category.category_id')
        .where("product_id",req.params.product_id)
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

    //getting data by department_id
    categories.get("/categories/inDepartment/:department_id",(req,res)=>{
        knex("*").from("category")
        .where("department_id",req.params.department_id)
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

};