// import { fetchBreeds, fetchCatByBreed } from "./js/cat-api";
import './css/styles.css';
import { Report } from 'notiflix/build/notiflix-report-aio';
import SlimSelect from 'slim-select-with-styles';
import 'slim-select-with-styles/dist/slimselect.css';
import axios from 'axios';
axios.defaults.headers.common['x-api-key'] =
  'live_iXXEdjF9QSB0p3CZpEzEqmCEEA1vWX5zCeyafK1rMJs8Zv6o4l9co7BV0kr9bXAJ';

const API_URL = 'https://api.thecatapi.com/v1';
const API_KEY =
  'live_iXXEdjF9QSB0p3CZpEzEqmCEEA1vWX5zCeyafK1rMJs8Zv6o4l9co7BV0kr9bXAJ';
const refs = {
  selectEl: document.querySelector('.breed-select'),
  loaderEl: document.querySelector('.loader'),
  errorEl: document.querySelector('.error'),
  catList: document.querySelector('.cat-info'),
};
refs.selectEl.classList.add('is-hidden');
refs.errorEl.classList.add('is-hidden');
refs.catList.classList.add('is-hidden');
refs.loaderEl.classList.replace('loader', 'is-hidden');

function fetchBreeds() {
  refs.loaderEl.classList.replace('is-hidden', 'loader');
  return axios.get(`${API_URL}/breeds`);
  //   .then(resp => {
  //   if (!resp.ok) {
  //     throw new Error(resp.statusText)
  //   } return resp.json()
  // })
}
let breedsArr = [];
fetchBreeds()
  .then(breed => {
    refs.loaderEl.classList.replace('loader', 'is-hidden');
    refs.selectEl.classList.remove('is-hidden');
    breed.data.map(element =>
      breedsArr.push({ text: element.name, value: element.id })
    );
    breedsArr.unshift({ placeholder: true, text: 'Select a cat' });
    new SlimSelect({
      select: '.breed-select',
      data: breedsArr,
      settings: {
        showSearch: false,
        placeholderText: 'Select Value',
      },
    });
  })
  .catch(error => {
    refs.loaderEl.classList.replace('loader', 'is-hidden');
    Report.failure(
      'ERROR',
      'Oops! Something went wrong! Try reloading the page!',
      'Okay'
    );
  });
//
//
function fetchCatByBreed(breedId) {
  return axios.get(`${API_URL}/images/search?breed_ids=${breedId}`);
}

refs.selectEl.addEventListener('change', onSelected);

function onSelected(evt) {
  const ids = evt.currentTarget.value;
  fetchCatByBreed(ids).then(cat => {
    console.log(cat.data[0]);
    const { breeds, } = cat.data[0];
    const  url  = cat.data[0].url;
      console.log(url)  
        refs.catList.innerHTML = `<div class="box-img"><img src="${url}" alt="${breeds[0].name}" width="400"/></div><div class="box"><h1>${breeds[0].name}</h1><p>${breeds[0].description}</p><p><b>Temperament:</b> ${breeds[0].temperament}</p></div>`
        refs.catList.classList.remove('is-hidden');
  });
}

function createMarkup(arr) {
  if (arr.length) {
    return arr
      .map(({ url, breeds: { name, description, temperament } }) =>
        `<img src="${url}" alt="${name}" />
      <h2>${name}</h2>
      <h3>${description}</h3>
      <p>${temperament}</p>`
      )
      .join('');
  }
}
