const express = require("express");
const router = express.Router();
const multer = require("multer");

const postController = require("../controllers/postController");

// Use memoryStorage to hold uploads in RAM buffer
const upload = multer({ storage: multer.memoryStorage() });

router.get("/accounts/search", postController.searchAccounts);

router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.post("/", upload.single("image"), postController.createPost);
router.put("/:id", upload.single("image"), postController.updatePost);
router.delete("/:id", postController.deletePost);

module.exports = router;