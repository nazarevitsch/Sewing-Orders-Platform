function login() {
  let fd = new FormData();
  fd.append('username', document.getElementById('username').value);
  fd.append('password', document.getElementById('password').value);
  fetch('/login',
    {method: 'POST',
      body: fd})
    .then(data => {
      if (data.status === 406) {
        window.alert("Wrong password or email!");
      } else if (data.status === 200) {
        data.text()
          .then(body => JSON.parse(body))
          .then(parsedBody => {
            document.cookie = 'token=' + parsedBody.token;
            window.location.replace('/user_room');
          })
      } else {
        window.alert("Ups, something wrong!");
      }
    });
}
