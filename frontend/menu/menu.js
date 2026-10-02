document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("../menu/menu.html");
        if (!response.ok) throw new Error("Could not load menu component.");

        const menuHTML = await response.text();

        document.body.insertAdjacentHTML("afterbegin", menuHTML);
        document.body.classList.add("has-sidebar");

        const currentPath = window.location.pathname.split("/").pop();
        const navHome = document.getElementById("nav-home");
        const navPosts = document.getElementById("nav-posts");
        const navAccounts = document.getElementById("nav-accounts");

        if (currentPath === "post.html") {
            if (navPosts) navPosts.classList.add("active");
        } else if (currentPath === "account.html") {
            if (navAccounts) navAccounts.classList.add("active");
        } else {
            if (navHome) navHome.classList.add("active");
        }
    } catch (error) {
        console.error("Error loading navigation menu:", error);
    }
});