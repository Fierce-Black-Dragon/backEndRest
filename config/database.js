const mongoose = require("mongoose");

const connectionWithDB = () => {
  mongoose
    .connect(process.env.DB_URl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to mongoDB");
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = connectionWithDB;
