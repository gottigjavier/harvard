document.addEventListener('DOMContentLoaded', function(){

    document.querySelector('#all-posts').addEventListener('click', (event) => {
        event.preventDefault(); 
        posts_box('all-posts');
    }); 
    if (document.getElementById('user-link').innerHTML != 'Visitor'){
        document.querySelector('#all-authors').addEventListener('click', () => profiles_box('all-profiles'));
        document.querySelector('#following').addEventListener('click', () => posts_box('follow-posts'));
    }

    //closeForm();
    posts_box('all-posts');

// Events listener to follow, like and profile display -----------------
document.addEventListener('click', event => {
    const elem = event.target;
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
        //console.log(event);
        profiles_box(usern); // debe ir a funcion one_profile que llame a post_box
        //window.alert('author-event');
    }
    if (elem.className.includes('edit-event')){
        const $postObject = event.path[4].children[1];
        const body = $postObject.innerHTML;
        const post_id = $postObject.id;
        $postObject.style.color = 'green';
        edit_post(body, post_id);
    }

    if (elem.className.includes('delete-event')){
        const post_id = event.path[4].children[1].id,
            post_body = event.path[4];
            post_body.style.animationPlayState = 'running';                    
            post_body.addEventListener('animationend', function () {
                post_body.remove();
                });
                delete_post(post_id, post_body);
    }
    
});
//-----------------------------------------------------------------------    
//document.getElementById('prev-page').addEventListener('click', prev_page());
//document.getElementById('next-page').addEventListener('click', next_page());

});

var section;
var gpostsbox;
var gpostPageNum;
var postPages;
var gprofilePageNum;
var profilesPages;

function posts_box(postsbox, postPageNum=1){
    fetch(`http://localhost:8000/posts_box/${postsbox}/${postPageNum}`)
    .then(response => response.json())
    .then(postsObj => {
        posts = postsObj['post-list'];
        postPages = postsObj['pages'];
        section = postsObj['section'];
        gpostsbox = postsbox;
        gpostPageNum = postPageNum;
        const   $cleanProfiles = document.getElementById('profiles-container'),
                $cleanPosts = document.getElementById('posts-container'),
                $individualContainer = document.createElement('div'),
                $containerListPost = document.createDocumentFragment();
        // get current user
        const currentUser = document.querySelector('#box-user').value;
        const currentUserId = document.querySelector('#box-user-id').value;

        // if no posts, backend send post.id = 0
        if (posts.id != 0){
            // Clean page for old content for all posts display            
            if (section == 'all-posts' || section == 'follow-posts'){
                $cleanProfiles.innerHTML = '';
                $cleanPosts.innerHTML = '';
                $cleanProfiles.style.display = 'none';
                $cleanPosts.style.display = 'block';
            } else {
                $cleanProfiles.style.display = 'block';
                $cleanPosts.innerHTML = '';
            }
        
            posts.forEach(element => {
                let likesNum = element.likes.length;
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
                $individualContainer.setAttribute('class', 'container my-container');
                $author.setAttribute('class', 'author-event profile-name pt-2');
                $author.setAttribute('title', 'Click to profile');
                $rowAuthor.setAttribute('class', 'row');
                $colAuthorL.setAttribute('class', 'col-md-1 m-0 pr-0 py-1');
                $colAuthorC.setAttribute('class', 'col-md-1 mx-0 pl-0 py-1');
                $colAuthorR.setAttribute('class', 'col-md-2 offset-md-8 text-right');
                $authorIcon.setAttribute('class', 'profile-icon');
                $text.setAttribute('id', element.id);
                $text.setAttribute('class', 'row py-2 pl-4 pr-1 mx-2 font-italic my-3 text-post');
                $text.setAttribute('wrap', 'hard');
                $likesAndCreated.setAttribute('class', 'row')
                $created.setAttribute('class', 'col-sm-11 text-right blockquote-footer');
                $likes.setAttribute('class', 'col-sm-1 text-primary');
                //$iconLike.setAttribute('id', `like-${element.id}`);
                
                if (currentUser && element.likes.toString().includes(currentUserId)){  
                    $spanLike.setAttribute('class', 'span-icon span-red px-2');
                    $iconLike.setAttribute('class', 'like-event fas fa-heart');
                    $iconLike.setAttribute('title', 'Click to stop like'); 
                    var likeFlag = true;
                    } else {
                    $spanLike.setAttribute('class', 'span-icon span-black px-2');
                    $iconLike.setAttribute('class', 'like-event far fa-heart');
                    $iconLike.setAttribute('title', 'Like');
                    var likeFlag = false;
                    }

                if (currentUser != 'Visitor'){
                    if (element.author.followers.toString().includes(currentUserId)){
                        $spanFollow.setAttribute('class', 'span-orange icon-m');
                        $iconFollow.setAttribute('class', 'follow-event fas fa-arrow-alt-circle-right');
                        $spanFollow.setAttribute('title', 'Following');
                    } else {
                        $spanFollow.setAttribute('class', 'span-black icon-m');
                        $iconFollow.setAttribute('class', 'follow-event far fa-arrow-alt-circle-right');
                        $spanFollow.setAttribute('title', 'Not Follwoing');
                    }
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

                if (element.author.username == currentUser){
                    const $iconEdit = document.createElement('i'),
                    $spanEdit = document.createElement('span');
                    $iconEdit.setAttribute('class', 'edit-event fas fa-edit');
                    $iconEdit.setAttribute('title', 'Edit post');
                    $spanEdit.setAttribute('class', 'icon-m px-2 mx-2 align-content-end');
                    $spanEdit.appendChild($iconEdit);
                    $colAuthorR.appendChild($spanEdit);

                    const $iconDelete = document.createElement('i'),
                    $spanDelete = document.createElement('span');
                    $iconDelete.setAttribute('class', 'delete-event fas fa-times');
                    $iconDelete.setAttribute('title', 'Delete post');
                    $spanDelete.setAttribute('class', 'icon-m span-black align-content-end');
                    $spanDelete.appendChild($iconDelete);
                    $colAuthorR.appendChild($spanDelete);
                }
                
                $text.innerHTML = element.text;
                $created.innerHTML = element.created;
                $likes.innerHTML = likesNum;
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

                
                $iconLike.onclick= function(){
                    if (currentUser != 'Visitor'){
                        if (likeFlag){
                            $spanLike.setAttribute('class', 'span-icon span-black px-2');
                            $iconLike.setAttribute('class', 'like-event far fa-heart');
                            $iconLike.setAttribute('title', 'Click to like');
                            likesNum --;
                            $likes.innerHTML = likesNum;
                            $likes.appendChild($spanLike);
                            like_post(element.id);
                            likeFlag = false;
                            return likeFlag;
                        }
                        if (!likeFlag){
                            $spanLike.setAttribute('class', 'span-icon span-red px-2');
                            $iconLike.setAttribute('class', 'like-event fas fa-heart');
                            $iconLike.setAttribute('title', 'Click to stop like'); 
                            likesNum ++;
                            $likes.innerHTML = likesNum;
                            $likes.appendChild($spanLike);
                            like_post(element.id);
                            likeFlag = true;
                            return likeFlag;
                        } 
                    } 
                };                        
            });
            $containerListPost.appendChild($individualContainer);
            document.querySelector('#posts-container').appendChild($containerListPost); 
        } else {
            window.alert('Following has no posts to display.');
        }    

        document.getElementById('current-page').innerHTML = `Page ${postPageNum} of ${postPages}`;
        
        const $prevPage = document.getElementById('prev-page');
        const $nextPage = document.getElementById('next-page');
                
        if (postPageNum > 1) {
            $prevPage.style.display = 'block';
            } else {
            $prevPage.style.display = 'none';
        }
        if (postPages - postPageNum > 0) {
            $nextPage.style.display = 'block';
        } else {
            $nextPage.style.display = 'none';
        }
/*        
        $prevPage.addEventListener('click', () => {
            postPageNum--;
            posts_box(postsb, postPageNum);
            return false;
        });
        

        $nextPage.addEventListener('click', () => {
            postPageNum++;
            posts_box(postsb, postPageNum);
            return false;
        });
*/

        //console.log(postsObj);
    })    
}


function profiles_box(profilebox, profilePageNum=1){
    fetch(`http://localhost:8000/profile_box/${profilebox}/${profilePageNum}`)
    .then(response => response.json())
    .then(profilesObj => {
        profiles = profilesObj['profiles_list'];
        profilesPages = profilesObj['pages'];
        section = profilesObj['section'];
        gprofilePageNum = profilePageNum;
        // get current user
        const currentUser = document.querySelector('#box-user').value;
        const currentUserId = document.querySelector('#box-user-id').value;
        
        
        const   $cleanProfiles = document.getElementById('profiles-container'),
                $cleanPosts = document.getElementById('posts-container'),
                $containerAll = document.createDocumentFragment();
        // Clean page for old content
        $cleanProfiles.innerHTML = '';
        $cleanPosts.innerHTML = '';
        $cleanProfiles.style.display = 'block';
        $cleanPosts.style.display = 'none';
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
                    $iconUser.setAttribute('width', '70');
                    $iconUser.setAttribute('height', '70'); 
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
            $username.setAttribute('class', 'author-event profile-name pb-3');
            $username.setAttribute('title', 'Click to profile');
            $profiles.setAttribute('class', 'profile-icon m-3 py-2 px-5 shadow-lg bg-light rounded');
            $userRow.setAttribute('class', 'user-row');
            $followers.setAttribute('class', 'span-black');
            $following.setAttribute('class', 'span-black');

            if (element.followers.toString().includes(currentUserId)){
                $iconFollowers.setAttribute('class', 'follow-icon span-orange fas fa-arrow-alt-circle-right');
                $followers.setAttribute('title', 'Followers (including you)');
                var followFlag = true;
            } else {
                $iconFollowers.setAttribute('class', 'follow-icon span-orange far fa-arrow-alt-circle-right');
                $followers.setAttribute('title', 'Followers');
                var followFlag = false;
            }

            if (element.following.toString().includes(currentUserId)){
                $iconFollowing.setAttribute('class', 'span-green fas fa-arrow-alt-circle-right');
                $following.setAttribute('title', 'Following (including you)');
            } else {
                $iconFollowing.setAttribute('class', 'span-green far fa-arrow-alt-circle-right');
                $following.setAttribute('title', 'Following');
            }

            $spanFollowers.setAttribute('class', 'icon-m px-1');            
            $spanFollowing.setAttribute('class', 'icon-m px-1');
            $iconPosts.setAttribute('class', 'fas fa-feather-alt px-1');
            $spanPosts.setAttribute('class', 'span-blue icon-m px-1');
            $postsNumber.setAttribute('class', 'span-black text-center');
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

            $iconFollowers.onclick= function(){
                if (currentUser != 'Visitor'){
                    if (currentUserId != element.id){ 
                        if (followFlag){
                            $spanFollowers.setAttribute('class', 'follow-icon span-orange icon-m px-1');
                            $iconFollowers.setAttribute('class', 'follow-event far fa-arrow-alt-circle-right');
                            $spanFollowers.setAttribute('title', 'Click to return to follow');
                            element.followers.length --;
                            $followers.innerHTML = element.followers.length;
                            $spanFollowers.appendChild($iconFollowers);
                            $followers.appendChild($spanFollowers);
                            follow_author(element.id);
                            console.log(element.id);
                            followFlag = false;
                            if (profiles.length == 1){
                                //window.alert('Stop follow');
                                posts_box(element.username, postPageNum);};
                            return followFlag;
                        }
                        if (!followFlag){
                            $spanFollowers.setAttribute('class', 'follow-icon span-orange icon-m px-1');
                            $iconFollowers.setAttribute('class', 'follow-event fas fa-arrow-alt-circle-right');
                            $spanFollowers.setAttribute('title', 'Click to return to unfollow'); 
                            element.followers.length ++;
                            $followers.innerHTML = element.followers.length;
                            $spanFollowers.appendChild($iconFollowers);
                            $followers.appendChild($spanFollowers);
                            follow_author(element.id);
                            followFlag = true;
                            if (profiles.length == 1){
                                //window.alert('Start follow');
                                posts_box(element.username, postPageNum);};
                            return followFlag;
                        }
                    } else {
                        window.alert("You can't follow yourself. ")
                    } 
                } 
            };            
            

            if (element.myposts.length > 0 && profiles.length == 1) {
                $cleanPosts.style.display = 'block';
                posts_box(element.username, gpostPageNum);
            }
            
        });
        document.querySelector('#profiles-container').appendChild($containerAll);    
        
        document.getElementById('current-page').innerHTML = `Page ${profilePageNum} of ${profilesPages}`;
        
        const $prevPage = document.getElementById('prev-page');
        const $nextPage = document.getElementById('next-page');
                
        if (profilePageNum > 1) {
            $prevPage.style.display = 'block';
            } else {
            $prevPage.style.display = 'none';
        }
        if (profilesPages - profilePageNum > 0) {
            $nextPage.style.display = 'block';
        } else {
            $nextPage.style.display = 'none';
        }

    })    
}


function next_page(event) {
    console.log('gpostsbox', gpostsbox);
    console.log('section', section);
    console.log('gprofilePageNum', gprofilePageNum);
    console.log('profilesPages', profilesPages);
    console.log('gpostPageNum', gpostPageNum);
    console.log('postPages', postPages);
    
}

// new and edit post -------------------------------------------

var postid = 0;

function new_post() {
    clearform();
    document.getElementById("myForm").style.display = "block";
    document.getElementById("post-title").innerHTML = `New Post by ${document.getElementById('user-link').innerHTML}`;
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
        posts_box('all-posts', 1);
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
    document.getElementById(`${postid}`).innerHTML = upBody;
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
    })
    .catch(() => {
        closeForm();
    });
}

function closeForm() {
    if (postid != 0) {
        document.getElementById(`${postid}`).style.color = 'black';
    }
    postid = 0;
    document.getElementById("myForm").style.display = "none";
    clearform();
}

function clearform() {
    document.querySelector("#post").value = "";
}

function delete_post(post_id){
    // get current user
    var currentUserId = document.querySelector('#box-user-id').value;
    if (currentUserId != 'Visitor') {
        fetch('http://localhost:8000/delete_post', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'crossorigin': 'anonymous',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify({
                post_id
            })
        })
        
    } 
}



function like_post(post_id){
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
            post_id
        })
    })
    }
}

function follow_author(author_id){
    // get current user
    var currentUserId = document.querySelector('#box-user-id').value;
    if (currentUserId != 'Visitor') {
    fetch('http://localhost:8000/follow_author', {
        method: 'PUT',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'crossorigin': 'anonymous',
            'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
            author_id
        })
    })
    }
}

