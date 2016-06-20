var socket = io('http://10.10.0.34:3000');
//this function just loaded when the log in has completed
function chat() {
    var loginName = document.getElementById('loginNameInput').value;
    // if the loginname is tto short than the page will be reloaded
    if (loginName.length < 3) {
        window.history.go();
    }
    else {
        socket.emit('join', loginName);
    }
    // if the login name is good than the log process finished with the comminication with the server
    document.getElementById('login').remove();

    /*
    var onlineBox = document.createElement('ul');
        onlineBox.setAttribute('id', 'onlineBox');
        document.body.appendChild(onlineBox);
        */
    // there goes the chat text
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
    // newevent function helps me to insert a new element in the flow
    function newEvent (who, what) {
        var div = document.createElement('div');
            div.setAttribute('class', who);
            div.textContent = who + ' : ' + what;
            document.body.appendChild(div);
    };

    // sendMessage sends the message to the server
    function sendMessage () {
        var textMessage = document.getElementById('textInput').value;
        socket.emit('message', textMessage);
        newEvent(loginName, textMessage);
        document.getElementById('textInput').value = '';
    }
    // these are just the event listeneres for the click and the enter
    textButton.addEventListener('click', sendMessage);
    textArea.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
            sendMessage();
        }
        else {
            return;
        }
    })
/*
    var onlineClientList = [];
*/

//some server communications
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
//end of chat prog


// the startpages event listeners
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
