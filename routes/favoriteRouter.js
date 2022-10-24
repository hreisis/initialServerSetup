const express = require("express");
const Favorite = require("../models/campsite");
const authenticate = require("../authenticate");
const cors = require("./cors");
const user = require("../models/user");

const favoriteRouter = express.Router();

const middleware = (req, res, next) => {
  console.log("Favorite Test");
  next();
};

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("favorites.user")
      .populate("favorites.campsites")
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
      })
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    (req, res, next) => {
      Favorite.findOne({ user: req.user._id })
        .then((favorite) => {
          const campsiteId = req.body._id;
          const favorited = !!favorite.campsites.id(req.body._id);
          if (favorited) {
            return res.send("Campsite already in favorites");
          }
          favorite.campsites.push(campsiteId);
          return favorite.save();
        })
        .then((savedFavorite) => {
          return res.json(savedFavorite);
        })
        .catch(next);
    }
  )
  .put(cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported`);
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Favorite.findByIdAndDelete({ user: req.user._id })
        .then((favorite) => {
          if (favorite) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(response);
          } else {
            res.setHeader("Content-Type", "text/plain");
            res.end("You do not have any favorites.");
          }
        })
        .catch(next);
    }
  );

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .post(cors.corsWithOptions, (req, res) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        const campsiteId = req.body._id;
        const favorited = !!favorite.campsites.id(req.body._id);
        if (favorited) {
          return res.send("Campsite already in favorites");
        }
        favorite.campsites.push(campsiteId);
        return favorite.save();
      })
      .then((savedFavorite) => {
        return res.json(savedFavorite);
      })
      .catch(next);
  })
  .get(cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported`);
  })
  .put(cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported`);
  })
  .delete(cors.corsWithOptions, (req, res) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          favorite.campsites.filter(campsiteId != req.params.campsiteId);
          return favorite.save();
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.end("No Favorite to delete");
        }
      })
      .catch(next);
  });

module.exports = favoriteRouter;
