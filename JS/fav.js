import { getCategs } from "./service.js";

// //////////////////////////// Dəyişənləri təyin edirik
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sideBar = document.getElementById("sideBar");
const logDiv = document.getElementById("logDiv");
const basketDiv = document.getElementById("basketDiv");
const basketIcon = document.getElementById("basketIcon");
const closeBasket = document.getElementById("closeBasket");
const outset = document.getElementById("outset");
const popUp = document.getElementById("popUp");
const categSec = document.getElementById("categSec");
const subCatSec = document.getElementById("subCatSec");
const favSec = document.querySelector("#favSec");
let isOpen

//// // // //  Side Barın çıxması
menuBtn.addEventListener("click", () => {
  sideBar.classList.remove("-translate-x-full");
});

////////////////////////  Side Barın bağlanması
closeBtn.addEventListener("click", () => {
  sideBar.classList.add("-translate-x-full");
});

////////////////// Kateqoriya Div-nin açılıb bağlanması funksiyası 

window.handlePopup = function(status) {
  outset.style.display = status ? "block" : "none";
};

outset.addEventListener("click" , (e) => {
    if (!popUp.contains(e.target)) {
          outset.style.display = "none";
    };
});

/// // // // // // // // //  Kateqoriyaların ekrana çapı
let catData = [];
async function printCateg() {

  // Əvvəlki məlumatların təmizlənməsi 

  categSec.innerHTML = "";
   catData = await getCategs()

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

//// // // // // // // // // // // Basketin göstərilməsi

basketIcon.onclick = () => {
    basketDiv.classList.remove("hidden");
};

////////////////////////////////// Basketin Bağlanılması
closeBasket.onclick = () => {
    basketDiv.classList.add("hidden");
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


// Ana ekrana qayıtmaq üçün fuksiya 
window.goMainPage = function() {
  location.href = "../index.htm"
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


function getFavList() {
    return JSON.parse(localStorage.getItem('favList'));
};

function showFav() {
    favSec.innerHTML = "";
    const favList = getFavList();
    favList.forEach(book => {
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

    favSec.innerHTML +=`
       <div class="w-64 bg-white relative rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer book-card">
        <img src="${book.img}" alt="${book.name}" class="object-cover w-full" />
        <div class="absolute top-2 right-2 border-2 border-[#ef3340] rounded-full px-2 py-1 x-icon">
            <button onclick="removeFav('${book.id}')"><i  class="fa-solid fa-xmark text-[#ef3340]"></i></button>
        </div>
        <div class="p-4">
              <a href="../details.htm?id=${book.id}" class="font-semibold hover:underline text-lg mb-1 truncate" title="${book.name}">${book.name}</a>
              <p class="tetx-gray-600 text-sm mb-2 title="author"">${book.author}</p>
              <div>
                  <button class="bg-[#ef3340] text-white px-3 py-1 rounded-full  text-sm hover:bg-red-700 transition-colors">Səbətə at</button>
              </div>
            <div class="py-5">
              <span class="font-semibold text-black px-2">${!isNaN(parseFloat(discountPrice)) ? discountPrice + "₼" : "N/A"}</span>
              <span class="text-gray-400 line-through">${!isNaN(originalPrice) ? originalPrice + "₼" : "N/A"}</span>
          </div>
              <p class="text-xs text-gray-500 mt-2">${stockText}</p>
        </div>
        </div>    
    `
       const bookCards = document.querySelectorAll('.book-card');
     bookCards.forEach(card => {
        // Hover zamanı heart ikonunu göstərmək
        card.addEventListener('mouseover', function() {
            const heartIcon = this.querySelector('.x-icon');
            if (heartIcon) {
                heartIcon.classList.remove('hidden');
            }
        });
        
        // Mouse çıxdıqda heart ikonunu gizlətmək
        card.addEventListener('mouseleave', function() {
            const heartIcon = this.querySelector('.x-icon');
            if (heartIcon) {
                heartIcon.classList.add('hidden');
            }
        });
    });
});

};
showFav();



window.removeFav = function(id) {
const favList = getFavList()
  const newList = favList.filter(item => item.id != id);
  localStorage.setItem('favList', JSON.stringify(newList));
  showFav();
  updateBadgesFromStorage();
};

