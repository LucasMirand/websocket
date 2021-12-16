let userApi = require('../components/users')

module.exports = (app)=>{
    userApi(app)
    app.get("/", (req, res, next) =>{
    res.render("index",{});
    }) 
    
}

