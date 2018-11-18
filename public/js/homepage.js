document.addEventListener("DOMContentLoaded", function() {
    const postsUrl = '/api/posts'; // OK
    const commentsUrl = '/api/comments'; // /api/posts/:postId/comments/
    const commentUrl = '/api/comment'; // /api/posts/:postId/comments/:commentId

    const body = document.getElementById('body');
    const feed = document.getElementById('feed');
    const createPost = document.getElementById('createPost');
    const postTextCreate = document.getElementById('postTextCreate');
    const postAttachCreate = document.getElementById('postAttachCreate');
    const postImageCreate = document.getElementById('postImageCreate');
    const postPublishCreate = document.getElementById('postPublishCreate');

    const postTextEdit = document.getElementById('postTextEdit');
    const postAttachEdit = document.getElementById('postAttachEdit');
    const postImageEdit = document.getElementById('postImageEdit');
    const postPublishEdit = document.getElementById('postPublishEdit');

    const commentText = document.getElementById('commentText');
    const commentPublish = document.getElementById('commentPublish');

    const commentTextEdit = document.getElementById('commentTextEdit');
    const commentPublishEdit = document.getElementById('commentPublishEdit');

    const logout = document.getElementById('logout-box');

    let actualPosts = [];

    init();

    function init() {
        if (localStorage.getItem('token')) {
            body.classList.remove('hide');

            const apiToken = localStorage.getItem('token');
            const headers = new Headers();
            headers.append('Authorization', apiToken);

            fetch(postsUrl, {method: 'GET', headers: headers})
                .then(response => {
                    if (response.status === 403) window.location = '/login';
                    return response;
                })
                .then(response => response.json())
                .then(response => {
                    actualPosts = response;
                    renderPosts(actualPosts);
                    renderComments(actualPosts);
                    initListeners();
                })
                .catch(e => console.log(e));
        } else {
            window.location = '/login'
        }

    }


    function renderPosts(posts) {
        feed.innerText = '';

        posts.forEach(post => {
            feed.innerHTML += (post.editable)
                ? `<li class="rv b agz">
              <img class="bos vb yb aff" src="${post.author.avatar}">
              <div class="rw">
                <div class="bpb">
                  <small class="acx axc">${moment(post.publicationDate).fromNow()}</small>
                  <h6>${post.author.name}</h6>
                </div>
    
                <p>${post.text}
                </p>
    
                <div class="boy" data-grid="images"><img style="display: inline-block; width: 346px; height: 335px; margin-bottom: 10px; margin-right: 0px; vertical-align: bottom;" data-width="640" data-height="640" data-action="zoom" src="${post.picture}"></div>
                <a href="#postModalEdit" class="boa" data-toggle="modal" for="edit" data-id="${post._id}">
                    <button class="cg nz ok" data-id="${post._id}" for="edit" title="Редактировать пост">Редактировать пост</button>
                </a>
                <a href="#postModalComment" class="boa" data-toggle="modal" for="comment" data-id="${post._id}">
                    <button class="cg nz ok" data-id="${post._id}" for="comment" title="Оставить комментарий">Оставить комментарий</button>
                </a>
                <button type="button" class="close" aria-hidden="true" title="Удалить"><span class="h bbg"></span></button>
                <hr>
                <ul class="bow afa commentBlock" id="comment-${post._id}">
                </ul>
              </div>
            </li>`
                : `<li class="rv b agz">
              <img class="bos vb yb aff" src="${post.author.avatar}">
              <div class="rw">
                <div class="bpb">
                  <small class="acx axc">${moment(post.publicationDate).fromNow()}</small>
                  <h6>${post.author.name}</h6>
                </div>
    
                <p>${post.text}
                </p>
    
                <div class="boy" data-grid="images"><img style="display: inline-block; width: 346px; height: 335px; margin-bottom: 10px; margin-right: 0px; vertical-align: bottom;" data-width="640" data-height="640" data-action="zoom" src="${post.picture}"></div>
                <a href="#postModalComment" class="boa" data-toggle="modal" for="comment" data-id="${post._id}">
                    <button class="cg nz ok" data-id="${post._id}" for="comment" title="Оставить комментарий">Оставить комментарий</button>
                </a>
                <hr>
                <ul class="bow afa commentBlock" id="comment-${post._id}">
                </ul>
              </div>
            </li>`

        })
    }

    function renderComments(posts) {

        posts.forEach(post => {
            const commentBlock = document.getElementById(`comment-${post._id}`);

            const apiToken = localStorage.getItem('token');
            const headers = new Headers();
            headers.append('Authorization', apiToken);

            fetch(`${commentsUrl}/${post._id}`, {method: 'GET', headers: headers})
                .then(response => {
                    if (response.status === 403) window.location = '/login';
                    return response;
                })
                .then(response => response.json())
                .then(response => {
                    response
                        .forEach(comment => {
                            commentBlock.innerHTML += (comment.editable)
                                ? `<li class="rv afh">
                                        <div class="qa">
                                            <div class="rv">
                                                <img class="bos us aff yb" src="${comment.user.avatar}">
                                                <div class="rw">
                                                    <div class="bpd">
                                                        <div class="bpb">
                                                            <small class="acx axc">${moment(comment.publicationDate).fromNow()}</small>
                                                            <h6>${comment.user.name}</h6>
                                                        </div>
                                                        <div class="bpb">
                                                        ${comment.text}
                                                        </div>
                                                        
                                                        <a href="#postModalCommentEdit" class="boa" data-toggle="modal" for="edit-comment" data-id=${comment._id}>
                                                            <button type="button" class="cg axo axu oh" data-id=${comment._id} for="edit-comment" title="Оставить комментарий">Редактировать комментарий</button>
                                                        </a>
                                                        <button type="button" class="close" aria-hidden="true" data-id=${comment._id} for="delete-comment" title="Удалить">
                                                            <span class="h bbg" data-id=${comment._id} for="delete-comment"></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                      </li>`
                                : `<li class="rv afh">
                                    <div class="qa">
                                        <div class="rv">
                                            <img class="bos us aff yb" src="${comment.user.avatar}">
                                            <div class="rw">
                                                <div class="bpd">
                                                    <div class="bpb">
                                                        <small class="acx axc">${moment(comment.publicationDate).fromNow()}</small>
                                                        <h6>${comment.user.name}</h6>
                                                    </div>
                                                    <div class="bpb">
                                                    ${comment.text}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                  </li>`
                        });
                })

        })

    }

    function initListeners() {
        createPost.addEventListener('click', createPostListener);
        feed.addEventListener('click', editPostListener);
        feed.addEventListener('click', publishCommentListener);
        feed.addEventListener('click', editCommentListener);
        feed.addEventListener('click', deleteCommentListener);
        logout.addEventListener('click', logOutListener);
    }

    function logOutListener(event) {
        event.preventDefault();

        localStorage.clear();
        setTimeout(() => {
            window.location = '/login';
        }, 1000)
    }

    function editPostListener(event) {
        if (!event.target.getAttribute("data-id") || event.target.getAttribute('for') !== 'edit') {
            return;
        }
        const id = event.target.getAttribute("data-id");

        const apiToken = localStorage.getItem('token');
        const headers = new Headers();
        headers.append('Authorization', apiToken);

        fetch(`${postsUrl}/${id}`, {method: 'GET', headers: headers})
            .then(response => {
                if (response.status === 403) window.location = '/login';
                return response;
            })
            .then(res => res.json())
            .then(post => {
                postTextEdit.value = post.text;
                postImageEdit.setAttribute('src', `${post.picture}`);

                postAttachEdit.addEventListener('change', (event) => {
                    if (event.target.files && event.target.files[0]) {
                        const reader = new FileReader();
                        reader.readAsDataURL(event.target.files[0]);

                        reader.onload = (event) => {
                            postImageEdit.setAttribute('src', `${event.target.result}`);
                        };
                    }
                });

                const publishHandler = () => {
                    let formData = new FormData();
                    formData.append('text', postTextEdit.value);

                    if (postAttachEdit.files[0]) {
                        formData.append('picture', postAttachEdit.files[0], `${post.picture}`);
                    } else {
                        formData.append('picture', postImageEdit.getAttribute('src'));
                    }

                    const apiToken = localStorage.getItem('token');
                    const headers = new Headers();
                    headers.append('Authorization', apiToken);


                    fetch(postsUrl, {method: 'PATCH', body: formData, headers: headers})
                        .then(response => {
                            if (response.status === 403) window.location = '/login';
                            return response;
                        })
                        .then(() => {
                            postPublishEdit.removeEventListener('click', publishHandler);
                            init();
                        });
                };

                postPublishEdit.addEventListener('click', publishHandler);
            })
    }

    function editCommentListener(event) {
        if (!event.target.getAttribute("data-id") || event.target.getAttribute('for') !== 'edit-comment') {
            return;
        }

        const commentId = event.target.getAttribute("data-id");

        const apiToken = localStorage.getItem('token');
        const headers = new Headers();
        headers.append('Authorization', apiToken);

        fetch(`${commentUrl}/${commentId}`, {method: 'GET', headers: headers})
            .then(response => {
                if (response.status === 403) window.location = '/login';
                return response;
            })
            .then(res => res.json())
            .then(comment => {
                commentTextEdit.value = comment.text;

                const editCommentHandler = () => {
                    let formData = new FormData();
                    formData.append('text', commentTextEdit.value);
                    formData.append('_id', comment._id);

                    fetch(commentsUrl, {method: 'PATCH', body: formData, headers: headers})
                        .then(response => {
                            if (response.status === 403) window.location = '/login';
                            return response;
                        })
                        .then(() => {
                            commentPublishEdit.removeEventListener('click', editCommentHandler);
                            init();
                        });
                };

                commentPublishEdit.addEventListener('click', editCommentHandler);
            });
    }

    function deleteCommentListener(event) {
        if (!event.target.getAttribute("data-id") || event.target.getAttribute('for') !== 'delete-comment') {
            return;
        }

        const id = event.target.getAttribute("data-id");

        const apiToken = localStorage.getItem('token');
        const headers = new Headers();
        headers.append('Authorization', apiToken);

        fetch(`${commentUrl}/${id}`, {method: 'DELETE', headers: headers})
            .then(response => {
                if (response.status === 403) window.location = '/login';
                return response;
            })
            .then(() => init())
    }

    function createPostListener() {
        postImageCreate.setAttribute('src', 'https://via.placeholder.com/346x335.png');

        const createHandler = () => {
            let formData = new FormData();
            formData.append('text', postTextCreate.value);


            if (postAttachCreate.files[0]) {
                formData.append('picture', postAttachCreate.files[0], 'postPicture');
            } else {
                formData.append('picture', postImageCreate.getAttribute('src'));
            }

            const apiToken = localStorage.getItem('token');
            const headers = new Headers();
            headers.append('Authorization', apiToken);

            fetch(postsUrl, {method: 'POST', body: formData, headers: headers})
                .then(response => {
                    if (response.status === 403) window.location = '/login';
                    return response;
                })
                .then(() => {
                    postPublishCreate.removeEventListener('click', createHandler);
                    postTextCreate.value = '';
                    postAttachCreate.value = '';
                });
        };
        postPublishCreate.addEventListener('click', createHandler);

        postAttachCreate.addEventListener('change', (event) => {
            if (event.target.files && event.target.files[0]) {
                const reader = new FileReader();
                reader.readAsDataURL(event.target.files[0]);

                reader.onload = (event) => {
                    postImageCreate.setAttribute('src', `${event.target.result}`);
                };
            }
        });
    }

    function publishCommentListener(event) {
        if (!event.target.getAttribute("data-id") || event.target.getAttribute('for') !== 'comment') {
            return;
        }

        const postId = event.target.getAttribute("data-id");

        const createHandler = () => {
            let formData = new FormData();
            formData.append('text', commentText.value);
            formData.append('postId', postId);

            const apiToken = localStorage.getItem('token');
            const headers = new Headers();
            headers.append('Authorization', apiToken);

            fetch(commentsUrl, {method: 'POST', body: formData, headers: headers})
                .then(response => {
                    if (response.status === 403) window.location = '/login';
                    return response;
                })
                .then(() => {
                    commentPublish.removeEventListener('click', createHandler);
                    commentText.value = '';
                    init();
                });
        };

        commentPublish.addEventListener('click', createHandler);

    }
});