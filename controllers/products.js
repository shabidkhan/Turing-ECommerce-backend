module.exports = (knex, products)=>{

    // get all products
    products.get("/products",(req,res)=>{
        knex().from("product")
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

    // search products
    products.get("/products/search",(req,res)=>{
        var search_name = req.query.name
        knex().from("product").where('name','like','%'+search_name+'%')
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

    // get product by product id
    products.get("/products/:product_id",(req, res)=>{
        knex().from("product").where("product_id",req.params.product_id)
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

    // get a list of products of categories id
    products.get("/products/inCategory/:category_id",(req, res)=>{
        knex().from("product")
        .rightOuterJoin("product_category","product_category.product_id","product.product_id")
        .where("category_id",req.params.category_id)
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

    // Get a list of products on department
    products.get("/products/inDepartment/:department_id",(req, res)=>{
        knex().from("category")
        .innerJoin("product_category","category.department_id","product_category.category_id" )
        .innerJoin("product","product_category.product_id","product.product_id")
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
    });

    // get details of a product
    products.get("/products/:product_id/details",(req, res)=>{
        knex().from("product").where("product_id",req.params.product_id)
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

    // get locations of a product
    products.get("/products/:product_id/locations",(req, res)=>{
        knex.select('category.category_id',"category.name as category_name","department.department_id","department.name as department_name").from("product_category")
        .rightOuterJoin("category","category.category_id","product_category.category_id" )
        .rightOuterJoin("department","department.department_id","category.department_id")
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

    // Get review of a product
    products.get("/products/:product_id/reviews",(req,res)=>{
        knex.select("*").from("review")
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
        
    })

    // post reviews of a Product
    products.post("/products/:product_id/reviews",(req, res)=>{
        var review = {}
        review.review_id =req.body.review_id
        review.customer_id =req.body.customer_id
        review.product_id = req.params.product_id
        review.review =req.body.review
        review.rating = req.body.rating
        review.created_on = req.body.created_on
        knex('review').insert(review)
        .then(
            data =>{
                knex.select("*").from("review").where("review_id",data)
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
                res.send(err)
                console.log(err);
            }
        )
        
    })

}