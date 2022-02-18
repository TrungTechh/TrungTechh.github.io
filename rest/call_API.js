var courseApi = 'http://localhost:3000/course' 

function getCouses(callback){
  fetch(courseApi)
    .then(function(course){
      return course.json();
    })
    .then(callback)
}

function renderCourses(courses){
  var listCoursesBlock = document.getElementById('list_courses');
  var htmls = courses.map(function(course){
    return `
      <li class="coure-item-${course.id}">
        <h4>${course.name}</h4>
        <p>${course.description}</p>
        <p>${course.author}</p>
        <button onclick="handleDeleteForm(${course.id})">Xoa</button>
        <button id="edit_btn" onclick="renderFormCourse(${course.id})">Edit</button>
      </li>
    `
  })
  listCoursesBlock.innerHTML = htmls.join('');

}

function createCourse(data,callback){
  fetch(courseApi, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(function(response){
      response.json();
    })
    .then(callback);
}

function handleCreateForm(){
  var createBtn = document.getElementById('create_btn');
  createBtn.onclick = function(){
    var name = document.querySelector('input[name="name"]').value;
    var author = document.querySelector('input[name="author"]').value;
    var description = document.querySelector('input[name="description"]').value;
    var formData ={
      name: name,
      author: author,
      description: description
    };
    createCourse(formData,function(){
      getCouses(renderCourses);
    });
    
  };
}



function  handleDeleteForm(id){
  fetch(courseApi+'/'+id,{
    method: 'DELETE', 
    headers: {
    'Content-type': 'application/json', 
    }
  })
    .then(response => response.json())
    .then(function(){
      console.log('haha')
    })
    .catch(err => console.log(err));

}

function editCourse(id,formData){
  var options = {
    method: 'PATCH',
    headers: {
      'Content-Type' : 'application/json' 
    },
    body: JSON.stringify(formData)
  };
  
  fetch(courseApi + '/' + id, options)
    .then(response => response.json())
    .then(function (){
      getCouses(renderCourses);
    })
}

function renderFormCourse(id){
  var createBtn = document.querySelector('#create_btn')
  createBtn.remove()

  //creat button
  var btnBlock = document.querySelector('#btn_box');
  var btnSave = document.createElement('button');
  var btnText = document.createTextNode('Save');
  btnSave.appendChild(btnText);
  btnSave.setAttribute('onclick', `handleEditCourse(${id})`);
  btnSave.setAttribute("id", "save");
  btnBlock.appendChild(btnSave);

  //getData
  var editInputName  = document.querySelector('input[name="name"]');
  var editInputAuthor  = document.querySelector('input[name="author"]');
  var editInputDes  = document.querySelector('input[name="description"]');
  
  fetch(courseApi,{
    method:'GET',
    headers: {
      'Content-Type' : 'application/json' 
    },
  })
    .then(response => response.json())
    .then(function(data){
      var rightCourse = data.find(function(course){
        return course.id == id;
      })
      editInputName.value = rightCourse.name;
      editInputAuthor.value = rightCourse.author;
      editInputDes.value = rightCourse.description;
    })
}

function handleEditCourse(id){
  var name = document.querySelector('input[name="name"]').value;
  var author = document.querySelector('input[name="author"]').value;
  var description = document.querySelector('input[name="description"]').value;

  var formData = {
    name: name,
    author: author,
    description: description
  }
  
  editCourse(id,formData);
  document.querySelector('#save').remove();
  addCreateBtn();
  document.querySelector('input[name="name"]').value='';
  document.querySelector('input[name="author"]').value='';
  document.querySelector('input[name="description"]').value='';

}

function addCreateBtn() {
  var btnBox = document.querySelector("#btn_box")
  var newBtn = document.createElement("button")
  var btnText = document.createTextNode("Create")
  newBtn.appendChild(btnText);
  newBtn.setAttribute("id", "create_btn")
  btnBox.appendChild(newBtn);
}

function start(){
  getCouses(renderCourses);
  handleCreateForm();
}

start();

