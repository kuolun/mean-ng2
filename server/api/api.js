var router = require('express').Router();
var faker     = require('faker');

var Category = require('../app/models/category');
var Product =  require('../app/models/product');

//localhost:3000/api/telephone
router.get('/:name',function(req,res,next){
    Category.findOne({
        name:req.params.name
    },function(err,category){
        if(err) return next(err);

        for(var i =0;i<10;i++){
            var product = new Product();
            product.category = category._id;
            product.name = faker.commerce.productName();
            product.price = faker.commerce.price();
            product.image = faker.image.image();
            product.save();
        }
        res.json({
            message:'Success'
        });
    });
});







module.exports = router;