const knex =require('knex');

module.exports = knex({
    client:'mysql',
    connection:{
        host:'localhost',
        user:'root',
        password:'shabid@19',
        database:'turing'
    }
},
console.log("database has been connected"));