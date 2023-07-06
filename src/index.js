import { fetchImages } from './js/fetch-images';
import { createMarkup } from './js/render-gallery';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const target = document.querySelector('.js-guard');

let currentPage = 1;
let searchData = '';

//Реалізація infinite scroll
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

          //Перевірка. Якщо кількість сторінок дорівнює поточній сторінці, знімаємо observer
          const totalPages = Math.ceil(
            resp.data.totalHits / resp.data.hits.length
          );
          if (currentPage === totalPages) {
            observer.unobserve(target);
            Notiflix.Notify.warning(
              "We're sorry, but you've reached the end of search results.",
              {
                timeout: 4000,
              }
            );
          }
        })
        .catch(error => console.log(error));
    }
  });
}

searchForm.addEventListener('submit', handlerForm);

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
          'Sorry, there are no images matching your search query. Please try again.',
          {
            timeout: 5000,
          }
        );
      }
      const totalHits = resp.data.totalHits;
      if (totalHits !== 0) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }

      gallery.insertAdjacentHTML('beforeend', createMarkup(dataArray));
      observer.observe(target);
    })
    .catch(error => {
      Notiflix.Notify.failure(error.message);
      console.log(error);
    });
}
