import { fetchImages } from './js/fetch-images';
import axios from 'axios';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', handlerForm);

//Отримуємо результат вводу юзером
function handlerForm(evt) {
  evt.preventDefault();
  const searchData = evt.currentTarget.searchQuery.value;

  fetchImages(searchData)
    .then(resp => {
      const dataArray = resp.data.hits;
      if (dataArray.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      gallery.innerHTML = createMarkup(dataArray);
    })
    .catch(error => console.log(error));
}

//Функція робить розмітку
function createMarkup(arr) {
  const markup = arr
    .map(
      ({
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');

  return markup;
}
