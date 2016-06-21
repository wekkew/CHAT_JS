( function () {

    //get hmtl elements to work with
    var loginFormEl = document.getElementById('login');
    var loginErrorEl = document.getElementById('loginError')
    var chatFormEl = document.getElementById('chat');
    var onlineEl = document.getElementById('onlineClients');


    var usernameEl = loginFormEl.elements[0];
    var submitEl = loginFormEl.elements[1];

    var socket = io('http://10.10.0.34:3000');

    function chat(username, users) {

        users.forEach(function (user) {
            var client = document.createElement('p');
                client.setAttribute('id', user + 'online');
                client.textContent = user;
                onlineEl.appendChild(client);
        });

        var textEl = document.getElementById('chatInput');
        var blackBoardEl = document.getElementById('activeChat');

        var chatTextEl = textEl.elements[0];
        var chatSend = textEl.elements[1];

        function sendMessage (event) {
            event.preventDefault();
            var sendText = chatTextEl.value;
            socket.emit('message', sendText);
            var myMessage = document.createElement('p');
                myMessage.setAttribute('class', username);
                myMessage.textContent = '[' + username + ']' + ' -> ' + sendText;
            blackBoardEl.appendChild(myMessage);
            chatTextEl.value = '';
        };

        socket.on('user joined', function(data) {
            console.log(data.username + ' :has joined');
            var newClient = document.createElement('p');
                newClient.setAttribute('id', data.username + 'online');
                newClient.textContent = data.username;
                onlineClients.appendChild(newClient);
        });

        socket.on('user left', function(data) {
            console.log(data.username + ' :has left');
            document.getElementById(data.username + 'online').remove();
        });

        socket.on('new message', function(data) {
            console.log(data.username + ' : ' + data.message);
            var message = document.createElement('p');
                message.setAttribute('class', data.username+'message');
                message.textContent = '{' + data.username + '}' + ' -> ' + data.message;
            blackBoardEl.appendChild(message);
        });

        textEl.addEventListener('submit', sendMessage);

    };
    //end of chat prog

    function loggingIn (username) {
        usernameEl.disabled = true;
        submitEl.disabled = true;
        socket.emit('login', username);
    };

    function setLoginError (message) {
        loginErrorEl.textContent = message;
        usernameEl.disabled = false;
        submitEl.disabled = false;
        loginFormEl.setAttribute('class', '');
    };

    function logIn (event) {
        event.preventDefault();

        loginErrorEl.textContent = '';

        var username = usernameEl.value.trim();
        var errorMessage;

        if (username.length === 0) {
            errorMessage = 'Error: enter an username above';
        } else if (username.length < 3) {
            errorMessage = 'Error: enter at least 3 characters';
        }

        if (errorMessage) {
            setLoginError(errorMessage);
        }
        else {
            loggingIn(username);
        }
    };

    function logInSucces (username, users) {
        loginFormEl.setAttribute('style', 'display: none');
        chatFormEl.setAttribute('style', 'display: block');
        chat(username, users);

        console.log(username);
        console.log(users);
    }

    socket.on('login status', function (response) {
        if (response.status === 'taken') {
            setLoginError('Error: this login name has taken');
            console.log('we must reach out to Liam Neeson ;)');
        }
        else {
            logInSucces (response.username, response.users);
        }
        console.log(response);
    })

    loginFormEl.addEventListener('submit', logIn);





})();
