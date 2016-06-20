var socket = io('http://10.10.0.34:3000');

function chat() {
    var loginName = document.getElementById('loginNameInput').value;
    console.log(loginName);
    if (loginName.length < 3) {
        window.history.go();
    }

    document.getElementById('login').remove();

    var onlineBox = document.createElement('ul');
        onlineBox.setAttribute('id', 'onlineBox');
        document.body.appendChild(onlineBox);


    socket.on('connect', function() {
        socket.emit('join', loginName);
    });

    socket.on('user joined', function(data) {
        var client = document.createElement('li');
            client.setAttribute('id', data.username);
            client.setAttribute('class', 'onlineClient');
            client.textContent = data.username + ' is online';
            document.getElementById('onlineBox').appendChild(client);
    });

    socket.on('user left', function(data) {
        var onlineClientList = document.getElementsByClassName('onlineClient');
        if (data.username !== String) {
            return;
        }
        else if (onlineClientList.indexOf(data.username) !== -1) {
            document.getElementById(data.username).remove();
        }
    });

    socket.on('new message', function(data) {
        var message = document.createElement('div');
            message.setAttribute('class', data.username);
            message.textContent = data.username + ' : ' + data.message;
            document.body.appendChild(message);
    })



}

var loginNameButton = document.getElementById('loginNameButton');
loginNameButton.addEventListener('click', chat);

console.log('elefant');
