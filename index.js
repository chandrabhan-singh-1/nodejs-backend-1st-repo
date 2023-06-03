import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose
  .connect("mongodb://localhost:27017", {
    dbName: "Backend",
  })
  .then(() => console.log("Database Connected!"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const app = express();

// Using Middlwares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setting Up View Engine
app.set("view engine", "ejs");

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    const decoded = jwt.verify(
      token,
      "PassThisSameSecretWhenYouVerify/CompareIDs"
    );
    console.log(decoded);

    req.user = await User.findById(decoded._id);

    next();
  } else {
    res.redirect("/login");
  }
};

// app.get("/", (req, res) => {
//   const { token } = req.cookies;

//   if (token) {
//     res.render("logout");
//   } else {
//     res.render("login");
//   }
// });

app.get("/", isAuthenticated, (req, res) => {
  // console.log(req.user);
  res.render("logout", { name: req.user.name });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// app.get("/logout", (req, res) => {
//   res.render("logout");
// });

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   const user = User.findOne({ email, password });

//   if (user && req.body.password === user.password) {
//     const token = jwt.sign({ id: user._id }, "Ok", {
//       httpOnly: true,
//       expires: new Date(Date.now() + 15 * 60 * 1000),
//     });

//     res.cookie("token", token, {
//       httpOnly: true,
//       expires: new Date(Date.now() + 10 * 60 * 1000),
//     });
//     res.redirect("/logout");
//   } else {
//     res.redirect("/register");
//   }
// });

// app.post("/login", async (req, res) => {
//   console.log(req.body);

//   const { name, email } = req.body;

//   let user = await User.findOne({ email });

//   if (!user) {
//     return res.redirect("/register");
//   }

//   user = await User.create({
//     name,
//     email,
//   });

//   const token = jwt.sign(
//     { _id: user._id },
//     "PassThisSameSecretWhenYouVerify/CompareIDs"
//   );
//   console.log(token);

//   res.cookie("token", token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + 10 * 60 * 1000),
//   });
//   res.redirect("/");
// });

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) return res.redirect("/register");

  // const isMatch = user.password === password;
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.render("login", { message: "Invalid Email or Password." });
  } else {
    const token = jwt.sign(
      { _id: user._id },
      "PassThisSameSecretWhenYouVerify/CompareIDs"
    );
    // console.log(token);

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 10 * 60 * 1000),
    });
    res.redirect("/");
  }
});

app.post("/register", async (req, res) => {
  // console.log(req.body);

  const { name, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return res.render("login", {
      message: "You already have an account, Kindly Login from here.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    { _id: user._id },
    "PassThisSameSecretWhenYouVerify/CompareIDs"
  );
  // console.log(token);

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 60 * 1000),
  });
  res.redirect("/");
});

app.post("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

// app.post("/login", )

app.listen(5000, (err, res) => {
  console.log("Server listening on port number 5000.");
});
