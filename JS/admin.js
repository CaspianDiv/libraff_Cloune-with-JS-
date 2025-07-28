
// Dəyişənlərin təyin edilməsi 

import { deleteBooksById, editBooksById, getAllBooks, postBooksById } from "./service.js";

let data = [];
const tBody = document.querySelector("tbody");
const modal = document.querySelector("#modal");
const form = document.querySelectorAll("#form input");
const outsetModal = document.querySelector("#outsetModal");
const editModal = document.querySelector("#editModal");
const editInps = document.querySelectorAll("#editModal input");


async function getData() {
    data = await getAllBooks()
    printTable()
};

getData();

//// // // // // // // // //   Modalın səhifə yüklənən zaman gizlədilmə prossesi

document.addEventListener("DOMContentLoaded", function() {
    //// // // //  Modalı Gizlənməsi
    modal.style.display = "none";
    modal.style.opacity = 0;
    //// // // //  Xəbərlər məlumatını yüklə
    getData();
})

function printTable() {
    tBody.innerHTML = "";
    data.forEach(book => {
        tBody.innerHTML += `
              <tr class="text-center dark:border-gray-300 dark:bg-gray-50">
                            <td class="border text-start px-2">
                                <p class="">${book.name}</p>
                            </td>
                            <td class="border">
                                <p class="truncate max-w-xs">${book.author}</p>
                            </td>
                            <td class="px-2 border py-2 w-[150px]">
                                <p class="truncate max-w-xs">${book.content}</p>
                            </td>
                            <td class="p-3  border">
                                 <img src="${book.img}" class="rounded w-full h-[100px] object-cover" alt="data image" />
                            </td>
                            <td class="p-3  border">
                                <p class="truncate max-w-xs">${book.price}</p>   
                            </td>
                            <td class="p-3  border">
                                <p class="truncate max-w-xs">${book.language}</p>   
                            </td>
                            <td class="p-3  border">
                                <p class="truncate max-w-xs">${book.soldCount} , ${book.stockCount}, ${book.view}</p>   
                            </td>
                      <td class="text-right border">
                            <div class="text-center">
                                <i onclick="handleModal(${true}, '${book.id}')"  class="fa-solid fa-pen-to-square px-2 text-[green] text-lg cursor-pointer"></i>
                                <i onclick="handleDelete('${book.id}')" class="fa-solid fa-trash px-2 text-[red] text-lg cursor-pointer"></i>
                            </div>
                        </td>
                        </tr>
        `
    });
};


window.handleDelete = async function(id) {
  await deleteBooksById(id);
  data = data.filter(item => item.id != id);
     Swal.fire({
  title: "Silindi!",
  icon: "error"
});
  printTable();
};


window.handlePost = async function() {
 const books = getVal(); 
   const resBooks = await postBooksById(books);
    if (resBooks) {
        data.push(resBooks)

           Swal.fire({
           title: "Uğurlu!",
           icon: "success"
        });
    }else {
           Swal.fire({
            title: "Uğursuz! Serverdə xəta baş verdi!",
            icon: "error"
            });
    };

   printTable();

   modalHandler(false);
   await getData();
};



function getVal() {
    
    const books = {
        name: form[0].value,
        author: form[1].value,
        content: form[2].value,
        img: form[3].value,
        price: form[4].value,
        language: form[5].value
    }
    return books
};

function getValues() {
    
    const books = {
        name: editInps[0].value,
        author: editInps[1].value,
        content: editInps[2].value,
        img: editInps[3].value,
        price: editInps[4].value,
        language: editInps[5].value
    }
    return books
};

window.handleModal = function(status,id) {
    outsetModal.style.display = status ? "flex" : "none";
    const elem = data.find(item => item.id == id); 
    console.log(editInps);
 
    if (status) {
           editInps[0].value = elem.name
            editInps[1].value = elem.author
            editInps[2].value = elem.content
            editInps[3].value = elem.img
            editInps[4].value = elem.price
            editInps[5].value = elem.language
            
            window.handleEdit = async function() {
                const editObj = getValues();
                console.log(editObj);
               await editBooksById(editObj,id);
                     Swal.fire({
                    title: "Uğurlu!",
                    icon: "success"
                    });
                data = await getAllBooks();
                outsetModal.style.display = "none"
                printTable()
            };
    }
};  
handleModal(false);


window.modalHandler = function (val) {
    if (val) {
        fadeIn(modal);
    } else {
        fadeOut(modal);
    }
    
};
window.fadeOut = function (el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= 0.1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
};
window.fadeIn = function (el, display) {
    el.style.opacity = 0;
    el.style.display = display || "flex";
    (function fade() {
        let val = parseFloat(el.style.opacity);
        if (!((val += 0.2) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};