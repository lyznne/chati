document.addEventListener("DOMContentLoaded", () => {
    const app = document.querySelector(".app");
    const socket = io();

    let uname;
    const renderMessage = (type, message) => {
        let messageContainer = app.querySelector(".chat-screen .messages");

        if (type == "my") {
            let el = document.createElement("div")
            el.setAttribute("class", "message my-msg");
            el.innerHTML = `
            <div class="msg">
                <div class="name" > ${message.username}</div>
                <div class="text" >${message.text} </div>
            </div>
            `;

            messageContainer.appendChild(el);


        } else if (type == "other") {
            let el = document.createElement("div")
            el.setAttribute("class", "message other-msg");
            el.innerHTML = `
            <div class="msg">
                <div class="name" > ${message.username}</div>
                <div class="text" >${message.text} </div>
            </div>
            `;

            messageContainer.appendChild(el);
        } else if (type == "update") {
            let el = document.createElement("div")
            el.setAttribute("class", "update");
            el.innerHTML = `

            
               <span> ${message}</span> joined the chatroom
            
            
            `;
            // el.innerText = message

            messageContainer.appendChild(el);
        }else if (type == "exit") {
            let el = document.createElement("div")
            el.setAttribute("class", "update");
            el.innerHTML = `

            
               <span> ${message}</span> left the chatroom
            
            
            `;
            // el.innerText = message

            messageContainer.appendChild(el);
        }

        messageContainer.scrollTop = messageContainer.scrollHeight = messageContainer.clientHeight;


    }



    app.querySelector(".join-screen #join-user").addEventListener("click", (e) => {
        e.preventDefault();
        let username = app.querySelector(".join-screen #username").value;
        console.log(username);

        if (!username) return;

        if (username.length === 0) {
            return;
        }

        socket.emit("newuser", username);
        uname = username;

        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", (e) => {
        e.preventDefault();

        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    })

    socket.on("update", (update) => {
        renderMessage("update", update);
    })

    socket.on("exit", (update) => {
        renderMessage("exit", update);
    })

    socket.on("chat", (message) => {
        renderMessage("other", message);
    })

    app.querySelector(".chat-screen #send-msg").addEventListener("click", (e) => {
        e.preventDefault();

        let message = app.querySelector(".chat-screen #msg-input").value;

        if (message.length === 0) {
            return;
        }


        renderMessage("my", {
            username: uname,
            text: message
        });

        socket.emit("chat", {
            username: uname,
            text: message
        });


        app.querySelector(".chat-screen #msg-input").value = "";





    });

})
