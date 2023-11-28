const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const protect = (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
      let decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
      req.payload = decoded;
      next();
    } else {
      res.json({
        message: "server need token",
      });
    }
  } catch (error) {
    console.log(error);
    if (error && error.name === "JsonWebTokenError") {
      next(new createError(498, "Invalid Token"));
    } else if (error && error.name === "TokenExpiredError") {
      next(new createError(500, "Session expired"));
    } else {
      next(new createError(499, "Required Token"));
    }
  }
};

module.exports = {
  protect
};
