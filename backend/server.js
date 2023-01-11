const express = require("express");
require("dotenv").config();
const passport = require("passport");
const session = require("express-session");
require("./auth.js");
// App initialization
const app = express();

app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());

// middleware
function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

// Routes

app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Login With Google</a>');
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  })
);

app.get("/auth/failure", (req, res) => {
  res.send("Something went wrong..");
});

app.get("/protected", isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName}`);
});

app.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});
// Port
const PORT = process.env.PORT || 5001;

// Listener
app.listen(5000, () => {
  console.log(
    `Server is connected in ${process.env.MODE} mode on port ${PORT}`
  );
});
