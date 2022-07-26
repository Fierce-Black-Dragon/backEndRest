require("dotenv").config();
//git push -u origin main
const express = require("express");

const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const morgan = require("morgan");

const app = express();
const createError = require("http-errors");
const fileUpload = require("express-fileupload");

const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
//routes
const home = require("./routes/home");
const user = require("./routes/user");
const product = require("./routes/product");
const review = require("./routes/review");
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);
//cors middleware
// Cross Origin Resource Sharing
app.use(cors(corsOptions));

//morgan
app.use(morgan("dev"));

//regular middleware
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//router middleware
app.use("/api", home);
app.use("/api", user);
app.use("/api/product", product);
app.use("/api/review", review);

//404(route not found) handler and pass to error handler
app.use(async (req, res, next) => {
  next(createError.NotFound());
});
//Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
// export app
module.exports = app;
