let {Router} = require('express')
let router = new Router()
let userControler = require('./controllers/userControllers')
module.exports=(app)=>{
    app.use('/users', router)
    router.get('./', userControler.init)
}