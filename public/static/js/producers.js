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
    url: '/producer_page/' + page,
    type: 'POST',
    data: {
      types: types_for_request,
      steps: steps_for_request,
      region_id: document.getElementById('region_id').value
    },
    success: (data) => {
      document.getElementById('producers').innerHTML = data;
    }
  });
}

function manageProducer() {
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
  let formData = new FormData();
  formData.append('image', document.getElementById("file").files[0]);
  formData.append('new_image', (formData.get('image').size !== undefined));
  formData.append('producer_name', document.getElementById('name').value);
  formData.append('types', types_for_request);
  formData.append('steps', steps_for_request);
  formData.append('region_id', document.getElementById('region_id').value,);
  formData.append('description', document.getElementById('description').value);
  if (validateProducerData(formData)) {
    fetch("/manage_producer", {
      method: "POST",
      body: formData,
    }).then(data => {
      if (data.status === 200) location.replace('/user_room');
      else if (data.status === 406) {
        window.alert("Data is unacceptable!")
      } else window.alert("Ups something wrong.")
    });
  }
}

function validateProducerData(formData) {
  let message = '';
  let flag = true;
  if (formData.get('producer_name').length < 10){
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
  if (formData.get('description').length < 6){
    message +="Введіть опис замовлення\n";
    flag = false;
  }
  if(!flag){
    alert(message);
  }
  return flag
}
