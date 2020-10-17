const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const Favorites = require('../models/favorite');
var ObjectId = require('mongodb').ObjectID;

const cors = require('./cors');
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json())

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200);})
.get(cors.cors,authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported');
})


.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    
    Favorites.findOne({user:req.user._id})
    .then((favorite) => {
        
       if (favorite != null && req.body.length > 0) {

            for( var i = 0; i < req.body.length; i++){
                if(favorite.dishes.indexOf(req.body[i]['_id']) == -1){             
                    favorite.dishes.push(req.body[i]['_id']);
                }
            }
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })            
            }, (err) => next(err));

       }
       else{
            Favorites.create({user:req.user._id})
            .then((favorite) => {             
                for( var i = 0; i < req.body.length; i++){
                    if(favorite.dishes.indexOf(req.body[i]['_id']) == -1){                        
                        favorite.dishes.push(req.body[i]['_id']);
                    }
                }
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })            
                }, (err) => next(err));
            }, (err) => next(err))
       }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({"user": req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));     
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200);})

.get(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported');
})


.put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported');
})


.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    
    Favorites.findOne({user:req.user._id})
    .then((favorite) => {
        
        if(favorite != null && favorite.dishes.indexOf(req.params.dishId) == -1){             
            
            
            favorite.dishes.push(req.params.dishId);
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })            
            }, (err) => next(err));
        }
       
       else{
            Favorites.create({user:req.user._id})
            .then((favorite) => {             
                
            favorite.dishes.push(req.params.dishId);
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })            
            }, (err) => next(err));
                
            }, (err) => next(err))
       }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorites.update({user:req.user._id},{$pull:{dishes: req.params.dishId}})
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })            
}, (err) => next(err));

module.exports = favoriteRouter;
