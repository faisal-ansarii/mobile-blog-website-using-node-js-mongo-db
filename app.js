const express = require("express"); // import express
const expressLayouts = require("express-ejs-layouts");	// import express-ejs-layouts
const fileUpload = require("express-fileupload"); // import express-fileupload
const session = require("express-session"); // import express-session
const cookieParser = require("cookie-parser"); // import cookie-parser
const flash = require("connect-flash"); // import connect-flash

const app = express(); // create express app
const port = process.env.PORT || 3000; // set port

require("dotenv").config(); // Loads environment variables from .env file

app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(express.static("public")); // Allows us to use static files
app.use(expressLayouts); // Allows us to use ejs layouts

app.use(cookieParser("PhoneBlogSecure")); // Sets cookie parser
app.use(
	session({
		secret: "PhoneBlogSecretSession",
		saveUninitialized: true,
		resave: true,
	})
);

app.use(flash()); // Allows us to use flash messages
app.use(fileUpload()); 	// Allows us to use file uploads

app.set("layout", "./layouts/main"); // Sets layout to main
app.set("view engine", "ejs"); 	// Sets view engine to ejs

const routes = require("./server/routes/blogRoutes.js"); 	// Imports routes
app.use("/", routes); 										// Sets routes

app.listen(port, () => console.log(`Listening to port ${port}`)); // Starts server