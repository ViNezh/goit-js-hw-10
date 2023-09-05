// Імпорт функцій обробки запитів
import { fetchBreeds, fetchCatByBreed } from './js/cat-api';
// Імпорт стилів
import './css/styles.css';
// Імпорт бібліотеки повідомлень
import { Report } from 'notiflix/build/notiflix-report-aio';
// Імпорт бібліотеки створення списку
import SlimSelect from 'slim-select-with-styles';
import 'slim-select-with-styles/dist/slimselect.css';

// Об'єкт посилань на елементи розмітки
export const refs = {
  selectEl: document.querySelector('.breed-select'),
  loaderEl: document.querySelector('.loader'),
  errorEl: document.querySelector('.error'),
  catList: document.querySelector('.cat-info'),
};
// Накладання стилів при завантаженні сторінки
refs.selectEl.classList.add('is-hidden');
refs.errorEl.classList.add('is-hidden');
refs.catList.classList.add('is-hidden');
refs.loaderEl.classList.replace('loader', 'is-hidden');
// Створюємо масив для зберігання списку порід
let breedsArr = [];
// Викликаємо функцію створення списку порід
fetchBreeds()
  .then(breed => {
    // Показуємо список і приховуємо анімацію завантаження
    refs.loaderEl.classList.replace('loader', 'is-hidden');
    refs.selectEl.classList.remove('is-hidden');
    // Наповнюємо масив списком порід
    breed.data.map(element =>
      breedsArr.push({ text: element.name, value: element.id })
    );
    // Додаємо placeholder до списку порід
    breedsArr.unshift({
      placeholder: true,
      text: 'Select the breed of the cat',
    });
    // Створюємо спписок порід на сторінці з отриманого масиву
    new SlimSelect({
      select: '.breed-select',
      data: breedsArr,
      settings: {
        showSearch: false,
      },
    });
    // Додаємо прослуховувач подій на елемент select
    refs.selectEl.addEventListener('change', onSelected);
  })
  // Обробка помилки
  .catch(error => {
    onErrorCath();
  });

//Обробка події вибору породи кота
function onSelected(evt) {
  // Отримаємо значення id вибраної породи
  const ids = evt.currentTarget.value;
  // Викликаємо функцію обробки запиту
  fetchCatByBreed(ids)
    .then(cat => {
      // З отриманого масиву вибираємо необхідні дані
      const { breeds } = cat.data[0];
      const url = cat.data[0].url;
      // Створюємо розміту з інформацією про кота
      refs.catList.innerHTML = `
      <div class="box-img"><img src="${url}" alt="${breeds[0].name}" width="400"/></div>
      <div class="box"><h2>${breeds[0].name}</h2>
      <p>${breeds[0].description}</p>
      <p><b>Temperament:</b> ${breeds[0].temperament}</p></div>`;
      // Приховуємо анімацію завантаження і показуємо інформацію про кота
      refs.catList.classList.remove('is-hidden');
      refs.loaderEl.classList.replace('loader', 'is-hidden');
    })
    // Обробка помилки
    .catch(error => {
      onErrorCath();
    });
}
// Функція обробки помилки запитів
function onErrorCath() {
  refs.loaderEl.classList.replace('loader', 'is-hidden');
  refs.selectEl.classList.add('is-hidden');
  Report.failure(
    'ERROR',
    'Oops! Something went wrong! Try reloading the page!',
    'Okay'
  );
  const errBTN = document.querySelector('.notiflix-report-button');
  errBTN.addEventListener('click', evt => {
    location.reload();
  });
}
