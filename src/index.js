import { fetchImages } from './js/fetch-images';
import { createMarkup } from './js/render-gallery';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const target = document.querySelector('.js-guard');

let currentPage = 1;
let searchData = '';

searchForm.addEventListener('submit', handlerForm);

let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      currentPage += 1;
      fetchImages(searchData, currentPage)
        .then(resp => {
          const dataArray = resp.data.hits;
          gallery.insertAdjacentHTML('beforeend', createMarkup(dataArray));
          // const totalPages = Math.ceil(resp.data.totalHits / 40);

          // if (page > totalPages) {
          //   observer.unobserve();
          // }
        })
        .catch(error => console.log(error));
    }
  });
}

//Отримуємо результат вводу юзером
function handlerForm(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  searchData = evt.currentTarget.searchQuery.value;

  fetchImages(searchData, currentPage)
    .then(resp => {
      const dataArray = resp.data.hits;
      if (dataArray.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      gallery.insertAdjacentHTML('beforeend', createMarkup(dataArray));
      observer.observe(target);
    })
    .catch(error => console.log(error));
}
