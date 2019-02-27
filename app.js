/*
    Person Class: Represents a person whom I hate
*/
class Person {
    constructor(name, email, reason){
        this.name = name;
        this.email = email;
        this.reason = reason;
    }
}
/*
    UI Class: Handles all UI tasks: Displaying alerts, adding buttons etc.
*/
class UI {
    static displayPeople(){
        
        const people = Store.getPeople();
        
        //looping and applying method to each element of list.
        people.forEach((person) => UI.addPersonToList(person));
    }
    
    static addPersonToList(person){
        //fetching a reference for table body
        const personListRef = document.getElementById('person-list');
        
        //creating a new table row element
        const row = document.createElement('tr');
        
        //adding content to new row
        row.innerHTML = `
            <td>${person.name}</td>
            <td>${person.email}</td>
            <td>${person.reason}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">Delete</a></td>
        `;
        //append the row to the list
        personListRef.appendChild(row);
    }
    
    static deletePerson(selectedElement){
        const deleteName = selectedElement.parentElement.parentElement.firstElementChild.innerHTML;
        if(selectedElement.classList.contains('delete')){
            selectedElement.parentElement.parentElement.remove();
            return deleteName;
        }
        else{
            return "none";
        }
    }
    
    static clearFields(){
        document.getElementById('personName').value = '';
        document.getElementById('personMail').value = '';
        document.getElementById('personReason').value = '';
    }
    
    static showAlert(message, type){
        //create a new div for alert box
        const alertDiv = document.createElement('div');
        
        //make this div the member of required bootstrap classes
        alertDiv.className = `alert alert-${type}`;
        
        //add message to the div element in the form of text
        const messageText = document.createTextNode(message);
        alertDiv.appendChild(messageText);
        
        //fetch reference to the container
        const cont = document.querySelector('.container');
        //fetch reference for element before which our new div will be placed
        const before = document.getElementById('people-form');
        
        cont.insertBefore(alertDiv, before);
        
        //remove alert-box after three seconds
        setTimeout(function(){
            document.querySelector('.alert').remove()
        }, 3000);
    }
}

/*
    Store Class: Stores data to and from local storage
*/
class Store{
    static getPeople(){
        let people;
        if (localStorage.getItem('people') === null){
            //no item on local storage
            people = [];
        }
        else{
            //fetch item from local storage and convert the string to an 
            //array of json objects
            people = JSON.parse(localStorage.getItem('people'));
        }
        
        return people;
    }
    
    static addPerson(person){
        const people = Store.getPeople();
        
        //push new person to books
        people.push(person);
        
        //reset local storage to the updated state
        localStorage.setItem('people', JSON.stringify(people));
    }
    
    static deletePerson(personName){
        const people = Store.getPeople();
        
        //remove from people
        people.forEach(function(person, index){
            if (person.name === personName){
                people.splice(index, 1);
            }
        });
        
        //reset local storage with person removed
        localStorage.setItem('people', JSON.stringify(people));
        
    }
    
}


//Event: Display person list

document.addEventListener('DOMContentLoaded', UI.displayPeople);

//Event: Add a person to list

//fetching form reference
const formRef = document.getElementById('people-form');
formRef.addEventListener('submit', function(event){
    //stop default submit
    event.preventDefault();
    
    //fetching form values
    const name = document.getElementById('personName').value;
    const email = document.getElementById('personMail').value;
    const reason = document.getElementById('personReason').value;
    
    //perform a validation here
    if (name === '' || email === '' || reason === ''){
        //if any one field is missing
        UI.showAlert("Please fill out all the forms", "danger");
    }
    else{
        //all fields are filled up by the user
        //instantiate a book object with the data fetched
        const person = new Person(name, email, reason);
    
        //add person to the website UI
        UI.addPersonToList(person);
        
        //add person to local storage
        Store.addPerson(person);
    
        //clear all fields after person getting added
        UI.clearFields();
        
        //show confirmation message
        UI.showAlert("Person successfully added to your hate-list!", "success");
    }
});

//Event: Remove a person from list

document.getElementById('person-list').addEventListener('click', function(event){
    //delete from the UI
    const dName = UI.deletePerson(event.target);
    
    //delete from local storage
    Store.deletePerson(dName);
    
    const deleteMessage = `${dName} successfully deleted!`
    
    //show delete confirmation message
    if (dName !== "none"){
        UI.showAlert(deleteMessage, 'success');    
    }
    
});
