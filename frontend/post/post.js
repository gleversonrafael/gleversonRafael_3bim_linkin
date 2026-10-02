document.addEventListener("DOMContentLoaded", () => {
    const inputId = document.getElementById("inputId_post");
    const inputImgId = document.getElementById("inputImgId");
    const inputSearchUsername = document.getElementById("inputSearch_username");
    const selectUniqueUsername = document.getElementById("selectUnique_username");
    const dropdownUsernameList = document.getElementById("dropdown_username_list");
    const inputCaption = document.getElementById("inputContent_post");
    const imgPost = document.getElementById("imgPost");
    const inputImagem = document.getElementById("inputImagem");
    const dropzoneArea = document.getElementById("dropzoneArea");

    const btProcure = document.getElementById("btProcure");
    const btInserir = document.getElementById("btInserir");
    const btAlterar = document.getElementById("btAlterar");
    const btExcluir = document.getElementById("btExcluir");
    const btSalvar = document.getElementById("btSalvar");
    const btCancelar = document.getElementById("btCancelar");

    const divAviso = document.getElementById("divAviso");
    const txtAviso = document.getElementById("txtAviso");
    const outputSaida = document.getElementById("outputSaida");

    const API_POSTS_URL = "http://localhost:3001/posts";
    const API_ACCOUNTS_SEARCH_URL = "http://localhost:3001/posts/accounts/search";
    const DEFAULT_IMAGE_URL = "http://localhost:3001/images/silhueta.png";

    let currentOperation = null;

    init();

    async function init() {
        await loadPostsList();
        resetToInitialState();
        bindEvents();
    }

    function bindEvents() {
        btProcure.addEventListener("click", handleSearch);
        btInserir.addEventListener("click", handlePrepareInsert);
        btAlterar.addEventListener("click", handlePrepareUpdate);
        btExcluir.addEventListener("click", handleDelete);
        btSalvar.addEventListener("click", handleSave);
        btCancelar.addEventListener("click", resetToInitialState);

        inputSearchUsername.addEventListener("input", handleUsernameSearchInput);
        inputSearchUsername.addEventListener("focus", () => {
            if (inputSearchUsername.value.trim().length > 0) {
                dropdownUsernameList.style.display = "block";
            }
        });

        document.addEventListener("click", (e) => {
            if (!e.target.closest(".searchable-select-wrapper")) {
                dropdownUsernameList.style.display = "none";
            }
        });

        imgPost.addEventListener("click", () => {
            if (!inputImagem.disabled) inputImagem.click();
        });
        inputImagem.addEventListener("change", handleImageSelection);

        if (dropzoneArea) {
            dropzoneArea.addEventListener("dragover", (e) => e.preventDefault());
            dropzoneArea.addEventListener("drop", handleDropImage);
        }
    }

    function setBannerMessage(message, type = "info") {
        txtAviso.textContent = message;
        divAviso.className = `info-banner ${type}`;
    }

    function setInputsDisabled(disabled) {
        inputSearchUsername.disabled = disabled;
        inputCaption.disabled = disabled;
        inputImagem.disabled = disabled;
        if (inputImgId) inputImgId.disabled = true; // img_id is read-only / auto-generated
    }

    function resetToInitialState() {
        currentOperation = null;

        inputId.value = "";
        inputId.disabled = false;

        if (inputImgId) inputImgId.value = "";

        inputSearchUsername.value = "";
        selectUniqueUsername.value = "";
        dropdownUsernameList.innerHTML = "";
        dropdownUsernameList.style.display = "none";

        inputCaption.value = "";
        inputImagem.value = "";
        imgPost.src = DEFAULT_IMAGE_URL;

        setInputsDisabled(true);

        btProcure.style.display = "inline-flex";
        btInserir.style.display = "none";
        btAlterar.style.display = "none";
        btExcluir.style.display = "none";
        btSalvar.style.display = "none";
        btCancelar.style.display = "none";

        setBannerMessage("Enter Post ID and click Search");
    }

    async function handleUsernameSearchInput(e) {
        const query = e.target.value.trim();
        selectUniqueUsername.value = "";

        if (query.length === 0) {
            dropdownUsernameList.innerHTML = "";
            dropdownUsernameList.style.display = "none";
            return;
        }

        try {
            const response = await fetch(`${API_ACCOUNTS_SEARCH_URL}?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error("Search failed");

            const accounts = await response.json();
            renderUsernameDropdown(accounts);
        } catch (error) {
            console.error(error);
        }
    }

    function renderUsernameDropdown(accounts) {
        dropdownUsernameList.innerHTML = "";

        if (accounts.length === 0) {
            const emptyItem = document.createElement("div");
            emptyItem.className = "dropdown-item-empty";
            emptyItem.textContent = "No accounts found";
            dropdownUsernameList.appendChild(emptyItem);
        } else {
            accounts.forEach(acc => {
                const item = document.createElement("div");
                item.className = "dropdown-item";
                item.textContent = `${acc.username} (${acc.name})`;
                item.addEventListener("click", () => {
                    inputSearchUsername.value = acc.username;
                    selectUniqueUsername.value = acc.username;
                    dropdownUsernameList.style.display = "none";
                });
                dropdownUsernameList.appendChild(item);
            });
        }

        dropdownUsernameList.style.display = "block";
    }

    async function loadPostsList() {
        try {
            const response = await fetch(API_POSTS_URL);
            if (!response.ok) throw new Error("Failed to fetch post list");
            const posts = await response.json();

            renderTable(posts);
        } catch (error) {
            console.error(error);
            outputSaida.innerHTML = `<tr><td colspan="5" class="text-center">Failed to load posts.</td></tr>`;
        }
    }

    function renderTable(posts) {
        if (!posts || posts.length === 0) {
            outputSaida.innerHTML = `<tr><td colspan="5" class="text-center">No posts registered yet.</td></tr>`;
            return;
        }

        outputSaida.innerHTML = posts.map(post => `
            <tr>
                <td>${post.id_post}</td>
                <td class="font-medium">${escapeHTML(post.title_post || '')}</td>
                <td>${escapeHTML(post.username || '')}</td>
                <td>IMG_${String(post.img_id).padStart(3, '0')}</td>
                <td class="text-center">
                    <button type="button" class="btn-icon" onclick="selectPostForEdit(${post.id_post})">✏️</button>
                    <button type="button" class="btn-icon btn-icon-danger" onclick="quickDeletePost(${post.id_post})">🗑️</button>
                </td>
            </tr>
        `).join("");
    }

    async function handleSearch() {
        const id = inputId.value.trim();
        if (!id) {
            setBannerMessage("Please enter a Post ID first.", "error");
            return;
        }

        if(isNaN(id) || id < 0)
        {
            setBannerMessage("Please insert a valid post id.", "error");
            return;
        }

        try {
            const response = await fetch(`${API_POSTS_URL}/${id}`);
            if (response.status === 404) {
                setInputsDisabled(false);
                inputId.disabled = true;

                imgPost.src = DEFAULT_IMAGE_URL;

                btProcure.style.display = "none";
                btInserir.style.display = "inline-flex";
                btAlterar.style.display = "none";
                btExcluir.style.display = "none";
                btCancelar.style.display = "inline-flex";

                setBannerMessage("Post ID not found. Click Insert to create a new post.");
                return;
            }

            if (!response.ok) throw new Error("Server error");

            const post = await response.json();

            if (inputImgId) inputImgId.value = post.img_id;

            inputSearchUsername.value = post.username || "";
            selectUniqueUsername.value = post.username || "";
            inputCaption.value = post.title_post || "";

            imgPost.onerror = () => {
                imgPost.src = DEFAULT_IMAGE_URL;
                imgPost.onerror = null;
            };
            imgPost.src = `http://localhost:3001/images/${post.img_id}.png?t=${Date.now()}`;

            inputId.disabled = true;
            setInputsDisabled(true);

            btProcure.style.display = "none";
            btInserir.style.display = "none";
            btAlterar.style.display = "inline-flex";
            btExcluir.style.display = "inline-flex";
            btCancelar.style.display = "inline-flex";

            setBannerMessage("Found post in database. You can Alter or Delete.");

        } catch (error) {
            console.error(error);
            setBannerMessage("Error searching for post.", "error");
        }
    }

    function handlePrepareInsert() {
        currentOperation = "insert";
        btInserir.style.display = "none";
        btSalvar.style.display = "inline-flex";
        setBannerMessage("Select username, fill caption, choose an image, and click Save.");
    }

    function handlePrepareUpdate() {
        currentOperation = "update";
        setInputsDisabled(false);

        btAlterar.style.display = "none";
        btExcluir.style.display = "none";
        btSalvar.style.display = "inline-flex";

        setBannerMessage("Modify fields and click Save.");
    }

    async function handleSave() {
        const id_post = inputId.value.trim();
        const username = selectUniqueUsername.value.trim() || inputSearchUsername.value.trim();
        const title_post = inputCaption.value.trim();

        // Ensure all 4 required fields are present on the frontend before sending
        if (!id_post || !username || !title_post) {
            setBannerMessage("Please specify a Post ID, Username, and Caption.", "error");
            return;
        }

        if (currentOperation === "insert" && !inputImagem.files[0]) {
            setBannerMessage("An image file is required when creating a post.", "error");
            return;
        }

        const formData = new FormData();
        formData.append("post_id", id_post);
        formData.append("username", username);
        formData.append("title_post", title_post);

        if (inputImagem.files[0]) {
            formData.append("image", inputImagem.files[0]);
        }

        try {
            let response;
            if (currentOperation === "insert") {
                response = await fetch(API_POSTS_URL, {
                    method: "POST",
                    body: formData
                });
            } else if (currentOperation === "update") {
                response = await fetch(`${API_POSTS_URL}/${id_post}`, {
                    method: "PUT",
                    body: formData
                });
            }

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Operation failed");
            }

            await loadPostsList();
            resetToInitialState();
            setBannerMessage("Post saved successfully!");
        } catch (error) {
            console.error(error);
            setBannerMessage(`Failed to save post: ${error.message}`, "error");
        }
    }

    async function handleDelete() {
        const id_post = inputId.value.trim();
        if (!confirm(`Are you sure you want to delete post #${id_post}?`)) return;

        try {
            const response = await fetch(`${API_POSTS_URL}/${id_post}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Delete failed");

            await loadPostsList();
            resetToInitialState();
            setBannerMessage(`Post #${id_post} deleted successfully!`);

        } catch (error) {
            console.error(error);
            setBannerMessage("Failed to delete post.", "error");
        }
    }

    function handleImageSelection(event) {
        const file = event.target.files[0];
        if (file) {
            imgPost.src = URL.createObjectURL(file);
        }
    }

    function handleDropImage(event) {
        event.preventDefault();
        if (inputImagem.disabled) return;

        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            inputImagem.files = event.dataTransfer.files;
            handleImageSelection({ target: inputImagem });
        }
    }

    window.selectPostForEdit = (id) => {
        inputId.value = id;
        handleSearch();
    };

    window.quickDeletePost = (id) => {
        inputId.value = id;
        handleDelete();
    };

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g,
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
});