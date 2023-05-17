// select items
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ***** event listeners *****
//submit form
form.addEventListener("submit", addItem);
//clear items
clearBtn.addEventListener("click", clearItems);
// load items(from local storage)
window.addEventListener("DOMContentLoaded", setupItems);

// ***** functions *****
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  // a way to get a unique id (just for practice projects, not recommended for real projects)
  const id = new Date().getTime().toString();
  // console.log(id);
  if (value && !editFlag) {
    createListItem(id, value);
    // display alert
    displayAlert(`item added to the list`, `success`);
    // show hidden container
    container.classList.add("show-container");
    // add to local storage
    addToLocalStorage(id, value);
    // set back to default (remember to keep it last)
    setBackToDefault();
  } else if (value && editFlag) {
    // grab value and assign to edit element
    editElement.innerHTML = value;
    // display alert
    displayAlert(`value changed`, `success`);
    // edit local storage
    editLocalStorage(editID, value);
    // set back to default
    setBackToDefault();
  } else {
    displayAlert(`please enter value`, `danger`);
  }
}

// display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1500);
}

// clear items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  // hide container
  container.classList.remove("show-container");
  // display alert
  displayAlert(`empty list`, `danger`);
  // set back to default
  setBackToDefault();
  // remove from local storage
  localStorage.removeItem("list");
}

// delete item
function deleteItem(e) {
  const listItem = e.currentTarget.parentElement.parentElement;
  const id = listItem.dataset.id;
  list.removeChild(listItem);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  // display alert
  displayAlert(`item removed`, `danger`);
  // set back to default
  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}

//edit item
function editItem(e) {
  const listItem = e.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // console.log(editElement);
  //set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = listItem.dataset.id;
  // console.log(editID);
  submitBtn.textContent = "edit";
}

// set back to default
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// ***** local storage *****
// add to local storage
function addToLocalStorage(id, value) {
  // set an item as object with key-value pairs
  const grocery = { id: id, value: value };
  // check whether there is an item called 'list' in local storage, if not, create an empty array, if yes return that item(array);
  let items = getLocalStorage();
  // console.log(items);
  // add grocery to the list array
  items.push(grocery);
  // set item
  localStorage.setItem("list", JSON.stringify(items));
}

// remove from local storage
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}
// edit local storage
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// get local storage
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

// localStorage API
// setItem
// localStorage.setItem("orange", JSON.stringify(["item1", "item2"]));
// getItem
// const oranges = JSON.parse(localStorage.getItem("orange"));
// console.log(oranges);
// removeItem
// localStorage.removeItem("orange");
// save as strings

// ***** setup items *****
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

// creat list item
function createListItem(id, value) {
  // create element
  const element = document.createElement("article");
  // add class
  element.classList.add("grocery-item");
  // add (dataset) id
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  // add content to the element
  element.innerHTML = `<p class="title">${value}</p>
                        <!-- btn-container -->
                        <div class="btn-container">
                            <button class="edit-btn" type="button">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-btn" type="button">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>`;
  // access delete and edit buttons
  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  // add event listener on these buttons
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);
  // append to the list
  list.appendChild(element);
}
