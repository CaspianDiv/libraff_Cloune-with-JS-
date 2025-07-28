import { getAllBooks, getBooksSliders, getCategs } from "./service.js";


let booksData = [];
let slideData = [];

// Kitabları yükləmə funksiyası
async function getBooksData() {
  try {
    booksData = await getAllBooks();

    const sortedBooks = [...booksData].sort((a,b) => (b.stockCount || 0) + (a.stockCount || 0));
    //////////// Həftənin ən çox baxılan kitablarını ekrana çıxaran funksiya 
    
    popularWeekBooks();
    ////////////////// İlk 12 kitabın göstərilməsi 
    displayPopularBooks(sortedBooks); 
    printAprilBestSellers();
    libraffPrintBook();
 
  } catch (error) {
    console.error("Kitab məlumatlarını yükləyərkən xəta:", error);
  }
}
getBooksData();


// //////////////////////////// Dəyişənləri təyin edirik
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const userIcon = document.getElementById("userIcon");
const dropDownIcon = document.getElementById("dropDownIcon");
let isOpen = false;
const sideBar = document.getElementById("sideBar");
const logDiv = document.getElementById("logDiv");
const outset = document.getElementById("outset");
const popUp = document.getElementById("popUp");
const categSec = document.getElementById("categSec");
const subCatSec = document.getElementById("subCatSec");
const subSubCatSec = document.getElementById("subSubCatSec");
const slide = document.querySelector(".swiper-wrapper");
const weekBooks = document.querySelector("#weekBooks");
const popularBooks = document.querySelector("#popularBooks");
const aprilBooksBestSellers = document.querySelector("#aprilBooksBestSellers");
const libraffSelection = document.querySelector("#libraffSelection");

//// // // //  Side Barın çıxması
menuBtn.addEventListener("click", () => {
  sideBar.classList.remove("-translate-x-full");
});

////////////////////////  Side Barın bağlanması
closeBtn.addEventListener("click", () => {
  sideBar.classList.add("-translate-x-full");
});

// Ana ekrana qayıtmaq üçün fuksiya 
window.goMainPage = function() {
  location.href = "../index.htm"
}

//// // // // // // // // // // // User Iconun rəngin dəyişməsi

dropDownIcon.onclick = function () {
    isOpen = !isOpen;

    if (isOpen) {
        userIcon.classList.add("text-red-600");
        dropDownIcon.classList.remove("fa-caret-down");
        dropDownIcon.classList.add("fa-angle-up");
        logDiv.classList.remove("hidden");
    } else {
        userIcon.classList.remove("text-red-600");
        userIcon.classList.add("text-black");
        dropDownIcon.classList.remove("fa-angle-up");
        dropDownIcon.classList.add("fa-caret-down");
        logDiv.classList.add("hidden");
    }
};

////////////// Placeholder Animasiyası

document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll('input[placeholder*="Növbəti kitabınızı axtarın"]');
    const text = "Növbəti kitabınızı axtarın";

    inputs.forEach(input => {
        let i = text.length;
        let direction = -1;

        setInterval(() => {
            i += direction;

            if (i <= 0) direction = 1;
            if (i >= text.length) direction = -1;

            input.placeholder = text.substring(0, i);
        }, 150);
    });
});

// Sliderə Şəkillərin çapı 

async function getSlidersData(){
  try {
    slideData = await getBooksSliders();
    printSliders();
  } catch (error) {
      console.error("Slider məlumatlarını yükləyən zaman xəta baş verdi", error);
  };
};


function printSliders() {
  if (!slide) {
    console.error("swiper-wrapper elementi tapılmadı" ,error);
    return
  };

  if (!Array.isArray(slideData) || slide.length === 0) {
      console.log("Slides elementi tapılmadı və ya boşdur");
      return
  }; 

  slide.innerHTML = "";

  slideData.forEach(item => {
      const slideElement = document.createElement("div");
      slideElement.className = "swiper-slide";

      if (item && item.img) {
          slideElement.innerHTML = `<img src="${item.img}"  alt="Sliders Img Libraff" />`
      }else {
        slideElement.innerHTML = `<div class="flex justify-center items-center text-center bg-gray-200">Şəkil Tapılmadı</div>`
      };

      slide.appendChild(slideElement);
  })
};
getSlidersData();
// Bütün axtarış qutuların seçilməsi 

 const searchInps = document.querySelectorAll('input[placeholder*="Növbəti kitabınızı axtarın"]');
////////// Axtarış qutuları üçün hadisə əlavə olunması 

searchInps.forEach(input => {
    input.addEventListener("input" , (e) => {
        const searchVal = e.target.value.toLowerCase();
        filteredAndDisplayBooks(searchVal);
    });
}); 


// Kitabları axtarış mətninə və stok sayına uyğun filterləyən funksiya 

function filteredAndDisplayBooks(searchText) {
    console.log("Axtarış mətni" ,searchText);
    

    if(!Array.isArray(booksData) || booksData.length == 0){
        console.warn("Kitab məlumatları yüklənməyib");
        return;
    };  

    // Əgər axtarış mətni boşdursa 

    if(!searchText) {
        const mostStockedBooks = [...booksData]
        .sort((a,b) => (b.stockCount || 0) - (a.stockCount || 0))
        .slice(0,12);

        console.log("Stok sayına görə sıralanan kitablar:" , mostStockedBooks);

        displayBooks(mostStockedBooks);
        return;
    };  

    // Kitabların ada görə filterlənib və stok sayına uyğun yığılması 
    
    const filteredBooks = booksData
    .filter(book => {
      ////////// Kitab adı müəllif adına görə axtarış 
      return(
        (book.name && book.name.toLowerCase().includes(searchText)) || 
        (book.author && book.author.toLowerCase().includes(searchText))
      );
    })
    .sort((a,b) => (b.stockCount || 0) - (a.stockCount || 0))
    .slice(0,12);
    
    console.log("Filterlənmiş kitablar:" ,filteredBooks);

    // Filterlənmiş kitabları göstəririk

    displayBooks(filteredBooks)
};

// Ən populyar kitabları göstərmək üçün funksiya stok sayına görə 

function displayPopularBooks(books) {
    if(!Array.isArray(books) || books.length === 0){
        console.warn("Kitab məlumatları yüklənməyib");
        return;
    };

    // Stok sayına görə azalan şəkildə sıralanması və 12 sinin ekrana çıxardılması

    const popularBooks = books.slice(0,12);
    displayBooks(popularBooks);
};  





window.addBasket = function(id) {
  const basketElement = booksData.find(item => item.id == id);
  const basketList = JSON.parse(localStorage.getItem("basketList")) || [];
  basketList.push(basketElement);
  localStorage.setItem('basketList', JSON.stringify(basketList));
  basketBadge.innerHTML = basketList.length
};


window.addFav = function(id) {
  const favList = JSON.parse(localStorage.getItem('favList')) || [];
  const favElement = booksData.find(item => item.id == id);
  const heartIcon = document.querySelector(`[onclick="addFav('${id}')"] img`);
  
  // Favorilərdə olduğunu yoxlamaq 
  
  const existingIndex = favList.findIndex(item => item.id == id);
  
  if (existingIndex !== -1) {
    // Artıq var silinsin 

    favList.splice(existingIndex, 1);
    heartIcon.style.filter = 'none'; // Normal ürək 
  } else {
    // Yoxdusa əlavə olunsun 
    
    favList.push(favElement);
    heartIcon.style.filter = 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)'; // Qırmızı ürək 
  };
  
  localStorage.setItem('favList', JSON.stringify(favList));
  favBadge.innerHTML = favList.length;
};

// Səhifə yüklənəndə heart Iconların yenilənməsi  

function updateHeartIcons() {
  const favList = JSON.parse(localStorage.getItem('favList')) || [];

  favList.forEach(favBook => {
  const heartIcon = document.querySelector(`[onclick="addFav('${favBook.id}')"] img`);
      if (heartIcon) {
          heartIcon.style.filter = 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)'; /// Qırmızı ürək 
      };
  });
};

window.addEventListener("DOMContentLoaded", function(){
  updateBadgesFromStorage()
});

function updateBadgesFromStorage(){
  const basketList = JSON.parse(localStorage.getItem("basketList")) || [];
  const basketBadge = document.getElementById("basketBadge");
  basketBadge.innerHTML = basketList.length;
  const favList = JSON.parse(localStorage.getItem("favList")) || [];
  const favBadge = document.getElementById("favBadge");
  favBadge.innerHTML = favList.length;
}

// Kitabları ekranda göstərmək üçün funksiya 

function displayBooks(books) {
  if(!popularBooks){
      console.error("popularBooks elementi tapılmadı");
      return;
  };

  popularBooks.innerHTML  = "";

  if (!Array.isArray(books) || books.length === 0) {
      popularBooks.innerHTML = `<div class="text-center w-full text-[#767682] py-10 font-semibold">
          <p>Kitab Tapılmadı</p>
      </div>`;
      return;
  };

  books.forEach(book => {
      try {
        // Kitab qiymətlərinin formatı 
        let price = "Qiymət göstərilməyib";

        if (book.price) {
            // Qiymət formatını düzəldirik
            price = `${book.price} AZN`;
        };

              
            let originalPrice = parseFloat(book.price);
            let discountPercentage = 20;

            // Qiymət dəyəri mövcud və düzgündürsə , endirim tətbiq ediləcək

            let discountPrice = "N/A";
            if (!isNaN(originalPrice)) {
                discountPrice = (originalPrice - (originalPrice * discountPercentage / 100)).toFixed(2);
          };

        
        // Endirim hesablama
        

        // Stok məlumatı 
        const stockText = book.stockCount > 0 ? `Stokda: ${book.stockCount}` : "Stokda yoxdur bitib";

        // Müəllif adının təmizlənməsi 

        const author = book.author || "Müəllif göstərilməyib";

        const bookCard = document.createElement("div");
        bookCard.className = "w-64 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer book-card";
        bookCard.innerHTML = `
        <div class="relative">
          <div onclick="addFav('${book.id}')" class="absolute right-5 top-5 hidden heart-icon">
                  <img src="../assets/img/heart.png" id="imgSrc" class="w-5" />
          </div>
              <img src="${book.img}" alt="${book.name}" class="object-cover w-full" />
        </div>
          <div class="p-4">
                <a href="../HTML/details.htm?id=${book.id}" class="font-semibold hover:underline text-lg mb-1 truncate" title="${book.name}">${book.name}</a>
                <p class="tetx-gray-600 text-sm mb-2 title="author"">${book.author}</p>
                <div>
                    <button onclick="addBasket('${book.id}')" class="bg-[#ef3340] text-white px-3 py-1 rounded-full  text-sm hover:bg-red-700 transition-colors">Səbətə at</button>
                </div>
              <div class="py-5">
                <span class="font-semibold text-black px-2">${!isNaN(parseFloat(discountPrice)) ? discountPrice + "₼" : "N/A"}</span>
                <span class="text-gray-400 line-through">${!isNaN(originalPrice) ? originalPrice + "₼" : "N/A"}</span>
            </div>
                <p class="text-xs text-gray-500 mt-2">${stockText}</p>
          </div>
        `
            const bookCards = document.querySelectorAll('.book-card');
    
    bookCards.forEach(card => {
        // Hover zamanı heart ikonunu göstərmək
        card.addEventListener('mouseover', function() {
            const heartIcon = this.querySelector('.heart-icon');
            if (heartIcon) {
                heartIcon.classList.remove('hidden');
            };
        });
        
        // Mouse çıxdıqda heart ikonunu gizlətmək
        card.addEventListener('mouseleave', function() {
            const heartIcon = this.querySelector('.heart-icon');
            if (heartIcon) {
                heartIcon.classList.add('hidden');
            }
        });
    });

        popularBooks.appendChild(bookCard);
      } catch (error) {
        console.error("Kitab kartını yardarkən xəta baş verdi: ", error,book);
      };  
  });
  updateHeartIcons()
};

// Həftənin ən çox baxılanlan kitabların ekrana çıxarılması 

function popularWeekBooks() {
    try {
        const mostStockedBooks = [...booksData]
      .sort((a, b) => (b.stockCount || 0) - (a.stockCount || 0))
      .slice(0, 12);



    
    mostStockedBooks.forEach(book => {

      let originalPrice = parseFloat(book.price);
      let discountPercentage = 20;

      // Qiymət dəyəri mövcud və düzgündürsə , endirim tətbiq ediləcək

      let discountPrice = "N/A";
      if (!isNaN(originalPrice)) {
          discountPrice = (originalPrice - (originalPrice * discountPercentage / 100)).toFixed(2);
      };
        weekBooks.innerHTML += `
         <div class="w-60 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer book-card">
          <div class="relative">
          <div onclick="addFav('${book.id}')" class="absolute right-5 top-5 hidden heart-icon">
                  <img src="../assets/img/heart.png" class="w-5" />
              </div>
          </div>
            <img src="${book.img}" alt=""  class="object-cover w-full rounded-t-md"/>
          <div class="flex flex-col justify-between  space-y-5 py-5 px-5">
            <div class="space-y-2">
              <a href="../HTML/details.htm?id=${book.id}"  class="text-lg font-semibold hover:underline">${book.name}</a>
            </div>
            <button class="bg-[#ef3340] w-32 text-white px-3 py-1 rounded-full  text-sm hover:bg-red-700 transition-colors">Səbətə at</button>
            <div class="py-5">
                <span class="font-semibold text-black px-2">${!isNaN(parseFloat(discountPrice)) ? discountPrice + "₼" : "N/A"}</span>
                <span class="text-gray-400 line-through">${!isNaN(originalPrice) ? originalPrice + "₼" : "N/A"}</span>
            </div>
          </div>
      </div>
        `
      })
         const bookCards = document.querySelectorAll('.book-card');
    
    bookCards.forEach(card => {
        // Hover zamanı heart ikonunu göstərmək
        card.addEventListener('mouseover', function() {
            const heartIcon = this.querySelector('.heart-icon');
            if (heartIcon) {
                heartIcon.classList.remove('hidden');
            }
        });
        
        // Mouse çıxdıqda heart ikonunu gizlətmək
        card.addEventListener('mouseleave', function() {
            const heartIcon = this.querySelector('.heart-icon');
            if (heartIcon) {
                heartIcon.classList.add('hidden');
            }
        });
    });
    } catch (error) {
      console.error(error.message);
    };
    updateHeartIcons()
};



//////////////////// Aprel Ayının ən çox satanları kitabların ekrana çıxarılıması

function printAprilBestSellers() {
  try {
    const aprilBestellersBooks = [...booksData].sort((a,b) => (a.stockCount || 0) + (b.stockCount || 0)).slice(0,10)


    aprilBestellersBooks.forEach(book => {

     // Kitab qiymətlərinin formatı 
        let price = "Qiymət göstərilməyib";

        if (book.price) {
            // Qiymət formatını düzəldirik
            price = `${book.price} AZN`;
        };

              
            let originalPrice = parseFloat(book.price);
            let discountPercentage = 20;

            // Qiymət dəyəri mövcud və düzgündürsə , endirim tətbiq ediləcək

            let discountPrice = "N/A";
            if (!isNaN(originalPrice)) {
                discountPrice = (originalPrice - (originalPrice * discountPercentage / 100)).toFixed(2);
          };

        
        // Endirim hesablama
        

        // Stok məlumatı 
        const stockText = book.stockCount > 0 ? `Stokda: ${book.stockCount}` : "Stokda yoxdur bitib";

        // Müəllif adının təmizlənməsi 

        const author = book.author || "Müəllif göstərilməyib";

        const aprilBookCard = document.createElement("div");
        aprilBookCard.className = "w-60 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer book-card";
        aprilBookCard.innerHTML = `
          <div class="relative">
                  <div onclick="addFav('${book.id}')" class="absolute top-5 right-5">
                      <img src="../assets/img/heart.png" class="heart-icon hidden w-[20px]" />
                  </div>
                  <img src="${book.img}" alt="${book.name}" class="object-cover rounded-xl w-full" />
          </div>
          <div class="p-4">
                <a href="../HTML/details.htm?id=${book.id}"  class="font-semibold text-lg mb-1 hover:underline" title="${book.name}">${book.name}</a>
                <p class="tetx-gray-600 text-sm mb-2 title="author"">${book.author}</p>
                <div>
                    <button  class="bg-[#ef3340] text-white px-3 py-1 rounded-full  text-sm hover:bg-red-700 transition-colors">Səbətə at</button>
                </div>
              <div class="py-5">
                <span class="font-semibold text-black px-2">${!isNaN(parseFloat(discountPrice)) ? discountPrice + "₼" : "N/A"}</span>
                <span class="text-gray-400 line-through">${!isNaN(originalPrice) ? originalPrice + "₼" : "N/A"}</span>
            </div>
                <p class="text-xs text-gray-500 mt-2">${stockText}</p>
          </div>
        `
      const bookCards = document.querySelectorAll('.book-card');
    
    bookCards.forEach(card => {
        // Hover zamanı heart ikonunu göstərmək
        card.addEventListener('mouseover', function() {
            const heartIcon = this.querySelector('.heart-icon');
            if (heartIcon) {
                heartIcon.classList.remove('hidden');
            }
        });
        
        // Mouse çıxdıqda heart ikonunu gizlətmək
        card.addEventListener('mouseleave', function() {
            const heartIcon = this.querySelector('.heart-icon');
            if (heartIcon) {
                heartIcon.classList.add('hidden');
            }
        });
    });



        aprilBooksBestSellers.appendChild(aprilBookCard);
    });
  } catch (error) {
    console.error(error);
  };
    updateHeartIcons();
};

//////////// Libraffın seçimləri olan 4 kitabın filtrasiyası və ekrana çıxarılması 

function libraffPrintBook() { 
  try {
    //////////////// Libraff seçiməri üçün kitab adları 
     const libraffBookNames = ["Poetik diaqnoz", "Metanoya" , "Stoiklərin həyatı" , "Paralel dünyada. Birinci hissə - Ağ, çəhrayı və narıncı" ];

    //////////////// Bu adlardan birini ehtiva edən kitabların filterlənməsi 
    
    const libraffBooks = booksData.filter(book => {
      return libraffBookNames.some(bookName => 
        book.name && book.name.includes(bookName)
      );
    });

    libraffBooks.forEach(book => {
        libraffSelection.innerHTML += `
        <div class="w-[23%]  rounded-[25%] shadow-md cursor-pointer">
               <a href="../HTML/details.htm?id=${book.id}">
                   <img src="${book.img}" alt="${book.name}" title="${book.name}" class="object-cover bg-cover w-[100%] h-[70dvh]  rounded-md  dark:bg-gray-500" />
               </a>
        </div>
        `
    })
  } catch (error) {
    console.log(error);
  }; 
  };

////////////////// Kateqoriya Div-nin açılıb bağlanması funksiyası 

window.handlePopup = function(status) {
  outset.style.display = status ? "block" : "none";
};

outset.addEventListener("click" , (e) => {
    if (!popUp.contains(e.target)) {
          outset.style.display = "none";
    };
});

//// // // // // // // // //  Kateqoriyaların ekrana çapı
let catData = [];
async function printCateg() {

  // Əvvəlki məlumatların təmizlənməsi 

  categSec.innerHTML = "";
   catData = await getCategs();

    catData.forEach(book => {
        categSec.innerHTML += `
          <li onmouseover="printSub('${book.name}')"  class="category cursor-pointer">
              <p class="flex  justify-between items-center px-2 py-2 text-xs font-semibold">${book.name} <i class="fa-solid fa-angle-right"></i></p>
          </li>
        `
    });
};
printCateg();

window.printSub = function(sub){

  // Əvvəlki məlumatların təmizlənməsi 

    subCatSec.innerHTML = "";
    subSubCatSec.innerHTML = "";

    const obj = catData.find(item => item.name == sub);
    console.log(obj);
    obj.subCateg.forEach(item => {
        subCatSec.innerHTML += `
            <li onmouseover="printSubSub('${sub}','${item.name}')" class="category cursor-pointer">
              <p class="flex  justify-between items-center px-2 py-2 text-xs font-semibold">${item.name}<i class="fa-solid fa-angle-right"></i></p>
          </li>
        `
    })
};


window.printSubSub = function(sub,subSub) {

    // Əvvəlki məlumatların təmizlənməsi 
    
    subSubCatSec.innerHTML = "";
    const obj = catData.find(item => item.name == sub); 
    const subObj = obj.subCateg.find(item => item.name == subSub);

        subObj.subCateg.forEach(item => {
        subSubCatSec.innerHTML += `
            <li class="category cursor-pointer">
              <p class="flex  justify-between items-center px-2 py-2 text-xs font-semibold">${item}<i class="fa-solid fa-angle-right"></i></p>
          </li>
        `
    })
};    

popUp.addEventListener("mousedown", (e) => {
        if (!subCatSec.contains(e.target)) {
          subSubCatSec.innerHTML = "";
    };
});

////////////////////// Page Up Funksiyası 

window.pagUp = function() {
    window.scrollTo({
      behavior: "smooth",
      top: 0
    });
};  

//////////// Teas Press Nəşriyyatı üçün Slider Funkisyası 
 let currentSlide = 0;
 const carouselItems = document.querySelector('.carousel-items');
 const totalItems = document.querySelectorAll('.carousel-item').length;
 

 function updateCarousel() {
  carouselItems.style.transform = `translateX(${-currentSlide * 120}px)`; // 220 is item width + margin
 };


 window.nextSlide = function() {
  currentSlide = (currentSlide + 1) % totalItems;
  updateCarousel();
 }
 

 window.prevSlide = function() {
currentSlide = (currentSlide  - 1 + totalItems) % totalItems;
  updateCarousel();
 }