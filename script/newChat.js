var socket = io('http://10.10.0.34:3000');

function chat() {
    var loginName = document.getElementById('loginNameInput').value;
    console.log(loginName);
    if (loginName.length < 3) {
        window.history.go();
    }
    else {
        socket.emit('join', loginName);
    }

    document.getElementById('login').remove();

    var onlineBox = document.createElement('ul');
        onlineBox.setAttribute('id', 'onlineBox');
        document.body.appendChild(onlineBox);

    var textArea = document.createElement('input');
        textArea.setAttribute('type', 'text');
        textArea.setAttribute('id', 'textInput');
        textArea.setAttribute('class', 'szoveg');
        textArea.setAttribute('minlength', '1');
        textArea.setAttribute('value', '');

        document.body.appendChild(textArea);

    var textButton = document.createElement('button');
        textButton.setAttribute('id', 'textButton');
        textButton.setAttribute('class', 'szoveg');
        textButton.textContent = 'Send';
        document.body.appendChild(textButton);

    function newEvent (who, what) {
        var div = document.createElement('div');
            div.setAttribute('class', who);
            div.textContent = who + ' : ' + what;
            document.body.appendChild(div);
    }


    function sendMessage () {
        var textMessage = document.getElementById('textInput').value;
        socket.emit('message', textMessage);
        newEvent(loginName, textMessage);
        document.getElementById('textInput').value = '';
    }

    textButton.addEventListener('click', sendMessage);
    textArea.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
            sendMessage();
        }
        else {
            return;
        }
    })

    var onlineClientList = [];

    socket.on('user joined', function(data) {
        var hasJoined = ' has joined :)';
        console.log(data.username + hasJoined);
        newEvent(data.username, hasJoined);

    });

    socket.on('user left', function(data) {
        var hasLeft = ' has left :('
        console.log(data.username + hasLeft);
        newEvent(data.username, hasLeft);


    });

    socket.on('new message', function(data) {
        console.log(data.username + ' : ' + data.message);
        newEvent(data.username, data.message);

    })

};

var loginNameButton = document.getElementById('loginNameButton');
loginNameButton.addEventListener('click', chat);

var loginNameInput = document.getElementById('loginNameInput');
loginNameInput.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        chat();
    }
    else {
        return;
    }
});
