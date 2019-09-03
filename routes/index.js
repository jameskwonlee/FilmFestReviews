const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const passport = require("passport");
const User = require("../models/user");

// Root route
 router.get("/", (req, res) => res.render("landing"));

 
 // AUTH Routes
 //show register form
 router.get("/register", (req, res) => {
     res.render("register");
 });
 
 //handle signup logic
 router.post("/register", (req, res) => {
     User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
         if (err) {
             req.flash("error", err.message);
             return res.redirect("/register");
         }
         passport.authenticate("local")(req, res, () => {
             req.flash("success", "Welcome to YelpCamp " + user.username);
             res.redirect("/campgrounds");
         });
     });
 });
 
 // Show login form
 router.get("/login", (req, res) => {
     res.render("login");
 });
 
 // Login logic
 router.post("/login", passport.authenticate("local", {
     successRedirect: "/campgrounds",
     failureRedirect: "/login"
    }), (req, res) => {
         res.send("login logic here");
 });
 
 // logout route
 router.get("/logout", (req, res) => {
     req.logout();
     req.flash("success", "logged you out!");
     res.redirect("/campgrounds");
 });
 

 
 module.exports = router;