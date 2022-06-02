const exp = require("express");

const userApp = exp.Router();

userApp.use(exp.json());

const expressAsyncHandler = require("express-async-handler");

const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");

// get all users
userApp.get(
  "/getusers",
  expressAsyncHandler(async (req, res) => {
    let userCollection = req.app.get("userCollection");

    let users = await userCollection.find().toArray();

    if (!users.length) {
      res, send({ message: "no users found" });
    } else {
      res.send({ message: "users found", payload: users });
    }
  })
);

// user signin request handler
userApp.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    let userCollection = req.app.get("userCollection");

    let userDataObj = req.body;

    // username, password, email

    let alreadyUser = await userCollection.findOne({
      username: userDataObj.username,
    });

    if (alreadyUser === null) {
      hashedPassword = await bcryptjs.hash(userDataObj.password, 5);

      userDataObj.password = hashedPassword;

      await userCollection.insertOne(userDataObj);

      res.send({ message: "user-created" });
    } else {
      res.send({ message: "user-exists" });
    }
  })
);

// user login request handler
userApp.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    let userCollection = req.app.get("userCollection");

    let userCredObj = req.body;

    let alreadyUser = await userCollection.findOne({
      username: userCredObj.username,
    });

    if (alreadyUser === null) {
      res.send({ message: "no-user" });
    } else {
      let isPassword = await bcryptjs.compare(
        userCredObj.password,
        alreadyUser.password
      );

      if (!isPassword) {
        res.send({ message: "incorrect-password" });
      } else {
        let token = jwt.sign(
          { username: alreadyUser.username },
          process.env.SECRET_KEY
        );

        res.send({
          message: "user-logged",
          payload: token,
          userObj: { user: alreadyUser.username },
        });
      }
    }
  })
);

// jwt authentication for already logged in user
userApp.post(
  "/auth",
  expressAsyncHandler(async (req, res) => {
    let jwtToken = req.body;

    let decode = jwt.verify(jwtToken.token, process.env.SECRET_KEY);

    if (decode) {
      res.send({ status: "True", user: decode.username });
    } else {
      res.send({ status: "False" });
    }
  })
);

module.exports = userApp;
