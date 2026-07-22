fetch("./components/top_bar.html")
    .then(response => {
        console.log(response.status);
        return response.text();
    })
    .then(data => {
        document.getElementById("top_bar-placeholder").innerHTML = data;
    });

fetch("./components/bot_bar.html")
    .then(response => {
        console.log(response.status);
        return response.text();
    })
    .then(data => {
        document.getElementById("bot_bar-placeholder").innerHTML = data;
    });