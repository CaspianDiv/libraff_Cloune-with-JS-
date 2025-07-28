import { getAllBooks, getCategs } from "./service.js";


// //////////////////////////// Dəyişənləri təyin edirik
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sideBar = document.getElementById("sideBar");
const logDiv = document.getElementById("logDiv");
const outset = document.getElementById("outset");
const popUp = document.getElementById("popUp");
const categSec = document.getElementById("categSec");
const subCatSec = document.getElementById("subCatSec");
const subSubCatSec = document.getElementById("subSubCatSec");
const userIcon = document.getElementById("userIcon");
const dropDownIcon = document.getElementById("dropDownIcon");
const bestSellersContainer = document.querySelector("#bestSellers");
let isOpen = false;
//// // // //  Side Barın çıxması
menuBtn.addEventListener("click", () => {
    sideBar.classList.remove("-translate-x-full");
});

// Ana ekrana qayıtmaq funksiyası 

window.goMainPage = function () {
    location.href = "../index.htm"
};


////////////////////////  Side Barın bağlanması
closeBtn.addEventListener("click", () => {
    sideBar.classList.add("-translate-x-full");
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
////////////////// Kateqoriya Div-nin açılıb bağlanması funksiyası 

window.handlePopup = function (status) {
    outset.style.display = status ? "block" : "none";
};

outset.addEventListener("click", (e) => {
    if (!popUp.contains(e.target)) {
        outset.style.display = "none";
    };
});

//// // // // // // // // //  Kateqoriyaların ekrana çapı
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

window.printSub = function (sub) {

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


window.printSubSub = function (sub, subSub) {

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
    });
};

////////////////////// Page Up Funksiyası 

window.pagUp = function () {
    window.scrollTo({
        behavior: "smooth",
        top: 0
    });
};



// Ən çox satılan Kitab kartlarının yaradılması funksiyası 

function createCard(book) {
   // Kitab qiymətlərinin formatı 


        let price = "Qiymət göstərilməyib";

        if (book.price) {
            // Qiymət formatını düzəldilməsi
            price = `${book.price} AZN`;
        };

        
        let originalPrice = parseFloat(book.price);
        let discountPercentage = 20;
        
        // Qiymət dəyəri mövcud və düzgündürsə , endirim tətbiq ediləcək
        
        let discountPrice = "N/A";
        if (!isNaN(originalPrice)) {
            discountPrice = (originalPrice - (originalPrice * discountPercentage / 100)).toFixed(2);
        };
 
        return  `
            
                <div class="bg-white rounded-lg shadow hover:shadow-xl p-4 w-64 cursor-pointer group book-card">
                    <div  class="absolute right-5 top-5 hidden heart-icon ">
                    <img src="../assets/img/heart.png" class="w-5" />
                    </div>
                    <div class="relative mb-3">
                        ${book.discount > 0 ?  `<span class="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">-${book.discount}%</span>` : ''}
                        <span class="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">${book.soldCount} satıldı</span>
                        <img src="${book.img}" alt="${book.name}" class="w-full h-64 object-cover rounded group-hover:scale-105 transition" />         
                    </div>
                    <a href="../HTML/details.htm?id=${book.id}" class="font-semibold text-sm mb-1 group-hover:text-red-600">${book.name}</a>
                    <p class="text-gray-600 text-xs mb-2">${book.author || ''}</p>
                    <div class="flex justify-between items-center">
                        <div>
                        <span class="font-semibold text-black px-2">${!isNaN(parseFloat(discountPrice)) ? discountPrice + "₼" : "N/A"}</span>
                            <span class="text-gray-400 line-through">${!isNaN(originalPrice) ? originalPrice + "₼" : "N/A"}</span>
                        </div>
                    </div>
                </div>
            
            `
};

   

// BestSellers Kitabların yüklənməsi 

async function loadBestSellers() {
    try {
        bestSellersContainer.innerHTML = `<div class="text-center py-10">Yüklənir....</div>`;

        const books = await getAllBooks();
        const bestSellers = books
            .filter(book => book.soldCount > 0)
            .sort((a, b) => b.soldCount - a.soldCount)
            .slice(0,44)
        bestSellersContainer.innerHTML =  bestSellers.map(createCard).join('');
        console.log(books);
    } catch (error) {
        bestSellersContainer.innerHTML = `<div class="text-center py-10 text-red-600">Xəta baş verdi</div>`
    };
};

// Yüklənmə 
document.addEventListener("DOMContentLoaded", loadBestSellers);
