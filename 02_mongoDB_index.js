import express from "express";
import path from "path";
import mongoose from "mongoose";

mongoose
  .connect("mongodb://localhost:27017", {
    dbName: "Backend",
  })
  .then(() => console.log("Database connection established"))
  .catch((err) => console.log(err));

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const message = mongoose.model("Message", messageSchema);

const app = express();

app.set("view engine", "ejs");

app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));

const users = [];

app.get("/", (req, res) => {
  // res.send("Hello, world!");
  // res.sendStatus(404);
  // res.sendFile(path.join(path.resolve(), "./index.html"));

  res.render("index", { name: "Chandrabhan" });
});

app.get("/success", (req, res) => {
  res.render("success");
});

app.post("/", (req, res) => {
  console.log(req.body);
  users.push(req.body);
  console.log(req.body.name);
  console.log(users);

  // res.render("success"); // success file should be in views folder
  res.redirect("/success");
});

// app.post("/contact", (req, res) => {
//   users.push(req.body);
//   res.redirect("/success");
// });

app.post("/contact", async (req, res) => {
  // const contactData = { name: req.body.name, email: req.body.email };
  // await message.create(contactData);
  // await message.create({ name: req.body.name, email: req.body.email });

  const { name, email } = req.body;
  // await message.create({ name: name, email: email });
  await message.create({ name, email });

  res.redirect("/success");
});

app.get("/users", (req, res) => {
  res.json({ users });
});

// app.get("/add", (req, res) => {
//   message
//     .create({ name: "Chandrabhan Singh", email: "jaydeepsinghvi@gmail.com" })
//     .then(() => {
//       res.send("Nice");
//     });
// });

app.get("/add", async (req, res) => {
  await message.create({
    name: "Chandrabhan Singh",
    email: "jaydeepsinghvi2@gmail.com",
  });
  res.send("Nice");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.listen(5000, (err, res) => {
  console.log("Server listening on port number 5000.");
});
