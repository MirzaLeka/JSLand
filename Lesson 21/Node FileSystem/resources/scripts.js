
window.onload = () => {
  getUsers();
};

let users = [];

function getUsers() {
 
  const xhttp = new XMLHttpRequest();

  xhttp.open('GET', '/users', true); // getting data from that /users route
  
  xhttp.onload = function () {

    if (this.status === 200) {

      // we'll fill users variable with what is inside users.json file
      users = this.responseText; 

      // if file is empty do nothing, else do the following
      if (users) {

        // what we get from server is always string, so we need to prase it into object
        users = JSON.parse(users); 

        // Note: Arrays are type Object in Javascript
        
        displayUsers();
      } else if (this.status === 404) {
        console.log('Route not found!');
      }
    }

    // I'm using normal functions because arrow functions don't bind this keyword
    xhttp.onerror = function () { 
      console.log('Request failed!');
    };

  };

  
  xhttp.send();
  

}

function User(username, score) {
  this.username = username;
  this.score = score;
}


/* Calling Save function */

document.querySelector('#score').addEventListener('keyup', (event) => {
  event.preventDefault();

  if (event.keyCode === 13) {
    save();
  }
});

document.querySelector('#saveBtn').addEventListener('click', save);
  

function save() {
    
  const username = document.querySelector('#username').value;
  const score = document.querySelector('#score').value;
  
  const newUser = new User(username, score);
  const response = document.querySelector('p');
    
  if (users.length === 0) {
    if (users instanceof Array) {
      //
    } else {
      users = [];
    }
    users.push(newUser);      
    response.textContent = 'User added!'; 
    addUser(newUser);
    document.querySelector('#username').value = '';
    document.querySelector('#score').value = '';
    
  } else {

    if (users.some(item => item.username === username)) {
      response.textContent = 'Username is in use. Try another one.';
    } else {
      users.push(newUser);
      addUser(newUser);
      response.textContent = 'User added!';
      document.querySelector('#username').value = '';
      document.querySelector('#score').value = '';
    }
  }
       
  displayUsers();
}


function addUser(user) {

  user = JSON.stringify(user); // I have to stringify it because i'm sending json as content-type

  const xhttp = new XMLHttpRequest();

  xhttp.open('POST', '/users', true);
  xhttp.setRequestHeader('Content-type', 'application/json'); // setting content-type that we are sending to the server

  xhttp.onload = () => {
    console.log('Loaded');
  };

  xhttp.onerror = () => {
    console.log('Something went wrong');
  };

  xhttp.send(user);

}

function displayUsers() {

  console.log(users);

  let list = '';

  users.forEach((user) => {
    list += `<div class="list"> 
    <p> <b>Username:</b> ${user.username} </p>
    <p> <b>score:</b> ${user.score} </p>
    <button onclick="deleteUser(\`` + user.username + `\`, this)">X</button>
    </div>`;
  });

  document.querySelector('#users').innerHTML = list;

}


function deleteUser(username, element) {

  element.parentNode.remove();

  const xhttp = new XMLHttpRequest();

  xhttp.open('DELETE', `users/${username}`, true);
  xhttp.send(username);

}
