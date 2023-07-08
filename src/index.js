import { fetchImages } from './js/fetch-images';
import { createMarkup } from './js/render-gallery';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const target = document.querySelector('.js-guard');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let searchData = '';
const perPage = 40;

//Реалізація infinite scroll
let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

searchForm.addEventListener('submit', handlerForm);

//Отримуємо результат вводу юзером
async function handlerForm(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  currentPage = 1;
  searchData = evt.currentTarget.searchQuery.value;
  observer.unobserve(target);

  try {
    const { data } = await fetchImages(searchData, currentPage);
    const dataArray = data.hits;

    if (dataArray.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        {
          timeout: 5000,
        }
      );
      return;
    }
    const totalHits = data.totalHits;
    if (totalHits !== 0) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    gallery.insertAdjacentHTML('beforeend', createMarkup(dataArray));
    lightbox.refresh();
    observer.observe(target);
  } catch (error) {
    Notiflix.Notify.failure(error.message);
    console.log(error);
  } finally {
    searchForm.reset();
  }
}

async function onLoad(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      currentPage += 1;
      try {
        const { data } = await fetchImages(searchData, currentPage);
        const dataArray = data.hits;
        gallery.insertAdjacentHTML('beforeend', createMarkup(dataArray));
        lightbox.refresh();

        //Перевірка. Якщо кількість сторінок дорівнює поточній сторінці, знімаємо observer
        let totalPages = Math.ceil(data.totalHits / perPage);

        if (currentPage === totalPages) {
          observer.unobserve(target);
          Notiflix.Notify.warning(
            "We're sorry, but you've reached the end of search results.",
            {
              timeout: 4000,
            }
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}

export { perPage };
