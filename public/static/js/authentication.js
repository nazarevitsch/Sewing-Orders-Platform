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

function registration() {
  let fd = new FormData();
  fd.append('username', document.getElementById('username').value);
  fd.append('password', document.getElementById('password').value);
  fetch('/registration',
    {
      method: 'POST',
      body: fd
    })
    .then(data => {
      if (data.status === 406) {
        data.text()
          .then(body => JSON.parse(body))
          .then(parsedBody => alert(parsedBody.message));
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

function get_new_password() {
  let fd = new FormData();
  fd.append('email', document.getElementById('username').value);
  fetch('/forgot_password' + id, { method: 'POST', body: fd })
    .then(data => {
      if (data.status === 200) {
        if (window.alert("Check your mailbox.")) {
          location.replace('/login');
        }
      } else {
        if (data.status === 406) {
          data.text()
            .then(body => JSON.parse(body))
            .then(parsedBody => alert(parsedBody.message));
        } else window.alert("Ups, something wrong!");
      }
    });
}

function changePassword() {
  let fd = new FormData();
  fd.append('new_password', document.getElementById('new_password').value);
  fd.append('old_password', document.getElementById('old_password').value);
  fetch('/change_password', {method: 'POST', body: fd})
    .then(data => {
      if (data.status === 406) {
        data.text()
          .then(body => JSON.parse(body))
          .then(parsedBody => {
            window.alert(parsedBody.message);
          })
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

function deleteCookies(){
  document.cookie = 'token=nothing';
  window.location.replace('/login');
}

function setNewPersonalData() {
  let fd = new FormData();
  fd.append('phone_number', document.getElementById('phone_number').value);
  fd.append('name', document.getElementById('name').value);
  fetch('/set_new_user_data', { method: 'POST', body: fd })
    .then(data => {
      if (data.status === 406) {
        data.text()
          .then(body => JSON.parse(body))
          .then(parsedBody => {
            window.alert(parsedBody.message);
          })
      } else if (data.status === 200) {
        window.location.replace('/user_room');
      } else {
        window.alert("Ups, something wrong!");
      }
    });
}
