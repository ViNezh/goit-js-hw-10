// Імпорт бібліотеки для HTTP запиту
import axios from 'axios';
// Передача ключа в усі запити
axios.defaults.headers.common['x-api-key'] =
  'live_iXXEdjF9QSB0p3CZpEzEqmCEEA1vWX5zCeyafK1rMJs8Zv6o4l9co7BV0kr9bXAJ';
// Базовий URL
const API_URL = 'https://api.thecatapi.com/v1';
// Імпорт посилань на розмітку html
import { refs } from '../index.js';
// Функція отриманя списку порід котів
function fetchBreeds() {
  // Показуємо завантажувач на час завантаження сторінки
  refs.loaderEl.classList.replace('is-hidden', 'loader');
  // Повертаємо результат запиту
  return axios.get(`${API_URL}/breeds`);
}
// Функція отримання даних вибраної породи
function fetchCatByBreed(breedId) {
  // На час виконання запиту показуємо завантажувач і ховаємо div.cat-info
  refs.loaderEl.classList.replace('is-hidden', 'loader');
  refs.catList.classList.add('is-hidden');
  // Повертаємо результат запиту
  return axios.get(`${API_URL}/images/search?breed_ids=${breedId}`);
}
// Іменований експорт функцій
export { fetchBreeds, fetchCatByBreed };
