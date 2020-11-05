document.addEventListener('DOMContentLoaded', function(){

    document.querySelector('#all-posts').addEventListener('click', () => posts_box('all-posts'));
    if (document.getElementById('box-user').innerHTML != 'Visitor'){
        document.querySelector('#all-authors').addEventListener('click', () => profiles_box('all-profiles'));
        document.querySelector('#following').addEventListener('click', () => posts_box('follow-posts'));
    }

    posts_box('all-posts');

// Events listener to follow, like and profile display -----------------
document.addEventListener('click', event => {
    const elem = event.target;
    if (elem.className.includes('like-event')){
        window.alert('like-event');
        console.log(elem);
        //like();
    }
    if (elem.className.includes('follow-event')){
        //posts_box('follow-posts');debe ir a funcion seguir o no
        window.alert('follow-event');
        //console.log(elem);
        //like();
    }
    if (elem.className.includes('author-event')){
        const usern = elem.innerHTML;
        one_profile(usern); // debe ir a funcion one_profile que llame a post_box
        //window.alert('author-event');
    }
    
});

//-----------------------------------------------------------------------



    
});


function posts_box(postsbox){
    fetch(`http://localhost:8000/posts_box/${postsbox}`)
    .then(response => response.json())
    .then(posts => {
        const   $clean = document.getElementById('network-container'),
                $individualContainer = document.createElement('div'),
                $containerListPost = document.createDocumentFragment();
        
        // get current user
        currentUser = document.querySelector('#box-user').value;
        // Clean page for old content for all posts display
        if (posts[0].all_authors){
            $clean.innerHTML = '';
        }

        posts.forEach(element => {
            const $br = document.createElement('br'),
                $spanIcon = document.createElement('span'),
                $iconLike = document.createElement('i'),
                $spanFollow = document.createElement('span'),
                $iconFollow = document.createElement('i'),
                $listPost = document.createElement('div'),
                $likes = document.createElement('div'),
                $rowAuthor = document.createElement('div'),
                $authorIcon = document.createElement('div'),
                $author = document.createElement('div'),
                $created = document.createElement('div'),
                $likesAndCreated = document.createElement('div'),
                $text = document.createElement('pre');

            $listPost.setAttribute('class', 'post-style m-3 py-2 px-5 shadow-lg bg-light rounded');
            $individualContainer.setAttribute('class', 'container');
            $author.setAttribute('class', 'author-event px-1');
            $author.setAttribute('title', 'Click to profile');
            $rowAuthor.setAttribute('class', 'row');
            $authorIcon.setAttribute('class', 'profile-icon');
            $text.setAttribute('class', 'row p-2 font-italic');
            $text.setAttribute('wrap', 'hard');
            $likesAndCreated.setAttribute('class', 'row')
            $created.setAttribute('class', 'col-sm-11 text-right blockquote-footer');
            $likes.setAttribute('class', 'col-sm-1 text-primary');
            

            if (currentUser && element.likes.toString().includes(currentUser)){           
                $spanIcon.setAttribute('class', 'span-icon span-red px-2');
                $iconLike.setAttribute('class', 'like-event fas fa-heart');
                $iconLike.setAttribute('title', 'Click to stop like');
            } else {
                $spanIcon.setAttribute('class', 'span-icon span-black px-2');
                $iconLike.setAttribute('class', 'like-event far fa-heart');
                $iconLike.setAttribute('title', 'Click to like');
            }

            if (element.author.followers.includes(currentUser)){
                $spanFollow.setAttribute('class', 'span-icon span-orange px-2');
                $iconFollow.setAttribute('class', 'follow-event fas fa-arrow-alt-circle-right');
                $spanFollow.setAttribute('title', 'Click to unfollow');
            } else {
                $spanFollow.setAttribute('class', 'span-icon span-black px-2');
                $iconFollow.setAttribute('class', 'follow-event far fa-arrow-alt-circle-right');
                $spanFollow.setAttribute('title', 'Click to follow');
            }



            $spanFollow.appendChild($iconFollow);
            $rowAuthor.appendChild($spanFollow);
            $author.innerHTML = element.author.username;
            
            if (element.author.image) {
                const $iconUser = document.createElement('img');
                $iconUser.setAttribute('src', `${element.author.image}`);
                $iconUser.setAttribute('width', '30');
                $iconUser.setAttribute('height', '30');
                $authorIcon.appendChild($iconUser);
                $authorIcon.appendChild($author);
                $rowAuthor.appendChild($authorIcon);
            } else {
                const $iconUser = document.createElement('i');
                $iconUser.setAttribute('class', 'fas fa-user');
                $authorIcon.appendChild($iconUser);
                $authorIcon.appendChild($author);
                $rowAuthor.appendChild($authorIcon);
            }



            
            
            $text.innerHTML = element.text;
            $created.innerHTML = element.created;
            $likes.innerHTML = element.likes.length;
            $spanIcon.appendChild($iconLike);
            $likes.appendChild($spanIcon);
            

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
        currentUser = document.querySelector('#box-user').value;
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
                    $iconUser.setAttribute('width', '60');
                    $iconUser.setAttribute('height', '60'); 
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
            
            $username.setAttribute('class', 'author-event span-icon pb-3');
            $profiles.setAttribute('class', ' m-3 py-2 px-5 shadow-lg bg-light rounded');
            $userRow.setAttribute('class', 'user-row');

            if (element.followers.includes(currentUser)){
                $iconFollowers.setAttribute('class', 'fas fa-arrow-alt-circle-right');
                $followers.setAttribute('title', 'followers (including you)');
            } else {
                $iconFollowers.setAttribute('class', 'far fa-arrow-alt-circle-right');
                $followers.setAttribute('title', 'followers');
            }

            if (element.following.includes(currentUser)){
                $iconFollowing.setAttribute('class', 'fas fa-arrow-alt-circle-right');
                $following.setAttribute('title', 'following (including you)');
            } else {
                $iconFollowing.setAttribute('class', 'far fa-arrow-alt-circle-right');
                $following.setAttribute('title', 'following');
            }

            $spanFollowers.setAttribute('class', 'span-orange px-1');
            
            $spanFollowing.setAttribute('class', 'span-green px-1');
            $iconPosts.setAttribute('class', 'fas fa-feather-alt px-1');
            $spanPosts.setAttribute('class', 'span-blue px-1');
            $postsNumber.setAttribute('class', 'text-center');
            $postsNumber.setAttribute('title', 'posts number');
            
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
            
        });
        document.querySelector('#network-container').appendChild($containerAll);
    })    
}

function one_profile(profilebox) {
    fetch(`http://localhost:8000/profile_box/${profilebox}`)
    .then(response => response.json())
    .then(profile => {
        currentUser = document.querySelector('#box-user').value;
        const   $clean = document.getElementById('network-container'),
                $containerAll = document.createDocumentFragment();
        // Clean page for old content
        $clean.innerHTML = '';
        // display profile -------------------------------
        const $profile = document.createElement('div'),
        $containerProfile = document.createElement('div'),
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

        if (profile.image) {
            const $iconUser = document.createElement('img');
            $spanUser.appendChild($iconUser);
            $iconUser.setAttribute('src', `${profile.image}`);
            $iconUser.setAttribute('width', '100');
            $iconUser.setAttribute('height', '100');
        } else {
            const $iconUser = document.createElement('i');
            $spanUser.appendChild($iconUser);
            $iconUser.setAttribute('class', 'fas fa-user');
        }
        
    
    $followers.innerHTML = profile.followers.length;
    $spanFollowers.appendChild($iconFollowers);
    $followers.appendChild($spanFollowers);
    
    $username.innerHTML = profile.username;
    $userAndIcon.appendChild($spanUser);
    $userAndIcon.appendChild($username);
    $spanFollowing.appendChild($iconFollowing);
    $following.appendChild($spanFollowing);
    $spanForFollowing.innerHTML = profile.following.length;
    $following.appendChild($spanForFollowing);
    $postsNumber.innerHTML = profile.myposts.length;
    $spanPosts.appendChild($iconPosts);
    $postsNumber.appendChild($spanPosts);
    
    $username.setAttribute('class', 'pb-3 icon-m');
    $profile.setAttribute('class', ' m-3 py-2 px-5 shadow-lg bg-light rounded');
    $userRow.setAttribute('class', 'user-row');
    $spanFollowers.setAttribute('class', 'icon-m span-orange px-1');
    
    
    if (profile.followers.includes(currentUser)){
        $iconFollowers.setAttribute('class', 'fas fa-arrow-alt-circle-right');
        $followers.setAttribute('title', 'followers (including you)');
    } else {
        $iconFollowers.setAttribute('class', 'far fa-arrow-alt-circle-right');
        $followers.setAttribute('title', 'followers');
    }

    if (profile.following.includes(currentUser)){
        $iconFollowing.setAttribute('class', 'fas fa-arrow-alt-circle-right');
        $following.setAttribute('title', 'following (including you)');
    } else {
        $iconFollowing.setAttribute('class', 'far fa-arrow-alt-circle-right');
        $following.setAttribute('title', 'following');
    }
    
    $spanFollowing.setAttribute('class', 'icon-m span-green px-1');
    $iconPosts.setAttribute('class', 'fas fa-feather-alt px-1');
    $spanPosts.setAttribute('class', 'icon-m span-blue px-1');
    $postsNumber.setAttribute('class', 'text-center');
    $postsNumber.setAttribute('title', 'posts number');
    
    $spanUser.setAttribute('class', 'user-icon span-blue');
    $userAndIcon.setAttribute('class', 'text-center px-3');

    $userRow.appendChild($followers);
    $userRow.appendChild($userAndIcon);
    $userRow.appendChild($following);
    $postRow.appendChild($postsNumber);

    $profile.appendChild($userRow);
    $profile.appendChild($postRow);
    $containerProfile.append($profile);
    $containerProfile.setAttribute('class', 'user-style');

    document.querySelector('#network-container').appendChild($containerProfile);

    if (profile.myposts.length > 0) {
        posts_box(profile.username);
    }
    

})
}