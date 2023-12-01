require("dotenv").config();
const express = require("express");
const cors = require("cors");
const createError = require("http-errors");
const app = express();
const mainRouter = require("./src/routes/index.js");
const morgan = require("morgan");
const helmet = require("helmet");
const port = process.env.PORT;
const host = process.env.HOST;

app.use(express.json());
app.use(cors({ origin: `${host}` }));
app.options('*', cors());
app.use(helmet({
      crossOriginResourcePolicy: false,
    }));
app.use(morgan("dev"));
app.use('/api/v1', mainRouter);
app.use(express.static("./src/temp/image"))

app.all("*", (req, res, next) => {
  next(new createError.NotFound());
});

app.use((err, req, res, next) => {
  const messageError = err.message || "internal server error";
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    message: messageError,
  });
});

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
