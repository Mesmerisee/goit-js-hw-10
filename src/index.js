import axios from 'axios';
import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';

axios.defaults.headers.common['x-api-key'] =
  'live_okmWjlPQraN2FlD4CY0d0Iio3kXETEADDn1HMjyPzuB7eUsCruSFCt29xi0YOjia';
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');
const breedSelect = new SlimSelect('.breed-select');

function fetchBreeds() {
  breedSelect.disable();
  error.classList.add('is-hidden');
  loader.classList.remove('is-hidden');

  return fetch('https://api.thecatapi.com/v1/breeds', {
    headers: {
      'x-api-key': 'live_okmWjlPQraN2FlD4CY0d0Iio3kXETEADDn1HMjyPzuB7eUsCruSFCt29xi0YOjia'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch breeds (${response.status})`);
      }

      return response.json();
    })
    .catch(error => {
      error.classList.remove('is-hidden');
      Notiflix.Notify.failure(`Failed to fetch breeds (${error.message})`);
      throw new Error(`Failed to fetch breeds (${error.message})`);
    })
    .finally(() => {
      loader.classList.add('is-hidden');
      breedSelect.enable();
    });
}

function fetchCatByBreed(breedId) {
  catInfo.classList.add('is-hidden');
  error.classList.add('is-hidden');
  loader.classList.remove('is-hidden');

  return fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`, {
    headers: {
      'x-api-key': 'live_okmWjlPQraN2FlD4CY0d0Iio3kXETEADDn1HMjyPzuB7eUsCruSFCt29xi0YOjia'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch cat information (${response.status})`);
      }

      return response.json();
    })
    .catch(error => {
      error.classList.remove('is-hidden');
      Notiflix.Notify.failure(`Failed to fetch cat information (${error.message})`);
      throw new Error(`Failed to fetch cat information (${error.message})`);
    })
    .finally(() => {
      loader.classList.add('is-hidden');
    });
}

breedSelect.slim.on('change', () => {
  const breedId = breedSelect.selected();
  if (breedId) {
    try {
      const catData = fetchCatByBreed(breedId);
      const cat = catData[0];
      const catInfo = document.querySelector('.cat-info');
      catInfo.innerHTML = `
        <h3>${cat.breeds[0].name}</h3>
        <p>Description: ${cat.breeds[0].description}</p>
        <p>Temperament: ${cat.breeds[0].temperament}</p>
        <img src="${cat.url}" alt="Cat">
      `;
    } catch (error) {
      console.error(error);
    }
  }
});