const express = require("express");
const router = express.Router({mergeParams: true});
const middleware = require("../middleware");
const Campground = require("../models/campgrounds");
const Comment = require("../models/comments");

// COMMENT NEW
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
       if (err) {
           console.log(err);
       } else {
          res.render("comments/new", {campground: campground});
       }
    });
 });
 
 // COMMENTS CREATE
 router.post("/campgrounds/:id/comments", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
       if (err) {
           req.flash("error", "Something went wrong.");
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           Comment.create(req.body.comment, (err, comment) => {
               if (err) {
                   console.log(err);
               } else {
                   // add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                 
                   comment.save();
                  
                   campground.comments.push(comment);
                   campground.save();
                   req.flash("success", "Successfully added comment!");
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
    }); 
 });
 
 // COMMENT EDIT ROUTE
 router.get("/campgrounds/:id/comments/:comment_id/edit", (req, res) => {
     Comment.findById(req.params.comment_id, middleware.checkCommentOwnership, (err, foundComment) => {
         if (err) {
             res.redirect("back");
         } else {
             res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
         }
     });
 });
 
 // COMMENT UPDATE ROUTE
 router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res)=> {
     Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=> {
         if (err) {
             res.redirect("back");
         } else {
             res.redirect("/campgrounds/" + req.params.id);
         }
     });
 });
 
 // COMMENT DESTROY
 router.delete("/campgrounds/:id/comments/:comment_id", (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err)=> {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "You deleted the comment.");
            res.redirect("/campgrounds/" + req.params.id);
        }
        
    });
 });
 


 
 module.exports = router;