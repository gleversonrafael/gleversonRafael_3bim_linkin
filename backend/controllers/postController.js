const path = require("path");
const fs = require("fs");
const { query } = require("../database");

const IMAGES_DIR = path.join(__dirname, "../../images");

const saveUploadedImage = (buffer, imgId) => {
    if (!fs.existsSync(IMAGES_DIR)) {
        fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }
    const targetPath = path.join(IMAGES_DIR, `${imgId}.png`);
    fs.writeFileSync(targetPath, buffer);
};

const postController = {
    searchAccounts: async (req, res) => {
        try {
            const queryParam = (req.query.q || "").trim();
            if (!queryParam) {
                return res.status(200).json([]);
            }

            const sql = `
                SELECT unique_username, account_name, account_email
                FROM ACCOUNT
                WHERE LOWER(unique_username) LIKE LOWER($1)
                   OR LOWER(account_name) LIKE LOWER($1)
                LIMIT 10;
            `;
            const result = await query(sql, [`%${queryParam}%`]);
            const formatted = result.rows.map(acc => ({
                username: acc.unique_username,
                name: acc.account_name,
                email: acc.account_email
            }));

            res.status(200).json(formatted);
        } catch (error) {
            console.error("Error searching accounts:", error);
            res.status(500).json({ message: "Database query error" });
        }
    },

    getAllPosts: async (req, res) => {
        try {
            const sql = `
                SELECT
                    post_id AS id_post,
                    caption AS title_post,
                    creator_id AS username,
                    img_id
                FROM POST
                ORDER BY post_id ASC;
            `;
            const result = await query(sql);
            res.status(200).json(result.rows);
        } catch (error) {
            console.error("Error fetching posts:", error);
            res.status(500).json({ message: "Database query error" });
        }
    },

    getPostById: async (req, res) => {
        try {
            const post_id = parseInt(req.params.id, 10);
            const sql = `
                SELECT
                    post_id AS id_post,
                    caption AS title_post,
                    creator_id AS username,
                    img_id
                FROM POST
                WHERE post_id = $1;
            `;
            const result = await query(sql, [post_id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Post not found" });
            }

            res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error("Error fetching post by ID:", error);
            res.status(500).json({ message: "Database query error" });
        }
    },

    
    createPost: async (req, res) => {
        console.log("req.body:", req.body);
        console.log("req.file:", req.file);

        try {
            // Handle field naming variations sent from the frontend
            const post_id = req.body.post_id || req.body.postid;
            const username = req.body.username || req.body.creator_id || req.body["creator username"];
            const title_post = req.body.title_post || req.body.caption;

            // Verify that post_id, username, title_post, and an uploaded image file are ALL provided
            if (!post_id || !username || !title_post || !req.file) {
                return res.status(400).json({ 
                    message: "Post ID, username, caption, and an image file are required." 
                });
            }

            const insertSql = `
                INSERT INTO POST (post_id, creator_id, img_id, caption)
                VALUES ($1, $2, DEFAULT, $3)
                RETURNING post_id AS id_post, creator_id AS username, caption AS title_post, img_id;
            `;

            const result = await query(insertSql, [parseInt(post_id, 10), username, title_post]);
            const createdPost = result.rows[0];

            // Save the image buffer using the returned img_id
            saveUploadedImage(req.file.buffer, createdPost.img_id);

            res.status(201).json({ message: "Post created successfully", post: createdPost });

        } catch (error) {
            if (error.code === '23505') { // PostgreSQL duplicate primary key / unique constraint error
                return res.status(400).json({ message: "A post with this Post ID already exists." });
            }
            console.error("Error creating post:", error);
            res.status(500).json({ message: "Failed to create post in database" });
        }
    },

    updatePost: async (req, res) => {
        try {
            const post_id = parseInt(req.params.id, 10);
            const { username, title_post } = req.body;

            const accountCheck = await query(
                "SELECT unique_username FROM ACCOUNT WHERE unique_username = $1",
                [username]
            );

            if (accountCheck.rows.length === 0) {
                return res.status(400).json({ message: "Creator username does not exist in ACCOUNT table." });
            }

            const updateSql = `
                UPDATE POST
                SET creator_id = $1, caption = $2
                WHERE post_id = $3
                RETURNING post_id AS id_post, creator_id AS username, caption AS title_post, img_id;
            `;
            const result = await query(updateSql, [username, title_post, post_id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Post not found" });
            }

            const targetImgId = result.rows[0].img_id;

            if (req.file && req.file.buffer) {
                saveUploadedImage(req.file.buffer, targetImgId);
            }

            res.status(200).json({ message: "Post updated successfully", post: result.rows[0] });

        } catch (error) {
            console.error("Error updating post:", error);
            res.status(500).json({ message: "Failed to update post in database" });
        }
    },

    deletePost: async (req, res) => {
        try {
            const post_id = parseInt(req.params.id, 10);

            const deleteSql = "DELETE FROM POST WHERE post_id = $1 RETURNING post_id, img_id;";
            const result = await query(deleteSql, [post_id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Post not found" });
            }

            const deletedImgId = result.rows[0].img_id;
            const imagePath = path.join(IMAGES_DIR, `${deletedImgId}.png`);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            res.status(200).json({ message: `Post #${post_id} deleted successfully` });

        } catch (error) {
            console.error("Error deleting post:", error);
            res.status(500).json({ message: "Failed to delete post from database" });
        }
    }
};

module.exports = postController;