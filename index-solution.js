document.addEventListener("DOMContentLoaded", () => {

  const animals = document.querySelector('#zoo-animals')
  const animalInfo = document.querySelector('#animal-info')
  const animalForm = document.querySelector('#create-animal')
  animalForm.addEventListener('submit', createNewAnimal)

  fetch('http://localhost:3000/animals')
  .then(response => response.json())
  .then(animals => animals.forEach(slapItOnTheDOM))

  function slapItOnTheDOM(animal) {
    const animalLi = document.createElement('li');
    animalLi.dataset.id = animal.id
    animalLi.innerHTML = `<span>${animal.name} the ${animal.species}</span>`
    animals.appendChild(animalLi);

    const buttond = document.createElement('button')
    buttond.dataset.id = animal.id
    buttond.setAttribute("id", `delete-button-${animal.id}`)
    buttond.innerText = "DELETE"
    animals.appendChild(buttond);
    buttond.addEventListener('click', () => deleteAnimal(animal))

    const buttonu = document.createElement('button')
    buttonu.dataset.id = animal.id
    buttonu.setAttribute("id", `update-button-${animal.id}`)
    buttonu.innerText = "UPDATE"
    animals.appendChild(buttonu);
    buttonu.addEventListener('click', () => editAnimal(animal))
  }

  function gatherFormData(){
    return {
      hobby: event.target.hobby.value,
      image: event.target.image.value,
      name: event.target.name.value,
      species: event.target.species.value,
      ferociousness: event.target.ferociousness.value
    }
  }    

  /////// CREATE ///////

  function createNewAnimal(event) {
    event.preventDefault();
    let newAnimal = gatherFormData();
    return fetch('http://localhost:3000/animals', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newAnimal)
    })
    .then(res => res.json())
    .then(animal => (slapItOnTheDOM(animal)));
  }

  /////// UPDATE ///////

  function editAnimal(animal) {
      console.log(`${animal.name} edit button has been clicked!`)
      const eForm = document.createElement('form')
      eForm.id = "update-form"
      eForm.innerHTML = `<h2> Update ${animal.name}</h2>Name:<br><input type="text" name="name" value="${animal.name}"><br>Species:<br><input type="text" name="species" value="${animal.species}"><br>Ferociousness:<br><input type="text" name="ferociousness" value="${animal.ferociousness}"><br>Hobby:<br><input type="text" name="hobby" value="${animal.hobby}"><br>Image:<br><input type="text" name="image" value="${animal.image}"><br><input type="submit" name="">`
      animalInfo.append(eForm)
      eForm.addEventListener('submit', (event) => updateAnimal(event, animal))
  }

  function updateAnimal(event, animal) {
    event.preventDefault();
    let updatedAnimal = gatherFormData()
    updateOnBackend(updatedAnimal, animal.id)
    .then(updateOnFrontEnd)
  }

  function updateOnBackend(updatedAnimal, id){
    console.log("fetch began")
    return fetch(`http://localhost:3000/animals/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updatedAnimal),
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(res => res.json())
}

  function updateOnFrontEnd(animal){
    console.log(`${animal.name} is being updated`)
    const animalSpan = animals.querySelector(`li[data-id="${animal.id}"]>span`)
    animalSpan.innerText = `${animal.name} the ${animal.species}` 
    console.log(`${animal.name} has been updated`)
  }

  /////// DELETE ///////
    function deleteAnimal(animal) {
    console.log(`${animal.name} is going away`)
    const animalLi = document.querySelector(`[data-id="${animal.id}"]`);
    const buttond = document.querySelector(`#delete-button-${animal.id}`);
    const buttonu = document.querySelector(`#update-button-${animal.id}`);

    return  fetch(`http://localhost:3000/animals/${animal.id}`, {
      method: "DELETE"
    })
    .then(response => response.json())
    .then(() => {
      animalLi.remove();
      buttond.remove()
      buttonu.remove()
    })
    .then(console.log(`${animal.name} is gone`))

  }
})
