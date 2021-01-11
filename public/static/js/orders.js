function disable_order(id) {
  fetch('/disable_order/' + id, { method: 'POST'})
    .then(data => {
      if (data.status === 200) location.reload();
      else window.alert("Ups, something wrong!");
    });
}

function create_order() {
  let types = document.getElementsByName('producer_types');
  let steps = document.getElementsByName('producer_steps');
  let types_for_request = [];
  let steps_for_request = [];
  for (let i = 0; i < types.length; i++) {
    if (types[i].checked) {
      types_for_request.push(types[i].getAttribute('value'));
    }
  }
  for (let i = 0; i < steps.length; i++) {
    if (steps[i].checked) {
      steps_for_request.push(steps[i].getAttribute('value'));
    }
  }
  var formData = new FormData();
  formData.append('image', document.getElementById('file').files[0]);
  formData.append('name', document.getElementById('name').value);
  formData.append('types', types_for_request);
  formData.append('steps', steps_for_request);
  formData.append('region_id', document.getElementById('region_id').value,);
  formData.append('description', document.getElementById('description').value);
  formData.append('small_description', document.getElementById('small_description').value);
  fetch('/create_order', {
    method: 'POST',
    body: formData})
    .then(data => {
      if (data.status === 200) location.replace('/user_room');
      else alert('Something is wrong!');
    });
}

function openPage(page) {
  let types = document.getElementsByName('producer_types');
  let steps = document.getElementsByName('producer_steps');
  let types_for_request = [];
  let steps_for_request = [];
  for (let i = 0; i < types.length; i++) {
    if (types[i].checked) {
      types_for_request.push(types[i].getAttribute('value'));
    }
  }
  for (let i = 0; i < steps.length; i++) {
    if (steps[i].checked) {
      steps_for_request.push(steps[i].getAttribute('value'));
    }
  }
  $.ajax({
    url: '/order_page/' + page,
    type: 'POST',
    data: {
      types: types_for_request,
      steps: steps_for_request,
      region_id: document.getElementById('region_id').value
    },
    success: (data) => {
      document.getElementById('orders').innerHTML = data;
    }
  });
}
