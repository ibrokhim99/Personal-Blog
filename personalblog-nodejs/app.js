/**
 * Setup and initialization.
 */
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/**
 * MongoDB and mongoose setup, including schema and models
 * for Post
 */
mongoose.connect(process.env.MONGODB_SRV_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    _id: String,
    title: String,
    content: String,
  })
);

/**
 * GET Method for main route.
 *
 * Sends back the home.ejs with context to render the home page.
 */
app.get("/", (req, res) => {
  Post.find({}, (err, foundPosts) => {
    console.log(foundPosts);
    if (err) console.log(err);
    res.render("home", {
      startingContent: homeStartingContent,
      posts: foundPosts,
    });
  });
});

/**
 * POST method to render a specific post page.
 *
 * @param {String} postId the id for the post
 *
 * If postId exists in posts, post page is rendered, else
 * redirected back to home.
 */
app.get("/posts/:postId", (req, res) => {
  Post.findOne({ _id: req.params.postId }, (err, post) => {
    if (err || !post) res.redirect("/");
    else res.render("post", { post: post });
  });
});

/**
 * GET Method for /about route.
 *
 * Renders the about page
 */
app.get("/about", (req, res) => {
  res.render("about", { startingContent: aboutContent });
});

/**
 * GET Method for /contact route.
 *
 * Renders the contact page
 */
app.get("/contact", (req, res) => {
  res.render("contact", { startingContent: contactContent });
});

/**
 * GET Method for /compose route.
 *
 * Renders the page to compose a new post.
 */
app.get("/compose", (req, res) => {
  res.render("compose");
});

/**
 * POST Method for /compose route.
 *
 * Saves the new post to the DB.
 * Redirects back to home, once post is saved.
 */
app.post("/compose", (req, res) => {
  const post = new Post({
    _id: _.kebabCase(_.lowerCase(req.body.postTitle)),
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  post.save((err) => {
    res.redirect("/");
  });
});

/**
 * Start up server to listen on port 3000.
 */
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000");
});
