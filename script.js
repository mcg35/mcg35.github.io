/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  let coffeeCounter = document.querySelector('#coffee_counter');
  coffeeCounter.innerText = coffeeQty;
}

function clickCoffee(data) {
  data.coffee++;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  for (i = 0; i < producers.length; i++) {
    if (coffeeCount >= (producers[i].price/2)) {
      producers[i].unlocked = true;
    }
  }
}

function getUnlockedProducers(data) {
  let res = [];
  for (i=0; i < data.producers.length; i++) {
    if (data.producers[i].unlocked === true) {
      res.push(data.producers[i]);
    }
  }
  return res;
}

function makeDisplayNameFromId(id) {
  let res = id
  .split("_")
  .map((x)=> (x.charAt(0).toUpperCase() + x.slice(1)))
  .join(" ");
  return res;
}

// You shouldn't need to edit this function-- its tests should pass once 
// you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  let container = document.querySelector('#producer_container');
  unlockProducers(data.producers, data.coffee);
  let unlockedProducers = getUnlockedProducers(data);
  deleteAllChildNodes(container);
  unlockedProducers.forEach(producer => container.appendChild(makeProducerDiv(producer)));
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  let returnObj;
  data.producers.forEach(producer => {
    if (producer.id===producerId) {
      returnObj = producer;
    }
  });
  return returnObj;
}

function canAffordProducer(data, producerId) {
  let producer = getProducerById(data, producerId);
  if (data.coffee >= producer.price) {
    return true;
  }
  else {
    return false;
  }
}

function updateCPSView(cps) {
  let cpsSpan = document.querySelector('#cps');
  cpsSpan.innerText = cps;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  let producer = getProducerById(data, producerId);
  if (data.coffee < producer.price) {
    return false;
  }
  else {
    producer.qty++;
    data.coffee -= producer.price;
    producer.price = updatePrice(producer.price);
    data.totalCPS += producer.cps;
    updateCPSView(data.totalCPS);
    return true;
  }
}

function buyButtonClick(event, data) {
  if (event.target.tagName!='BUTTON') {
    return;
  }
  else {
    let producerId = event.target.id.slice(4);
    let producer = getProducerById(data, producerId);
    let affordable = canAffordProducer(data, producerId);
    if (!affordable) {
      window.alert("Not enough coffee!");
    }
    else {
      
      attemptToBuyProducer(data, producerId);
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    }
  }
}

function tick(data) {
  data.coffee+=data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);

}

function save(data) {
  if(data.coffee!=0) {
    localStorage.setItem("data", JSON.stringify(data));
  }
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  let data = window.data;
  if (localStorage.getItem("data")!=='undefined') {
    data = JSON.parse(localStorage.getItem("data"));
    updateCPSView(data.totalCPS);
  }


  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);

  setInterval(() => save(data), 5000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
