module.exports = (knex , departments)=>{

    // Get all departments data 
    departments.get('/departments',(req,res)=>{
        knex("*").from("department")
        .then(data=>{
            res.send(data);
            console.log(data);
        })
        .catch(err=>{
            res.send(err)
            console.log(err);
        })
    });

    // Get department data by it's id
    departments.get("/departments/:department_id",(req,res)=>{
        // console.log("id="+req.params.id);
        knex("*").from("department").where("department_id",req.params.department_id)
        .then(
            data=>{
                res.send(data);
                console.log(data);
            }
        ).catch(
            err=>{
                res.send(err)
                console.log(err);
            }
        )
    })

}

