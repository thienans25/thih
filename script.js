/* =========================
   PHOTO BLOG
========================= */


/* DOM */

const postList = document.getElementById("postList");
const emptyMessage = document.getElementById("emptyMessage");

const addPostBtn = document.getElementById("addPostBtn");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");

const postForm = document.getElementById("postForm");

const postTitle = document.getElementById("postTitle");
const postContent = document.getElementById("postContent");
const postImage = document.getElementById("postImage");

const imagePreview = document.getElementById("imagePreview");
const previewImg = document.getElementById("previewImg");

const searchInput = document.getElementById("searchInput");

const themeBtn = document.getElementById("themeBtn");

const year = document.getElementById("year");


/* YEAR */

year.textContent = new Date().getFullYear();


/* DEFAULT POSTS */

const defaultPosts = [
    {
        id: 1,
        title: "Một ngày thật bình yên",
        content:
            "Có những ngày chẳng cần làm gì đặc biệt, chỉ cần nhìn lại vài khoảnh khắc đẹp là đủ.",
        image:
            "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=85",
        date: "05/10/2026",
        likes: 0
    },

    {
        id: 2,
        title: "Một chút nắng",
        content:
            "Mình thích những buổi chiều có nắng nhẹ và một chút gió.",
        image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
        date: "03/10/2026",
        likes: 0
    },

    {
        id: 3,
        title: "Đi đâu đó",
        content:
            "Lưu lại một bức ảnh để sau này nhìn lại và nhớ rằng mình từng ở đây.",
        image:
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=85",
        date: "01/10/2026",
        likes: 0
    }
];


/* LOAD POSTS */

let posts = JSON.parse(
    localStorage.getItem("photoBlogPosts")
);

if (!posts) {
    posts = defaultPosts;
    savePosts();
}


/* SAVE */

function savePosts() {

    localStorage.setItem(
        "photoBlogPosts",
        JSON.stringify(posts)
    );
}


/* RENDER */

function renderPosts(search = "") {

    postList.innerHTML = "";

    const keyword = search.trim().toLowerCase();

    const filteredPosts = posts.filter(post => {

        return (
            post.title.toLowerCase().includes(keyword) ||
            post.content.toLowerCase().includes(keyword)
        );

    });


    if (filteredPosts.length === 0) {

        emptyMessage.classList.remove("hidden");

        return;
    }


    emptyMessage.classList.add("hidden");


    filteredPosts.forEach(post => {

        const card = document.createElement("article");

        card.className = "post-card";

        card.innerHTML = `

            <img
                class="post-image"
                src="${post.image}"
                alt="${escapeHTML(post.title)}"
            >

            <div class="post-info">

                <div class="post-date">
                    ${post.date}
                </div>

                <h3 class="post-title">
                    ${escapeHTML(post.title)}
                </h3>

                <p class="post-content">
                    ${escapeHTML(post.content)}
                </p>

                <div class="post-bottom">

                    <button
                        class="like-btn"
                        onclick="likePost(${post.id})"
                    >
                        ♡ ${post.likes || 0}
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deletePost(${post.id})"
                    >
                        Xóa
                    </button>

                </div>

            </div>
        `;

        postList.appendChild(card);

    });

}


/* ESCAPE HTML */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* LIKE */

function likePost(id) {

    const post = posts.find(
        item => item.id === id
    );

    if (!post) return;

    post.likes = (post.likes || 0) + 1;

    savePosts();

    renderPosts(searchInput.value);
}


/* DELETE */

function deletePost(id) {

    const confirmDelete = confirm(
        "Bạn có chắc muốn xóa bài viết này không?"
    );

    if (!confirmDelete) return;

    posts = posts.filter(
        post => post.id !== id
    );

    savePosts();

    renderPosts(searchInput.value);
}


/* OPEN MODAL */

addPostBtn.addEventListener("click", () => {

    modal.classList.remove("hidden");

});


/* CLOSE MODAL */

closeModal.addEventListener("click", () => {

    modal.classList.add("hidden");

});


/* CLOSE WHEN CLICK OUTSIDE */

document.querySelector(".modal-overlay")
    .addEventListener("click", () => {

        modal.classList.add("hidden");

    });


/* IMAGE PREVIEW */

postImage.addEventListener("change", () => {

    const file = postImage.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {

        previewImg.src = event.target.result;

        imagePreview.classList.remove("hidden");

    };

    reader.readAsDataURL(file);

});


/* CREATE POST */

postForm.addEventListener("submit", event => {

    event.preventDefault();


    const file = postImage.files[0];

    if (!file) {

        alert("Bạn chưa chọn ảnh!");

        return;
    }


    const reader = new FileReader();


    reader.onload = function(event) {

        const newPost = {

            id: Date.now(),

            title: postTitle.value.trim(),

            content: postContent.value.trim(),

            image: event.target.result,

            date: formatDate(new Date()),

            likes: 0

        };


        posts.unshift(newPost);

        savePosts();

        renderPosts();


        /* RESET */

        postForm.reset();

        imagePreview.classList.add("hidden");

        previewImg.src = "";


        modal.classList.add("hidden");


        window.scrollTo({

            top: document.getElementById("posts")
                .offsetTop - 80,

            behavior: "smooth"

        });

    };


    reader.readAsDataURL(file);

});


/* DATE */

function formatDate(date) {

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}


/* SEARCH */

searchInput.addEventListener("input", () => {

    renderPosts(searchInput.value);

});


/* DARK MODE */

const savedTheme =
    localStorage.getItem("photoBlogTheme");


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";

}


themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");


    themeBtn.textContent =
        isDark ? "☀️" : "🌙";


    localStorage.setItem(
        "photoBlogTheme",
        isDark ? "dark" : "light"
    );

});


/* INITIAL */

renderPosts();
