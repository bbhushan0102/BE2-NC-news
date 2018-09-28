const seedDB = require("./seed");
const mongoose = require("mongoose");
const DB_URL = require("../config");
const data = require("./devData");
return mongoose
  .connect(
    DB_URL,
    { useNewUrlParser: true }
  )
  .then(() => {
    return seedDB(data);
  })
  .then(([userDocs, topicDocs, articleDocs, commentDocs]) => {
    console.log("Database seeded");
    console.log("topics:", topicDocs.length);
    console.log("users:", userDocs.length);
    console.log("articles:", articleDocs.length);
    console.log("comments:", commentDocs.length);
    mongoose.disconnect();
  });
