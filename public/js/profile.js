const searchInput = document.getElementById('friendSearch');
const friendsList = document.querySelector('.list');

function searchFriend() {
    const username = searchInput.value.trim();
    
    if (!username) return;
    
    fetch(`/profile/search-friends?username=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(data => {
            if (!data.success) throw new Error(data.message);
            
            if (data.found) {
                addFriend(data.user.id);
            } else {
                alert(data.message || 'Benutzer nicht gefunden.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message || 'Ein Fehler ist aufgetreten.');
        });
}

function addFriend(friendId) {
    return fetch('/profile/add-friend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) throw new Error(data.message);
        
        const noFriendsMsg = friendsList.querySelector('p');
        if (noFriendsMsg) noFriendsMsg.remove();
        
        const li = document.createElement('li');
        li.className = 'friend-item';
        li.id = `friend-${data.friend.id}`;
        li.innerHTML = `
            <span>${data.friend.name}</span>
            <button onclick="removeFriend('${data.friend.id}')" 
                    class="button button-small">Entfernen</button>
        `;
        
        friendsList.appendChild(li);
        searchInput.value = '';
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message || 'Ein Fehler ist aufgetreten.');
    });
}

function removeFriend(friendId) {
    fetch(`/profile/remove-friend/${friendId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) throw new Error(data.message);
        
        const friendElement = document.getElementById(`friend-${friendId}`);
        if (friendElement) friendElement.remove();
        
        if (friendsList.children.length === 0) {
            friendsList.innerHTML = '<p>Noch keine Freunde hinzugefügt.</p>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message || 'Ein Fehler ist aufgetreten.');
    });
}