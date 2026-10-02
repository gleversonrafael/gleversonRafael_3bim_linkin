document.addEventListener("DOMContentLoaded", () => {
    const API_POSTS_URL = "http://localhost:3001/posts";
    const DEFAULT_AVATAR_URL = "http://localhost:3001/images/default-avatar.jpg";
    const postsFeed = document.getElementById("postsFeed");

    init();

    async function init() {
        await fetchAndRenderPosts();
    }

    async function fetchAndRenderPosts() {
        try {
            const response = await fetch(API_POSTS_URL);
            if (!response.ok) throw new Error("Failed to load posts");

            const posts = await response.json();
            renderPosts(posts);
        } catch (error) {
            console.error(error);
            if (postsFeed) {
                postsFeed.innerHTML = `<p class="feed-message">Failed to load feed. Please try again later.</p>`;
            }
        }
    }

    function renderPosts(posts) {
        if (!postsFeed) return;

        if (!posts || posts.length === 0) {
            postsFeed.innerHTML = `<p class="feed-message">No posts available right now.</p>`;
            return;
        }

        let feedHTML = "";

        for (const post of posts) {
            const username = escapeHTML(post.username || "anonymous");
            const caption = escapeHTML(post.title_post || "");
            const imageUrl = `http://localhost:3001/images/${post.img_id}.png`;

            feedHTML += `
                <article class="post-card">
                    <header class="post-header">
                        <img 
                            src="${DEFAULT_AVATAR_URL}" 
                            alt="${username}'s avatar" 
                            class="post-avatar"
                        />
                        <span class="post-username">${username}</span>
                    </header>

                    <div class="post-image-container">
                        <img 
                            src="${imageUrl}" 
                            alt="Post image" 
                            class="post-image"
                            onerror="this.onerror=null; this.src='${DEFAULT_AVATAR_URL}';"
                        />
                    </div>

                    <div class="post-caption-container">
                        <span class="post-caption-username">${username}</span>
                        <span class="post-caption-text">${caption}</span>
                    </div>
                </article>
            `;
        }

        postsFeed.innerHTML = feedHTML;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g,
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
});