const exp = require("express");

const postApp = exp.Router();

require("dotenv").config();

const expressAsyncHandler = require("express-async-handler");

const { ObjectId } = require("mongodb");

const cloudinary = require("cloudinary").v2;

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "blogger",
      public_id: file.fieldname + "-" + Date.now(),
    };
  },
});

var upload = multer({ storage: cloudinaryStorage });

// get all posts
postApp.get(
  "/getallposts",
  expressAsyncHandler(async (req, res) => {
    let postCollection = req.app.get("postCollection");

    let posts = await postCollection.find().toArray();

    if (!posts.length) {
      res.send({ message: "no-posts" });
    } else {
      res.send({ message: "found-posts", payload: posts });
    }
  })
);

// get my posts
postApp.get(
  "/getmyposts/:user",
  expressAsyncHandler(async (req, res) => {
    let postCollection = req.app.get("postCollection");

    let user = req.params.user;

    let posts = await postCollection.find({ username: user }).toArray();

    if (!posts.length) {
      res.send({ message: "no-posts" });
    } else {
      res.send({ message: "found-posts", payload: posts });
    }
  })
);

// make a post
postApp.post(
  "/createpost",
  upload.single("image"),
  expressAsyncHandler(async (req, res) => {
    let postCollection = req.app.get("postCollection");

    let post = req.body;

    post = JSON.parse(post.userObj);

    let date = new Date();

    post.image = req.file.path;

    let postDate =
      date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();

    post.date = postDate;

    await postCollection.insertOne(post);

    res.send({ message: "post-inserted" });
  })
);

// edit post
postApp.put(
  "/editpost",
  expressAsyncHandler(async (req, res) => {
    let postCollection = req.app.get("postCollection");

    let editPost = req.body;

    let date = new Date();

    let postDate =
      date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();

    await postCollection.updateOne(
      { _id: ObjectId(editPost._id) },
      {
        $set: {
          title: editPost.title,
          context: editPost.context,
          date: postDate,
          updated: "true",
        },
      }
    );

    res.send({ message: "post-updated" });
  })
);

// delete post
postApp.delete(
  "/deletepost/:id",
  expressAsyncHandler(async (req, res) => {
    let postCollection = req.app.get("postCollection");

    let postId = req.params.id;

    await postCollection.deleteOne({ _id: ObjectId(postId) });

    res.send({ message: "post-deleted" });
  })
);

module.exports = postApp;
