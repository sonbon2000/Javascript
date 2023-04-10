const inputName = document.querySelector("#name");
const inputFeetHeight = document.querySelector("#feet");
const inputInchesHeight = document.querySelector("#inches");
const inputWeight = document.querySelector("#weight");
const inputDiet = document.querySelector("#diet");
const form = document.querySelector("#dino-compare");
const compareButton = document.querySelector("#btn");
const grid = document.querySelector("#grid");

// Get data from Dino.json
const getDinoData = async () => {
  const dinoJson = await fetch("./dino.json");
  const data = await dinoJson.json();
  const newDinoArr = data.Dinos.map((dino) => {
    let { species, weight, height, diet, where, when, fact } = dino;
    return new Dino(species, weight, height, diet, where, when, fact);
  });
  generateTile(newDinoArr);
};

// Create Dino Constructor
function Dino(species, weight, height, diet, where, when, fact) {
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.where = where;
  this.when = when;
  this.fact = fact;
}

// Create Dino Objects
const dino = new Dino();

// Create Human Constructor
function Human(name, height, weight, diet) {
  this.species = name;
  this.height = height;
  this.weight = weight;
  this.diet = diet;
}

// Create Human Objects
const human = new Human();

// Use IIFE to get human data from form
const getHumanData = (function () {
  function getData() {
    human.species = inputName.value;
    human.height =
      parseInt(inputFeetHeight.value) * 12 + parseInt(inputInchesHeight.value);
    human.weight = inputWeight.value;
    human.diet = inputDiet.value.toLowerCase();
  }
  return {
    human: getData,
  };
})();

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareWeight = (fact) => {
  if (dino.weight > human.weight) {
    dino.fact = `${dino.species} is ${
      dino.weight - human.weight
    } lbs heavier than ${human.species}`;
    return dino.fact;
  } else {
    dino.fact = `${dino.species} is ${human.weight - dino.weight} `;
    return dino.fact;
  }
};
// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareHeight = (fact) => {
  if (dino.height > human.height) {
    dino.fact = `${dino.species} 
            is ${dino.height - human.height} inches taller than ${
      human.species
    }`;
    return dino.fact;
  } else {
    dino.fact = `${dino.species} 
            is ${human.height - dino.height} inches smaller than ${
      human.species
    }`;
    return dino.fact;
  }
};
// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareDiet = (fact) => {
  if (human.diet === dino.diet) {
    dino.fact = `${dino.species} 
            is ${dino.diet} like ${human.species}`;
    return dino.fact;
  } else {
    dino.fact = `${dino.species} 
            is ${dino.diet} but ${human.species} is ${human.diet} `;
    return dino.fact;
  }
};

// Generate Tiles for each Dino in Array
const generateTile = (dinosArr) => {
  let updatedDino = [];

  // Workaround for a fixed dinos_array length
  const sifterArr = [1, 1, 1, 0, 0, 0, 0];
  // Shuffle sifter array to later use it to randomize compare methods.
  shuffle(sifterArr);
  //Getting Pigeon position and adding to sifterArr in order to keep it fact property.
  let pigeonIndex = dinosArr.findIndex((dino) => dino.species === "Pigeon");
  sifterArr.splice(pigeonIndex, 0, 0);
  dinosArr.forEach((dinoArrItem, i) => {
    // Assign fetched array properties to global array properties.
    dino.species = dinoArrItem.species;
    dino.height = dinoArrItem.height;
    dino.weight = dinoArrItem.weight;
    dino.diet = dinoArrItem.diet;
    if (sifterArr[i]) {
      let randomNumber = Math.floor(Math.random() * 3) + 1;
      if (dinoArrItem instanceof Human) {
        randomNumber = "";
      }
      switch (randomNumber) {
        case 1:
          dino.compareHeight(dinoArrItem.fact);
          break;
        case 2:
          dino.compareWeight(dinoArrItem.fact);
          break;
        case 3:
          dino.compareDiet(dinoArrItem.fact);
          break;
        default:
          break;
      }
    } else {
      dino.fact = dinoArrItem.fact;
    }

    updatedDino.push(JSON.parse(JSON.stringify(dino)));
  });
  // Adding human object in the middle
  updatedDino.splice(4, 0, human);
  updatedDino.forEach((dinoItem) => {
    addTileToDOM(dinoItem);
  });
};

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

// Add tiles to DOM
const addTileToDOM = (dinoItem) => {
  const div = document.createElement("div");
  div.className = "grid-item";
  const h3 = document.createElement("h3");
  const img = document.createElement("img");
  const p = document.createElement("p");

  if (dinoItem instanceof Human) {
    img.src = "./images/human.png";
  } else {
    dinoItem.species = dinoItem.species.toLowerCase();
    img.src = `./images/${dinoItem.species}.png`;
  }
  h3.textContent = dinoItem.species;
  p.textContent = dinoItem.fact;

  div.appendChild(h3);
  div.appendChild(img);
  div.appendChild(p);
  grid.appendChild(div);
};

// Remove form from screen
const removeForm = () => {
  form.style.display = "none";
};
// On button click, prepare and display infographic
const compareDino = () => {
  getDinoData();
  getHumanData.human();
  removeForm();
};
compareButton.addEventListener("click", compareDino);
