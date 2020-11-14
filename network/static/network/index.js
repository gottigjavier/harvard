document.addEventListener('DOMContentLoaded', function(){

    document.querySelector('#all-posts').addEventListener('click', () => posts_box('all-posts'));
    if (document.getElementById('user-link').innerHTML != 'Visitor'){
        document.querySelector('#all-authors').addEventListener('click', () => profiles_box('all-profiles'));
        document.querySelector('#following').addEventListener('click', () => posts_box('follow-posts'));
    }

    //closeForm();
    posts_box('all-posts');

// Events listener to follow, like and profile display -----------------
document.addEventListener('click', event => {
    const elem = event.target;

    if (elem.className.includes('like-event')){
        const post_id = event.path[4].children[1].id;
        like_post(post_id);
        
    }
    
    if (elem.className.includes('follow-event')){
        //posts_box('follow-posts');debe ir a funcion seguir o no
        window.alert('follow-event');
        console.log(event.path[4].children[0].innerText);
        //console.log(elem);
        //like();
    }
    if (elem.className.includes('author-event')){
        const usern = elem.innerHTML;
        //var allPostsCurrentUserName = event.path[8].children[0].children[1].children[0].children[0].children[0].value;
        //var allPostsCurrentUserID = event.path[8].children[0].children[1].children[0].children[0].children[1].value;
        //console.log(allPostsCurrentUserName);
        //console.log(allPostsCurrentUserID);
        //var profilesCurrentUserName = event.path[7].children[0].children[1].children[0].children[0].children[0].value;
        //var profilesCurrentUserID = event.path[7].children[0].children[1].children[0].children[0].children[1].value;
        //console.log(profilesCurrentUserName);
        //console.log(profilesCurrentUserID);
        console.log(event);
        profiles_box(usern); // debe ir a funcion one_profile que llame a post_box
        //window.alert('author-event');
    }
    if (elem.className.includes('edit-event')){
        const body = event.path[4].children[1].innerHTML;
        const post_id = event.path[4].children[1].id;
        edit_post(body, post_id);
    }
    
});
//-----------------------------------------------------------------------    

});

var all_authors = '';

function posts_box(postsbox){
    fetch(`http://localhost:8000/posts_box/${postsbox}`)
    .then(response => response.json())
    .then(posts => {
        const   $clean = document.getElementById('network-container'),
                $individualContainer = document.createElement('div'),
                $containerListPost = document.createDocumentFragment();

        // get current user
        var currentUser = document.querySelector('#box-user').value;
        var currentUserId = document.querySelector('#box-user-id').value;

        
        // Clean page for old content for all posts display
        all_authors = posts[0].section; 
        console.log(all_authors);
        if (all_authors == 'all-posts' || all_authors == 'follow-posts'){
            $clean.innerHTML = '';
        }

        posts.forEach(element => {
            const $br = document.createElement('br'),
                $spanLike = document.createElement('span'),
                $iconLike = document.createElement('i'),
                $spanFollow = document.createElement('span'),
                $iconFollow = document.createElement('i'),
                $listPost = document.createElement('div'),
                $likes = document.createElement('div'),
                $rowAuthor = document.createElement('div'),
                $colAuthorL = document.createElement('div'),
                $colAuthorC = document.createElement('div'),
                $colAuthorR = document.createElement('div'),
                $authorIcon = document.createElement('div'),
                $author = document.createElement('div'),
                $created = document.createElement('div'),
                $likesAndCreated = document.createElement('div'),
                $text = document.createElement('pre');

            $listPost.setAttribute('class', 'post-style m-3 py-2 px-5 shadow-lg bg-light rounded');
            $individualContainer.setAttribute('class', 'container');
            $author.setAttribute('class', 'author-event');
            $author.setAttribute('title', 'Click to profile');
            $rowAuthor.setAttribute('class', 'row');
            $colAuthorL.setAttribute('class', 'col-md-1 m-0 pr-0 py-1');
            $colAuthorC.setAttribute('class', 'col-md-1 mx-0 pl-0 py-1');
            $colAuthorR.setAttribute('class', 'col-md-1 offset-md-9');
            $authorIcon.setAttribute('class', 'profile-icon');
            $text.setAttribute('id', element.id);
            $text.setAttribute('class', 'row p-2 font-italic my-3');
            $text.setAttribute('wrap', 'hard');
            $likesAndCreated.setAttribute('class', 'row')
            $created.setAttribute('class', 'col-sm-11 text-right blockquote-footer');
            $likes.setAttribute('class', 'col-sm-1 text-primary');
            
            if (currentUser && element.likes.toString().includes(currentUserId)){           
                $spanLike.setAttribute('class', 'span-icon span-red px-2');
                $iconLike.setAttribute('class', 'like-event fas fa-heart');
                $iconLike.setAttribute('title', 'Click to stop like');
                } else {
                $spanLike.setAttribute('class', 'span-icon span-black px-2');
                $iconLike.setAttribute('class', 'like-event far fa-heart');
                $iconLike.setAttribute('title', 'Click to like');
            }

            if (element.author.followers.includes(currentUser)){
                $spanFollow.setAttribute('class', 'follow-icon span-orange');
                $iconFollow.setAttribute('class', 'follow-event fas fa-arrow-alt-circle-right');
                $spanFollow.setAttribute('title', 'Click to unfollow');
            } else {
                $spanFollow.setAttribute('class', 'follow-icon span-black');
                $iconFollow.setAttribute('class', 'follow-event far fa-arrow-alt-circle-right');
                $spanFollow.setAttribute('title', 'Click to follow');
            }

            $spanFollow.appendChild($iconFollow);
            $colAuthorL.appendChild($spanFollow);
            $author.innerHTML = element.author.username;
            
            if (element.author.image) {
                const $iconUser = document.createElement('img');
                $iconUser.setAttribute('src', `${element.author.image}`);
                $iconUser.setAttribute('width', '50');
                $iconUser.setAttribute('height', '50');
                $authorIcon.appendChild($iconUser);
                $authorIcon.appendChild($author);
                $colAuthorC.appendChild($authorIcon);
            } else {
                const $iconUser = document.createElement('i');
                $iconUser.setAttribute('class', 'fas fa-user');
                $authorIcon.appendChild($iconUser);
                $authorIcon.appendChild($author);
                $colAuthorC.appendChild($authorIcon);
            }
            //console.log(element.author);
            //console.log(currentUser);

            if (element.author.username == currentUser){
                const $iconEdit = document.createElement('i'),
                $spanEdit = document.createElement('span');
                $iconEdit.setAttribute('class', 'edit-event fas fa-edit');
                $iconEdit.setAttribute('title', 'Edit post');
                $spanEdit.setAttribute('class', 'icon-m span-blue align-content-end');
                $spanEdit.appendChild($iconEdit);
                $colAuthorR.appendChild($spanEdit);
            }
            
            $text.innerHTML = element.text;
            $created.innerHTML = element.created;
            $likes.innerHTML = element.likes.length;
            $spanLike.appendChild($iconLike);
            $likes.appendChild($spanLike);
            $rowAuthor.appendChild($colAuthorL);
            $rowAuthor.appendChild($colAuthorC);
            $rowAuthor.appendChild($colAuthorR);
            
            $listPost.appendChild($rowAuthor);
            $listPost.appendChild($text);
            $likesAndCreated.appendChild($created);
            $likesAndCreated.appendChild($likes);
            $listPost.appendChild($likesAndCreated);
            $listPost.appendChild($br);

            $individualContainer.appendChild($listPost);
            
        });
        $containerListPost.appendChild($individualContainer);
        document.querySelector('#network-container').appendChild($containerListPost);        
    })    
}



function profiles_box(profilebox){
    fetch(`http://localhost:8000/profile_box/${profilebox}`)
    .then(response => response.json())
    .then(profiles => {

        // get current user
        var currentUser = document.querySelector('#box-user').value;
        var currentUserId = document.querySelector('#box-user-id').value;

        const   $clean = document.getElementById('network-container'),
                $containerAll = document.createDocumentFragment();
        // Clean page for old content
        $clean.innerHTML = '';
        profiles.forEach(element => {
            const $profiles = document.createElement('div'),
                $containerProfiles = document.createElement('div'),
                $username = document.createElement('div'),
                $spanForFollowing = document.createElement('span'),
                $following = document.createElement('div'),
                $followers = document.createElement('div'),
                $postsNumber = document.createElement('div'),
                $userRow = document.createElement('div'),
                $postRow = document.createElement('div'),
                $iconFollowing = document.createElement('i'),
                $iconFollowers = document.createElement('i'),
                $iconPosts = document.createElement('i'),
                $spanFollowing = document.createElement('span'),
                $spanFollowers = document.createElement('span'),
                $spanPosts = document.createElement('span'),
                $spanUser = document.createElement('span'),
                $userAndIcon = document.createElement('div');

                if (element.image) {
                    const $iconUser = document.createElement('img');
                    $spanUser.appendChild($iconUser);
                    $iconUser.setAttribute('src', `${element.image}`);
                    $iconUser.setAttribute('width', '100');
                    $iconUser.setAttribute('height', '100'); 
                } else {
                    const $iconUser = document.createElement('i');
                    $spanUser.appendChild($iconUser);
                    $iconUser.setAttribute('class', 'fas fa-user');
                }
                            
            $followers.innerHTML = element.followers.length;
            $spanFollowers.appendChild($iconFollowers);
            $followers.appendChild($spanFollowers);            
            $username.innerHTML = element.username;
            $userAndIcon.appendChild($spanUser);
            $userAndIcon.appendChild($username);
            $spanFollowing.appendChild($iconFollowing);
            $following.appendChild($spanFollowing);
            $spanForFollowing.innerHTML = element.following.length;
            $following.appendChild($spanForFollowing);
            $postsNumber.innerHTML = element.myposts.length;
            $spanPosts.appendChild($iconPosts);
            $postsNumber.appendChild($spanPosts);            
            $username.setAttribute('class', 'author-event profile-icon pb-3');
            $username.setAttribute('title', 'Click to profile');
            $profiles.setAttribute('class', ' m-3 py-2 px-5 shadow-lg bg-light rounded');
            $userRow.setAttribute('class', 'user-row');

            if (element.followers.includes(currentUser)){
                $iconFollowers.setAttribute('class', 'fas fa-arrow-alt-circle-right');
                $followers.setAttribute('title', 'Followers (including you)');
            } else {
                $iconFollowers.setAttribute('class', 'far fa-arrow-alt-circle-right');
                $followers.setAttribute('title', 'Followers');
            }

            if (element.following.includes(currentUser)){
                $iconFollowing.setAttribute('class', 'fas fa-arrow-alt-circle-right');
                $following.setAttribute('title', 'Following (including you)');
            } else {
                $iconFollowing.setAttribute('class', 'far fa-arrow-alt-circle-right');
                $following.setAttribute('title', 'Following');
            }

            $spanFollowers.setAttribute('class', 'span-orange icon-m px-1');            
            $spanFollowing.setAttribute('class', 'span-green icon-m px-1');
            $iconPosts.setAttribute('class', 'fas fa-feather-alt px-1');
            $spanPosts.setAttribute('class', 'span-blue icon-m px-1');
            $postsNumber.setAttribute('class', 'text-center');
            $postsNumber.setAttribute('title', 'Posts');            
            $spanUser.setAttribute('class', 'user-icon span-blue');
            $userAndIcon.setAttribute('class', 'text-center px-3');
            $userRow.appendChild($followers);
            $userRow.appendChild($userAndIcon);
            $userRow.appendChild($following);
            $postRow.appendChild($postsNumber);

            $profiles.appendChild($userRow);
            $profiles.appendChild($postRow);
            $containerProfiles.append($profiles);
            $containerProfiles.setAttribute('class', 'user-style');

            $containerAll.appendChild($containerProfiles);

            if (element.myposts.length > 0 && profiles.length == 1) {
                posts_box(element.username);
            }
            
        });
        document.querySelector('#network-container').appendChild($containerAll);        
    })    
}

// new and edit post -------------------------------------------

var postid = 0;

function new_post() {
    clearform();
    document.getElementById("myForm").style.display = "block";
    document.getElementById("post-title").innerHTML = 'New Post';
    document.getElementById("post").focus();

    document.querySelector("#send").removeEventListener("click", sendNewPost);
    document.querySelector("#send").removeEventListener("click", sendEditPost);

    document.querySelector("#send").addEventListener("click", sendNewPost);
}

function sendNewPost(event) {
    event.preventDefault();
    const body = document.querySelector('#post').value;
    fetch('http://localhost:8000/new_post', {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'crossorigin': 'anonymous'
        },
        body: JSON.stringify({
            body
        })
    })
    .then(response =>  response.json())  
    .then(result => {
        closeForm();
        const resultKey = Object.keys(result)
        if (resultKey == 'error') {
        window.alert(result['error']);
        }
        posts_box('all-posts');
//        location.reload();
    })
    .catch(() => {
        closeForm();
    });   
}

function edit_post(body='', post_id) {
    clearform();
    document.getElementById("myForm").style.display = "block";
    document.getElementById("post-title").innerHTML = 'Edit Post';
    document.getElementById("post").focus();
    document.querySelector('#post').value = body;
    postid = post_id;

    document.querySelector("#send").removeEventListener("click", sendNewPost);
    document.querySelector("#send").removeEventListener("click", sendEditPost);

    document.querySelector("#send").addEventListener("click", sendEditPost);
}

    
function sendEditPost(event) {
    event.preventDefault();
    const upBody = document.querySelector('#post').value;
    fetch('http://localhost:8000/edit_post', {
        method: 'PUT',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'crossorigin': 'anonymous',
            'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
            upBody,
            postid
        })
    })
    .then(response =>  response.json())  
    .then(result => {
        closeForm();
        const resultKey = Object.keys(result)
        if (resultKey == 'error') {
        window.alert(result['error']);
        }
        posts_box('all-posts');
//        location.reload();
    })
    .catch(() => {
        closeForm();
    });
}

function closeForm() {
    postid = 0;
    document.getElementById("myForm").style.display = "none";
    clearform();
}

function clearform() {
    document.querySelector("#post").value = "";
}

// end new and edit form --------------------------------------------

/*document.addEventListener('click', event => {
    const elem = event.target;
    if (elem.className.includes('like-event')){
        const post_id = event.path[4].children[1].id;
        like_post(post_id, currentUserId);
        
    }
    
});*/



function like_post(post_id){
    postid = post_id;
    // get current user
    var currentUserId = document.querySelector('#box-user-id').value;
    if (currentUserId != 'Visitor') {
    fetch('http://localhost:8000/like_post', {
        method: 'PUT',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'crossorigin': 'anonymous',
            'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
            postid
        })
    })
    posts_box('all-posts');
    //return false;
    }
}

function like_yes(post_id){
    postid = post_id;
}

function like_no(){
    postid = post_id;
}