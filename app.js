require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOATLASS)
  .then(result=>console.log("Connected successfully to database"))
  .catch(error=>console.log(error))

const postsSchema = new mongoose.Schema({
  title: String,
  post: String,
  date: String
});

const commentsSchema = new mongoose.Schema({
  commentID: String,
  comment: String,
  date: String,
  emailadress: String,
  profilepic: String,
  fullname: String
});

const quotesSchema = new mongoose.Schema({
  title: String,
  date: String
});

const Compose = mongoose.model("Compose", postsSchema);
const Comment = mongoose.model("Comment", commentsSchema);
const Quote = mongoose.model("Quote", quotesSchema);


const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){
  Compose.find().then(function(result){
    res.render("home", {
      posts: result
      });
  });
});


app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/quotes", function(req, res){
  var myquotes = [];
  Quote.find().then(function(result){
    result.forEach(function(element){
      myquotes.push(element);
    });

    res.render("quotes", {quotes: myquotes});
  });
 
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  var today = new Date();
  var options = {
      weekday: "long",
      day: "numeric",
      month: "long"
  }
  var day = today.toLocaleDateString("en-US", options);



  const compose = new Compose({
    title: post.title,
    post: post.content,
    date: day
  });

  compose.save();
  res.redirect("/");

});

app.get("/composequote", function(req, res){
  res.render("composequote");
});


app.post("/quote", function(req, res){
  var myquote = req.body.quoteBody;
  var today = new Date();
  var options = {
      weekday: "long",
      day: "numeric",
      month: "long"
  }
  var day = today.toLocaleDateString("en-US", options);

  const quote = new Quote({
    title: myquote,
    date: day
  });
  
  quote.save();
  res.redirect("/quotes");

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  var allComments = [];

  Comment.find().then(function(result){
    result.forEach(function(element){
      allComments.push(element);
    });
  });

  Compose.find().then(function(result){
    result.forEach(function(element){
      const storedTitle = _.lowerCase(element.title);

      if (storedTitle === requestedTitle) {
        res.render("post", {
          id: element._id,
          title: element.title,
          post: element.post,
          date: element.date,
          allthecomments: allComments
        });
      }

    });
  });
});

app.post("/comment", function(req, res){
  var mycomment = req.body.commentBody;
  var user_email = req.body.em;
  var user_pp = req.body.em2;
  var user_name = req.body.em3;
  var today = new Date();
  var options = {
      weekday: "long",
      day: "numeric",
      month: "long"
  }
  var day = today.toLocaleDateString("en-US", options);
  var currentTitle = req.body.input_title;
  var currentID = req.body.input_id;

  const comment = new Comment({
    commentID: currentID,
    comment: mycomment,
    date: day,
    emailadress: user_email,
    profilepic: user_pp,
    fullname:  user_name 
  });

  comment.save();
  res.redirect("/posts/:"+currentTitle);

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
