const express = require("express"); // import express
const router = express.Router(); // create express router
const blogController = require("../controllers/blogController"); // import blogController

/**
* App Routes
*/
router.get("/", blogController.homepage); // homepage
router.get("/phone/:id", blogController.explorePhone); // explore phone
router.get("/categories", blogController.exploreCategories); // categories
router.get("/categories/:id", blogController.exploreCategoriesById); // categories by id 
router.post('/search', blogController.searchPhone); // search phone
router.get("/explore-latest", blogController.exploreLatest);	// explore latest
router.get("/explore-about", blogController.exploreAbout);	// explore latest
router.get("/contact", blogController.exploreContact);	// explore latest
router.get("/explore-random", blogController.exploreRandom);	// explore random
router.get("/submit-blog", blogController.submitBlog);	// submit blog
router.post("/submit-blog", blogController.submitBlogOnPost);	// submit blog on post

module.exports = router; // export router
