import { getCategs, getCompanies } from "./service.js";


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
const subSubCatSec = document.getElementById("subSubCatSec");
const userIcon = document.getElementById("userIcon");
const dropDownIcon = document.getElementById("dropDownIcon");
const discountContainer = document.querySelector("#discountContainer");
let isOpen = false;
let catData = [];
let companyData = [];

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

//// // // // // // // // //  Kateqoriyaların ekrana çapı


////////////////// Kateqoriya Div-nin açılıb bağlanması funksiyası 

window.handlePopup = function (status) {
    outset.style.display = status ? "block" : "none";
};

outset.addEventListener("click", (e) => {
    if (!popUp.contains(e.target)) {
        outset.style.display = "none";
    };
});

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

// Endirim Kartlarının datadan götürülməsi 

async function getCompanyData() {
    try {
        companyData = await getCompanies();
        console.log(companyData);
        printCompaniesCard()
    } catch (error) {
        discountContainer.innerHTML = `<div class="py-10 text-red-600">Xəta baş verdi</div>`;
    };
};
function printCompaniesCard() {
    companyData.forEach(company => {
        discountContainer.innerHTML += `     
            <div class="max-w-xs rounded-lg shadow-md hover:shadow-xl cursor-pointer">
                <div class="">
                    <img class="w-full" src="${company.img}" />
                </div>
                <div class="p-2">
                    <div>
                        <p class="mb-3 text-sm px-2 font-semibold hover:text-[#ef3340] text-[#0f172a]">${company.subtitle}</p>
                        <p class="mb-3 text-xs px-2 font-semibold hover:text-[#ef3340] text-gray-400">${company.subtitle_2}</p>
                    </div>
                </div> 
            </div>
        `
    });
};
// Yüklənmə
document.addEventListener("DOMContentLoaded", getCompanyData);

// Ana səhifəyə qaytaran funksiya

window.mainPage = function() {
    location.href = "../index.htm"
}

////////////////////// Page Up Funksiyası 

window.pagUp = function () {
    window.scrollTo({
        behavior: "smooth",
        top: 0
    });
};
