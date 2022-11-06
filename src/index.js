import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm"

let getEl = selector => document.querySelector(selector);

const API_KEY = '31043334-d435e709e031a3a5e6d394209';
const input = getEl('input');
const form = getEl('.search-form');
const gallery = getEl('.gallery');
const loadMoreButton = getEl('.load-more');
let pageAmount = 1;


document.querySelectorAll('.header-heading-letters').forEach(el => el.style.color = getRandomHexColor());

const submitFunction=()=> {
  event.preventDefault();
  gallery.innerHTML = ''; 
  page = 1;
  mamaFunction().then(result => {
    pageAmount = Math.floor(result.totalHits / 40);
    console.log(pageAmount);
    if (page > pageAmount) { loadMoreButton.classList.add('hidden') };
    if (result.totalHits > 0) { Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`) };    
    if (result.totalHits > 40) { loadMoreButton.classList.remove('hidden') };
  }).catch(error => console.error(error));
}

const loadMoreFunction = () => {
  page += 1;
  if (page > pageAmount) { loadMoreButton.classList.add('hidden');Notiflix.Notify.info("We're sorry, but you've reached the end of search results.") };
  mamaFunction();   
}
function mamaFunction() {
   return fetchImage(input.value).then(image => renderImages(image));
  
 
  
}
form.addEventListener('submit', submitFunction);

loadMoreButton.addEventListener('click', loadMoreFunction);

function fetchImage(link) {
   return fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${input.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`)
      .then(
    (response) => {        
           
         return response.json();
    }
  )
}
function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function renderImages(image) {
  if (image.totalHits > 0) {   
   
    const markup = image.hits
      .map((im) => `<a class='image-card' style="background-color:${getRandomHexColor()}" href="${im.largeImageURL}">
   <img class='img' src='${im.webformatURL}' loading="lazy"title="${im.tags}" alt='${im.tags}' width='260' height='200'>
   <div class="text-content">
    <div class="text-elements">
      <p style="color:${getRandomHexColor()}" class="heading">likes</p> 
      <p style="color:${getRandomHexColor()}" class="text">${im.likes}</p>
    </div>
    <div class="text-elements">
      <p style="color:${getRandomHexColor()}"  class="heading">views</p> 
      <p style="color:${getRandomHexColor()}"  class="text">${im.views}</p>
    </div>
    <div class="text-elements">
      <p style="color:${getRandomHexColor()}"  class="heading">comments</p> 
      <p style="color:${getRandomHexColor()}"  class="text">${im.comments}</p>
    </div>
    <div class="text-elements">
      <p style="color:${getRandomHexColor()}"  class="heading">downloads</p> 
      <p style="color:${getRandomHexColor()}"  class="text">${im.downloads}</p>
    </div>  
  </div>
   </a>`).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  new SimpleLightbox('.gallery a', {
	captionDelay: 250
  })
  }
  else { loadMoreButton.classList.add('hidden'); Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.") }
  return image
   
}

