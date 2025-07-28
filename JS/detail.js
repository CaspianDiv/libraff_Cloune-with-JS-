import { getAllBooks } from "./service.js";

// Dəyişənlərin təyin olunması 
let booksData = [];
const bookDetCard = document.querySelector("#bookDetCard");
const detCardBottom = document.querySelector("#detCardBottom");
const detCardContent = document.querySelector("#detCardContent");
const logDiv = document.querySelector("#logDiv");
let isOpen = false;
const basketDiv = document.querySelector("#basketDiv");
const closeBasket = document.querySelector("#closeBasket");
const detCardProperties = document.querySelector("#detCardProperties");
const commentSec = document.querySelector("#commentSec");
const breadCrumbs = document.querySelector("#breadCrumbs");
const breadCrumbs2 = document.querySelector("#breadCrumbs2");
const outsetModal = document.getElementById("outsetModal");
const queryString = location.search;
const id = new URLSearchParams(queryString).get("id");

// Bütün Kitab Məlumatların Alınması 

async function getBooksData() {
    try {
        booksData = await getAllBooks();
        console.log(booksData);
        printDetCard()
    } catch (error) {
        console.error(error.message);
    }
};
getBooksData();

// / showComments funksiyasını dəyiş
window.showComments = function() {
    detCardProperties.innerHTML = "";
    detCardContent.innerHTML = "";
    const commentBlock = document.querySelector("#commentBlock");
    commentBlock.style.borderBottom = "4px solid #ef3340"
    commentBlock.style.color = "black";
    const detProp = document.querySelector("#detProp");
    detProp.style.borderBottom = "none";
    detProp.style.color = "gray";
    const border_bottom = document.querySelector("#border_bottom");
    border_bottom.style.borderBottom = "none"
    border_bottom.style.color = "gray"
    
    // Şərhləri al və göstər
    const comments = getComments(id);
    
    commentSec.innerHTML = `
        <div class="bg-[#f5f5f7] p-5 rounded-xl mb-5">
            <div class="text-center">
                <h4 class="font-semibold text-lg">Məhsul haqqında rəy yazın</h4>
                <p class="py-1 my-2">Fikirlərinizi digər istifadəçilərlə bölüşün</p>
                <button class="text-white font-semibold text-lg px-4 py-2 rounded-full bg-[#000]" onclick="writeComment()">Rəy yaz</button>
            </div>
        </div>
    `;
};


function printDetCard() {
    const book = booksData.find(item => item.id == id);
    let originalPrice = parseFloat(book.price);
    let discountPercentage = 20;


    // Qiymət dəyəri mövcud və düzgündürsə , endirim tətbiq ediləcək


    let discountPrice = "N/A";
    if (!isNaN(originalPrice)) {
        discountPrice = (originalPrice - (originalPrice * discountPercentage / 100)).toFixed(2);
    };
    breadCrumbs.innerHTML = `
        <span> / ${book.category}</span>
    `
    breadCrumbs2.innerHTML = `
        <span> / ${book.subcategory}</span>
    `
    bookDetCard.innerHTML = `
            <div class="bg-[#F6F6F8] px-10 w-[60vw] rounded-xl">
                <img src="${book.img}" class="m-auto" />
            </div>
            <div class="w-[40vw]">
                <h3 class="p-[20px_0_0_0] text-[2rem]">${book.name}</h3>
                <p class="text-gray-400 py-3 font-semibold">${book.author}</p>
                <p class="text-[1.8rem] font-semibold">${!isNaN(parseFloat(discountPrice)) ? discountPrice + "₼" : "N/A"}</p>
                <div class="flex gap-x-2 p-[10px_0]">
                    <p class="line-through text-gray-400 font-semibold text-lg">${!isNaN(originalPrice) ? originalPrice + "₼" : "N/A"}</p>
                    <p class="text-white font-semibold bg-[#ef3340] w-[10%] text-center rounded-lg">-20%</p>
                </div>
                <div class="text-center text-white font-semibold p-[40px_0]">
                    <button class="bg-[#ef3340] hover:bg-[rgba(255,0,0,0.7)] w-full py-2 px-2 rounded-full">
                        <i class="fa-solid fa-bag-shopping"></i>
                        <span class="px-2 text-lg" onclick="addBasket('${book.id}')">Səbətə əlavə et</span>
                    </button>
                </div>
                <div class="flex justify-between gap-x-5">
                    <div class="flex items-center gap-x-3 text-gray-400 font-semibold hover:text-[#ef3340] cursor-pointer">
                        <i class="fa-regular fa-heart" title="Seçilmiş məhsulların siyahısına əlavə edin"></i>
                        <p  onclick="addFav('${book.id}')">Seçilmiş</p>
                    </div> 
                    <div class="flex gap-x-3 items-center text-gray-400 font-semibold hover:text-[#ef3340] cursor-pointer">
                        <i class="fa-regular fa-message"></i>
                        <p>Sizə necə kömək edə bilərik?</p>
                    </div>
                </div>
                <h5 class="py-5 text-xl font-semibold">Çatdırılma haqqında</h5>
                <p class="text-[#738196]">Bakı şəhər üçün təxmini müddət və qiymətlər.</p>
                <p class="py-5 text-[#738196]">
                    <i class="fa-solid fa-shop text-[#475569]"></i>
                    Mağazadan təhvil alma  — <span class="font-bold">pulsuz.</span>
                </p>
                <p class="text-[#738196]">
                    <i class="fa-solid fa-truck text-[#738196]"></i>
                    Kuryer ilə — operator təsdiqindən sonra <span class="font-bold">24 saat ərzində </span> .
                    30 AZN  və yuxarı sifarişlərdə — <span  class="font-bold"> pusluz </span> .
                </p>
                <hr class="m-[10px_0] border-dashed bg-[#738196]" />
                <p class="text-[#738196]">Bölgələrə çatdırılma <span class="font-semibold">3-5 iş günü </span>ərzində</p>
            </div>
    `

    detCardBottom.innerHTML = `
        <div class="text-xl font-semibold">
            <p class="border-b-4 border-b-[#ef3340] py-2 cursor-pointer" onclick="showContent()" id="border_bottom">Təsvir</p>
        </div>
        <div class="text-xl font-semibold text-[#738196]">
            <p class="cursor-pointer hover:text-black py-2" onclick="showProperty()" id="detProp">Xüsusiyyət</p>
        </div>
        <div class="text-xl font-semibold text-[#738196]">
            <p class="cursor-pointer hover:text-black" onclick="showComments()" id="commentBlock">İstifadəçi rəyləri</p>
        </div>
    `;
    showContent();
};

window.handleModal = function(status){
    outsetModal.style.display = status ? "initial" : "none";
};
handleModal(false)

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

// Xüsusiyyətlər bölməsinin görsənməsi işləməsi funksiyası 

window.showProperty = function() {
    detCardContent.innerHTML = "";
    commentSec.innerHTML = ""
    const border_bottom = document.querySelector("#border_bottom");
    border_bottom.style.borderBottom = "none"
    border_bottom.style.color = "gray"
    const detProp = document.querySelector("#detProp");
    detProp.style.borderBottom = "4px solid #ef3340";
    detProp.style.color = "black";
    const commentBlock = document.querySelector("#commentBlock");
    commentBlock.style.borderBottom = "none"
    commentBlock.style.color = "gray";
    const book = booksData.find(item => item.id == id);
    console.log(book);
    detCardProperties.innerHTML = `
        <div class="container flex xl:flex-row lg:flex-row md:flex-col sm:flex-col nm:flex-col ex-sm:flex-col ts:flex-col dl:flex-col gap-y-5  justify-around items-center mx-auto">
            <div class="space-y-3">
                <p> <span class="text-gray-400 font-semibold">Cild</span><span class="text-gray-300">.....................................</span> ${book.feature.cild}</p>
                <p><span class="text-gray-400 font-semibold">Dil</span> <span class="text-gray-300">.....................................</span> ${book.feature.dil}</p>
                <p><span class="text-gray-400 font-semibold">Müəllif</span><span class="text-gray-300">.....................................</span> ${book.feature.müəllif}</p>
            </div>
            <div class="space-y-3">
                <p><span class="text-gray-400 font-semibold">Nəşriyyat</span><span class="text-gray-300">.....................................</span> ${book.feature.nəşriyyat}</p>
                <p><span class="text-gray-400 font-semibold">Səhifə sayı</span><span class="text-gray-300">.....................................</span> ${book.feature.səhifə}</p>
            </div>
        </div>
    `
};

// Təsvir bölməsinin işləmə görsənməsi funksiyası 

window.showContent = function() {
        detCardProperties.innerHTML = "";
        commentSec.innerHTML = "";
        const border_bottom = document.querySelector("#border_bottom");
        border_bottom.style.borderBottom = "4px solid #ef3340 "
        border_bottom.style.color = "black"
        const detProp = document.querySelector("#detProp");
        detProp.style.borderBottom = "none";
        detProp.style.color = "gray";
        const commentBlock = document.querySelector("#commentBlock");
        commentBlock.style.borderBottom = "none"
        commentBlock.style.color = "gray";
        const book = booksData.find(item => item.id == id);
        detCardContent.innerHTML = `
        <div class="w-[80%] mx-auto">
            <p>
                ${book.content}
            </p>
        </div>
    `
};

// Rəyləri saxlamaq üçün funksiya 

window.addNewComment = function(){
    const commentText = document.querySelector("#createComment textarea").value.trim();
    const authorName = document.querySelector("#createComment input[placeholder*='Ad və Soyad']").value.trim();

    // Boş sahələrin yoxlanılması 
    if (!commentText || !authorName) {
        alert("Zəhmət olmasa boş xanaları doldurun!");
    };

    // Yeni rəy üçün obyekt yaradılması 

    const newComment = {
        id: Date.now(), // Unikal ID
        bookId: id, // Hansı kitab üçün 
        text: commentText,
        author: authorName,
        date: new Date().toLocaleDateString('az-AZ')
    };

    // Mövcud rəylərin alınması 

    const allComments = JSON.parse(localStorage.getItem("allComments")) || [];

    // Yeni rəyin əlavə olunması 

    allComments.push(newComment);

    // localStorag - a yazılması 

    localStorage.setItem("allComments" ,JSON.stringify(allComments));

    // Rəylərin yenidən göstərilməsi 

    displayComments();

    // Modalın bağlanması 

    handleModal(false);

    // Formun Təmizlənməsi 

    document.querySelector("#createComment textarea").value = "";
    document.querySelector("#createComment input[placeholder*='Ad və Soyad']").value = "";

    // Notification Sweet Alert2
    Swal.fire({
        title: "Uğurlu !",
        text: "Yeni şərh uğurla əlavə olundu !",
        icon: "success"
    });
    printDetCard()
};

// Rəyləri göstərmək üçün funksiya

function displayComments(){
    const allComments = JSON.parse(localStorage.getItem('allComments')) || [];

    // Bu kitab üçün rəylərin filter olunması 

    const bookComments = allComments.filter(comment => comment.bookId === id);

    const newComArea = document.getElementById("newComArea");

    if (bookComments.length === 0) {
        newComArea.innerHTML = '<p class="text-gray-500">Hələ heç bir rəy yoxdur</p>';
        return;
    };

    // Rəylərin HTML tag - i kimi göstərilməsi 

    let commentsHTML = '<div class="space-y-4"></div>';

    bookComments.forEach(comment => {
        commentsHTML += `
            <div class="border rounded-lg p-4 bg-white shadow-sm">
                <div class="flex justify-between items-start mb-2">
                    <h5 class="font-semibold text-gray-900">${comment.author}</h5>
                    <span class="text-sm text-gray-500">${comment.date}</span>
           
                </div>
                <p class="text-gray-700">${comment.text}</p>
            </div>
        `
    });
    commentsHTML += '</div>';   
    newComArea.innerHTML = commentsHTML;
};

window.showComments = function() {
    detCardProperties.innerHTML = "";
    detCardContent.innerHTML = "";
    const commentBlock = document.querySelector("#commentBlock");
    commentBlock.style.borderBottom = "4px solid #ef3340"
    commentBlock.style.color = "black";
    const detProp = document.querySelector("#detProp");
    detProp.style.borderBottom = "none";
    detProp.style.color = "gray";
    const border_bottom = document.querySelector("#border_bottom");
    border_bottom.style.borderBottom = "none";
    border_bottom.style.color = "gray";
    commentSec.innerHTML = `
        <div class="bg-[#f5f5f7] p-5 rounded-xl mb-5">
            <div class="text-center">
                <h4 class="font-semibold text-lg">Məhsul haqqında rəy yazın</h4>
                <p class="py-1 my-2">Fikirlərinizi digər istifadəçilərlə bölüşün</p>
                <button class="text-white font-semibold text-lg px-4 py-2 rounded-full bg-[#000]" onclick="writeComment()">Rəy yaz</button>
            </div>
            </div>
        <div id="commentsDisplay"></div>
    `;
  
    
    // Mövcud rəylərin göstərilməsi 
    displayExistingComments();
};


// Mövcud rəyləri gpstərmək üçün funksiya 

function displayExistingComments(){
    const allComments = JSON.parse(localStorage.getItem('allComments')) || [];
    const bookComments = allComments.filter(comment => comment.bookId === id);

    const commentDisplay = document.getElementById('commentsDisplay');

    if (bookComments.length === 0) {
        commentDisplay.innerHTML = '<p class="text-center text-gray-500 py-8">Bu kitab üçün hələ rəy yazılmayıb</p>';
        return;
    };

    let commentsHTML = '<h4 class="font-semibold text-lg mb-4">İstifadəçi rəyləri</h4><div class="space-y-4">';

    bookComments.forEach(comment => {
            commentsHTML += `
                <div class="border rounded-lg p-4 bg-white shadow-sm">
                    <div class="flex justify-between items-start mb-2">
                        <h5 class="font-semibold text-gray-900">${comment.author}</h5>
                        <span class="text-sm text-gray-500">${comment.date}</span>
                        <div>
                            <i class="fa-solid fa-trash-can cursor-pointer text-[red] text-[1.2rem]" onclick="deleteComment()"></i>
                        </div>
                    </div>
                    <p class="text-gray-700">${comment.text}</p>
                </div>
            `
    });

    commentsHTML += '</div>';
    commentDisplay.innerHTML = commentsHTML;
};

window.deleteComment = function(){
    localStorage.removeItem('allComments');
    Swal.fire({
        title: "Uğurlu !",
        text: "Uğurla Silindi !",
        icon: "error"
    });
    printDetCard();
};

window.addEventListener("DOMContentLoaded", function(){
    updateBadgesFromStorage();

    // Əgər URL - də comments parametri varsa (yəni ki əgər comments bölməsi açıqdısa)

    if (window.location.hash === '#comments' ) {
        showComments()
    };
});


window.writeComment = function(status){
    commentSec == status ? "initial" : handleModal(true);
};


////////////////////// Page Up Funksiyası 

window.pagUp = function () {
    window.scrollTo({
        behavior: "smooth",
        top: 0
    });
};


// Go Home
window.homePage = function() {
    window.location.href = "../index.htm";
};
// Ana ekrana qayıtmaq funksiyası logoya basanda !!

window.goMainPage = function() {
    location.href = "../index.htm"
}

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