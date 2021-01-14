function login() {
  let fd = new FormData();
  fd.append('username', document.getElementById('username').value);
  fd.append('password', document.getElementById('password').value);
  if (validateEmail(fd.get('username')) && validatePassword(fd.get('password'))) {
    fetch('/login',
      {
        method: 'POST',
        body: fd
      })
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
  } else {
    alert('Unacceptable password or email!\n' +
      'Password should be from 8 to 20 chars')
  }
}

function registration() {
  let fd = new FormData();
  fd.append('username', document.getElementById('username').value);
  fd.append('password', document.getElementById('password').value);
  if (validateEmail(fd.get('username')) && validatePassword(fd.get('password'))) {
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
  } else {
    alert('Unacceptable password or email!\n' +
      'Password should be longer than 8 chars')
  }
}

function get_new_password() {
  let fd = new FormData();
  fd.append('email', document.getElementById('username').value);
  if (validateEmail(fd.get('email'))) {
    fetch('/forgot_password', { method: 'POST', body: fd })
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
  } else {
    alert('Unacceptable email!')
  }
}

function changePassword() {
  let fd = new FormData();
  fd.append('new_password', document.getElementById('new_password').value);
  fd.append('old_password', document.getElementById('old_password').value);
  if (validatePassword(fd.get('new_password')) && validatePassword(fd.get('old_password'))
    && fd.get('new_password') !== fd.get('old_password')) {
    fetch('/change_password', { method: 'POST', body: fd })
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
  } else {
    alert('Unacceptable old or(and) new password!\n' +
      'Password should be from 8 to 20 chars!\n' +
      'Old and new password should not be same!')
  }
}

function deleteCookies(){
  document.cookie = 'token=nothing';
  window.location.replace('/login');
}

function setNewPersonalData() {
  let fd = new FormData();
  fd.append('phone_number', document.getElementById('phone_number').value);
  fd.append('name', document.getElementById('name').value);
  if (validatePhone(fd.get('phone_number')) && fd.get('name').length >= 10
  && fd.get('name').length <= 30) {
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
  } else {
    alert('Unacceptable phone number or name!\n' +
      'Phone should contain (only 10 figures) or (+ and 12 figures)!' +
      'Name should contain from 10 to 30 chars!');
  }
}


function validateEmail(email){
  let patternForEmail = /^[\w\.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  return patternForEmail.test(email);
}

function validatePassword(password) {
  let pattern = /^\w{8,20}$/;
  return pattern.test(password);
}

function validatePhone(phone){
  let patternForPhoneNumber = /(^\+?\d{12}$)|(^\d{10}$)/;
  return patternForPhoneNumber.test(phone);
}
