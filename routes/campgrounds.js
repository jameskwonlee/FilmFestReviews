const express = require("express");
const router = express.Router({mergeParams: true});
const middleware = require("../middleware");
const Campground = require("../models/campgrounds");

// index route - show all campgrounds
router.get("/", (req, res) => {
  // get all campgrounds from DB
  Campground.find({}, (err, allcampgrounds) => {
     if (err) {
         console.log(err);
     } else {
         res.render("campgrounds/index", {campgrounds:allcampgrounds, currentUser: req.user});
     }
  });
    
});

// Create - add new campgrounds to data base
router.post("/", middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
  
    // campgrounds.push(newCampground);
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });

});

// New - Show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) =>{
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/new", {campground: campground});
        }
    });
    
});

// SHOW - 
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) =>{
        if (err) {
            console.log(err);
        } else {
             res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
     Campground.findById(req.params.id, (foundCampground) => {
        res.render("campgrounds/edit", {campground: foundCampground});
     });
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
   Campground.findByIdAndRemove(req.params.id, (err) => {
       if (err) {
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
   });
});

 

module.exports = router;