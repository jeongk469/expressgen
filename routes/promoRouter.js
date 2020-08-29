const express = require('express');
const bodyParser = require('body-parser');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the promos to you!');
})
.post((req, res, next) => {
    res.end('Will add the promo: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promos');
})
.delete((req, res, next) => {
    res.end('Deleting all promos');
});

promoRouter.route('/:promoID')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send detail of the promo:' + req.params.promoID + ' to you!');
})
.post((req, res, next) => {
    res.end('POST operation not supported on /promos/' + req.params.promoID);
})

.put((req,res,next)=>{

    
    res.write('Updating the promo:' + req.params.promoID + '\n');
    res.end('Will update the promo: ' + req.body.name + 
        ' with details: ' + req.body.description);


})

.delete((req, res, next) => {
    res.end('Deleting promo: ' + req.params.promoID);
});

module.exports = promoRouter;