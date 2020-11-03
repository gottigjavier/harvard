document.addEventListener('DOMContentLoaded', function(){
    all_profiles();
});

function all_posts(){
    fetch('http://localhost:8000/all_posts')
    .then(response => response.json())
    .then(posts => {
        console.log(posts);
        const   $individualContainer = document.createElement('div'),
                $containerListPost = document.createDocumentFragment();
    // get current user
    currentUser = document.querySelector('#box-user').value;
    console.log(currentUser);
    
    posts.forEach(element => {
        console.log(element);
        const $br = document.createElement('br'),
            $spanIcon = document.createElement('span'),
            $iconLike = document.createElement('i'),
            $spanFollow = document.createElement('span'),
            $iconFollow = document.createElement('i'),
            $listPost = document.createElement('div'),
            $likes = document.createElement('div'),
            $rowAuthor = document.createElement('div'),
            $author = document.createElement('div'),
            $created = document.createElement('div'),
            $likesAndCreated = document.createElement('div'),
            $text = document.createElement('pre');

        $listPost.setAttribute('class', 'post-style m-3 py-2 px-5 shadow-lg bg-light rounded');
        $individualContainer.setAttribute('class', 'container');
        $rowAuthor.setAttribute('class', 'row');
        $text.setAttribute('class', 'row p-2 font-italic');
        $text.setAttribute('wrap', 'hard');
        $likesAndCreated.setAttribute('class', 'row')
        $created.setAttribute('class', 'col-sm-11 text-right blockquote-footer');
        $likes.setAttribute('class', 'col-sm-1 text-primary');


        if (currentUser && element.likes.toString().includes(currentUser)){           
            $spanIcon.setAttribute('class', 'span-red px-2');
            $iconLike.setAttribute('class', 'fas fa-heart');
        } else {
            $spanIcon.setAttribute('class', 'span-black px-2');
            $iconLike.setAttribute('class', 'far fa-heart');
        }

        console.log(element.author.following)


        if (element.author.following.includes(currentUser)){
            $spanFollow.setAttribute('class', 'span-green px-2');
            $iconFollow.setAttribute('class', 'span-green fas fa-arrow-alt-circle-right');
            $spanFollow.setAttribute('title', 'following');
        } else {
            $spanFollow.setAttribute('class', 'span-black px-2');
            $iconFollow.setAttribute('class', 'far fa-arrow-alt-circle-right');
            $spanFollow.setAttribute('title', 'not following');
        }



        $spanFollow.appendChild($iconFollow);
        $rowAuthor.appendChild($spanFollow);
        $author.innerHTML = element.author.username;
        $rowAuthor.appendChild($author);
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
    document.querySelector('#posts_view').appendChild($containerListPost);

        
    })
    
}



function all_profiles(){
    fetch('http://localhost:8000/all_profiles')
    .then(response => response.json())
    .then(profiles => {
        currentUser = document.querySelector('#box-user').value;
        console.log(profiles);
        const 
                $containerAll = document.createDocumentFragment();
    
    profiles.forEach(element => {
        console.log(element)
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
            $iconUser = document.createElement('i'),
            $spanUser = document.createElement('span'),
            $userAndIcon = document.createElement('div');

        
        $followers.innerHTML = element.followers.length;
        $spanFollowers.appendChild($iconFollowers);
        $followers.appendChild($spanFollowers);
        $spanUser.appendChild($iconUser);
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
        


        $username.setAttribute('class', 'pb-3');
        $profiles.setAttribute('class', ' m-3 py-2 px-5 shadow-lg bg-light rounded');
        $userRow.setAttribute('class', 'user-row');
        $spanFollowers.setAttribute('class', 'span-orange px-1');
        $followers.setAttribute('title', 'followers');
        $iconFollowers.setAttribute('class', 'far fa-arrow-alt-circle-right');
        $spanFollowing.setAttribute('class', 'span-green px-1');
        $following.setAttribute('title', 'following');
        $iconFollowing.setAttribute('class', 'far fa-arrow-alt-circle-right');
        $iconPosts.setAttribute('class', 'fas fa-feather-alt px-1');
        $spanPosts.setAttribute('class', 'span-blue px-1');
        $postsNumber.setAttribute('class', 'text-center');
        $postsNumber.setAttribute('title', 'posts number');
        $iconUser.setAttribute('class', 'fas fa-user');
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
    document.querySelector('#posts_view').appendChild($containerAll);

        
    })
    
}