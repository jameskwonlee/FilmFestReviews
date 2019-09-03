const express = require("express"),
      bodyParser = require("body-parser"),
      app = express(),
      mongoose = require("mongoose"),
      Campground = require("./models/campgrounds"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      flash = require("connect-flash"),
      methodOverride = require("method-override"),
      Comment = require("./models/comments"),
      User = require("./models/user"),
      seedDB = require("./seeds");
   
// requiring routes   
const commentRoutes = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgrounds"),
      indexRoutes = require("./routes/index");
      
// mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});
// mongoose.connect("mongodb+srv://jameskwonlee:<PASSWD>@framersentcluster-8bie2.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true});
                    


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));

app.use(flash());

app.use(require("express-session")({
   secret:"James is cool",
   resave: false,
   saveUninitialized: false
}));

// seedDB();   // seed the database   

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT || 8080, process.env.IP, function(){

  console.log("server is listening...");

});