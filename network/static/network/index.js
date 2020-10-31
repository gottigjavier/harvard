document.addEventListener('DOMContentLoaded', function(){
    all_posts();
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
            $span = document.createElement('span'),
            $iconRed = document.createElement('i'),
            $listPost = document.createElement('div'),
            $likes = document.createElement('div'),
            $author = document.createElement('div'),
            $created = document.createElement('div'),
            $likesAndCreated = document.createElement('div'),
            $text = document.createElement('pre');

        $listPost.setAttribute('class', 'post-style m-3 py-2 px-5 border');
        $individualContainer.setAttribute('class', 'container');
        $author.setAttribute('class', 'row');
        $text.setAttribute('class', 'row p-2 font-italic');
        $text.setAttribute('wrap', 'hard');
        $likesAndCreated.setAttribute('class', 'row')
        $created.setAttribute('class', 'col-sm-11 text-right blockquote-footer');
        $likes.setAttribute('class', 'col-sm-1 text-primary');

        if (currentUser && element.likes.toString().includes(currentUser)){ 
        $span.setAttribute('class', 'icon-red px-2');
        $iconRed.setAttribute('class', 'fas fa-heart');
        } else {
            $span.setAttribute('class', 'icon-black px-2');
            $iconRed.setAttribute('class', 'far fa-heart');
        }

        $author.innerHTML = element.author;
        $text.innerHTML = element.text;
        $created.innerHTML = element.created;
        $likes.innerHTML = element.likes.length;
        $span.appendChild($iconRed);
        $likes.appendChild($span);
        

        $listPost.appendChild($author);
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
        console.log(profiles);
        const $profiles = document.createElement('div'),
                $containerProfiles = document.createDocumentFragment();
    
    profiles.forEach(element => {
        console.log(element)
        const $username = document.createElement('div'),
            $following = document.createElement('div'),
            $followers = document.createElement('div'),
            $postsNumber = document.createElement('div');

        $username.innerHTML = 'username ' + element.username;
        $following.innerHTML = 'following ' + element.following;
        $followers.innerHTML = 'followers ' + element.followers;
        $postsNumber.innerHTML = 'post numbers ' + element.myposts.length;

        $profiles.appendChild($username);
        $profiles.appendChild($following);
        $profiles.appendChild($followers);
        $profiles.appendChild($postsNumber);

        $containerProfiles.appendChild($profiles);

        
    });
    document.querySelector('#posts_view').appendChild($containerProfiles);

        
    })
    
}