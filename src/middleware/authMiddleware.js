const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
