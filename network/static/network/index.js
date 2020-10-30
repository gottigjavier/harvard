document.addEventListener('DOMContentLoaded', function(){
    all_profiles();
});

function load_posts(){
    fetch('http://localhost:8000/posts')
    .then(response => response.json())
    .then(posts => {
        console.log(posts);
        const $listPost = document.createDocumentFragment();
    
    posts.forEach(element => {
        console.log(element);
        const $likes = document.createElement('div'),
            $author = document.createElement('div'),
            $created = document.createElement('div'),
            $text = document.createElement('div'),
            $follow = document.createElement('div');

        $author.innerHTML = element.author;
        $text.innerHTML = element.text;
        $created.innerHTML = element.created;
        $likes.innerHTML = element.likes.length;
        $follow.innerHTML = element.author['followers'];

        $listPost.appendChild($author);
        $listPost.appendChild($text);
        $listPost.appendChild($created);
        $listPost.appendChild($likes);
        $listPost.appendChild($follow);

        
    });
    document.querySelector('#posts_view').appendChild($listPost);

        
    })
    
}



function all_profiles(){
    fetch('http://localhost:8000/all_profiles')
    .then(response => response.json())
    .then(profiles => {
        console.log(profiles);
        const $profiles = document.createDocumentFragment();
    
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

        
    });
    document.querySelector('#posts_view').appendChild($profiles);

        
    })
    
}