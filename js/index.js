import toxic from '../assets/icons/toxic.svg';
import pet from '../assets/icons/pet.svg';
import lowSun from '../assets/icons/low-sun.svg';
import noSun from '../assets/icons/no-sun.svg';
import oneDrop from '../assets/icons/1-drop.svg';
import twoDrop from '../assets/icons/2-drops.svg';
import threeDrop from '../assets/icons/3-drops.svg';

const noResults = document.querySelector('#no__results');
const results = document.querySelector('#results');
const cards = document.querySelector('#cards');

class FormValue {
  constructor(selects) {
    this.params = { sun: '', water: '', pets: '' };
    this.selectElements = document.querySelectorAll(selects);

    this.changeEvent();
  }

  changeEvent() {
    this.selectElements.forEach(select => {
      select.addEventListener("change", (event) => this.setForm(event));
    })
  }

  deleteAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  getData(sun, water, pets) {
    fetch('https://front-br-challenges.web.app/api/v2/green-thumb/?' + new URLSearchParams({sun, water, pets}))
    .then(response => response.json())
    .then(data => {
      if (data) {
        results.style.display = "block";
        noResults.style.display = "none";

        this.deleteAllChildNodes(cards);

        const cardsHTML = data.map(card => {
          return `
            <div class="card" key=${card.id}>
              ${card.staff_favorite ? '<span>✨ Staff favorite</span>' : ''}
              <aside>
                <img src="${card.url}" alt="${card.name}">
              </aside>
              <div>
                <h3>${card.name}</h3>
                <span>
                  <p>$ ${card.price}</p>
                  <ul>
                    <li>
                      <img src="${card.toxicity ? toxic : pet}" alt="Pets" >
                    </li>
                    <li>
                      <img src="${card.sun === 'no' ? noSun : lowSun}" alt="Sun" >
                    </li>
                    <li>
                      <img src="${card.water === 'rarely' ? oneDrop : card.water === "regularly" ? twoDrop : threeDrop}" alt="Water" >
                    </li>
                  </ul>
                </span>
              </div>
            </div>
          `
        }).join("");

        cards.insertAdjacentHTML("afterbegin", cardsHTML);
      };
    }).catch(() => {
      results.style.display = "none";
      noResults.style.display = "flex";
    });
  }

  setForm(event) {
    this.params[event.target.name] = event.target.value;

    const { sun, water, pets } = this.params;

    if (sun && water && pets) {
      this.getData(sun, water, pets);
    }
  }
}

new FormValue('select');
