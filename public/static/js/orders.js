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
  if (validateOrderData(formData)) {
    fetch('/create_order', {
      method: 'POST',
      body: formData
    })
      .then(data => {
        if (data.status === 200) location.replace('/user_room');
        else alert('Something is wrong!');
      });
  }
}

function validateOrderData(formData) {
  let message = '';
  let flag = true;
  if(formData.get('image').size === undefined) {
    message += "Оберіть файл\n";
    flag = false;
  }
  if (formData.get('name').length < 10){
    message +="Введіть назву замовлення(мін 10 літер)\n";
    flag = false;
  }
  if (formData.get('types').length === 0){
    message += "Оберіть хоча б один тип виробництва\n";
    flag = false;
  }
  if (formData.get('steps').length === 0){
    message += "Оберіть хоча б один крок виробництва\n";
    flag = false;
  }
  if (formData.get('small_description').length < 6){
    message +="Введіть малий опис замовлення\n";
    flag = false;
  }
  if (formData.get('description').length < 6){
    message +="Введіть опис замовлення\n";
    flag = false;
  }
  if(!flag){
    alert(message);
  }
  return flag
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
      console.log(data);
      document.getElementById('orders').innerHTML = data;
    }
  });
}
