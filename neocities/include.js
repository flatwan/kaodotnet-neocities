fetch("./components/topbar.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("topbar-placeholder").innerHTML = data;
    });