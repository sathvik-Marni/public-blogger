const exp = require("express");

const app = exp();

app.use(exp.json());

require("dotenv").config();

const dbUrl = process.env.DATABASE_CONNECTION_URL;

const mClient = require("mongodb").MongoClient;

// connect application to the database
mClient
  .connect(dbUrl)
  .then((client) => {
    const db = client.db("Blogger");

    const userCollection = db.collection("userCollection");

    const postCollection = db.collection("postCollection");

    app.set("userCollection", userCollection);

    app.set("postCollection", postCollection);

    console.log("DB connected successfully");
  })
  .catch((err) => console.log(`Error Occured: ${err.message}`));

const userApp = require("./APIs/userApi");

app.use("/user", userApp);

const postApp = require("./APIs/postApi");

app.use("/post", postApp);

// handling invalid paths
app.use((req, res) => {
  res.send({ message: `Invalid path ${req.url}` });
});

// handling errors
app.use((err, req, res) => {
  res.send({ message: "Error Occured", reason: err.message });
});

const port = process.env.PORT;

app.listen(port, () => console.log(`Server started on port ${port}`));
