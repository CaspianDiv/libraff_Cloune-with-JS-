

async function getBooksSliders() {
    try {
        const res = await fetch("https://libraff-db.onrender.com/slides");
        if (!res.ok) {
            throw new Error(`request xətası: xəta baş verdi, status: ${res.status}`)
        };
        const data = await res.json();
        return data
    } catch (error) {
        console.error(error.message);
    }
}; 



async function getAllBooks() {
    try {
        const res = await fetch("https://libraff-db.onrender.com/books");
        if (!res.ok) {
            throw new Error(`request xətası: xəta baş verdi, status: ${res.status}`)
        };
        const data = await res.json();
        return data
    } catch (error) {
        console.error(error.message);
    }
}; 

async function getCompanies() {
    try {
        const res = await fetch("https://libraff-db.onrender.com/company_cards");
        if (!res.ok) {
            throw new Error(`request xətası: xəta baş verdi, status: ${res.status}`)
        };
        const data = await res.json();
        return data
    } catch (error) {
        console.error(error.message);
    }
}; 


async function getCategs() {
    try {
        const res = await fetch("https://libraff-db.onrender.com/Category");
        if (!res.ok) {
            throw new Error(`request xətası: xəta baş verdi, status: ${res.status}`)
        };
        const data = await res.json();
        return data
    } catch (error) {
        console.error(error.message);
    }
}; 

async function deleteBooksById(id) {
    try {
        const res = await fetch(`https://libraff-db.onrender.com/books/${id}` , {
           method: "DELETE" 
        });
        if (!res.ok) {
            throw new Error(`request xətası: xəta baş verdi, status: ${res.status}`)
        };
        const data = await res.json();
        return data
    } catch (error) {
        console.error(error.message);
    }
}; 

async function postBooksById(book) {
    try {
        const res = await fetch("https://libraff-db.onrender.com/books" , {
           method: "POST",
           headers: {
            "Content-Type": "application/json"
           },
           body: JSON.stringify(book)
        });
        if (!res.ok) {
            throw new Error(`request xətası: xəta baş verdi, status: ${res.status}`)
        };
        const data = await res.json();
        return data
    } catch (error) {
        console.error(error.message);
    }
}; 

async function editBooksById(book,id) {
    try {
        const res = await fetch(`https://libraff-db.onrender.com/books/${id}`  , {
           method: "PUT",
           headers: {
            "Content-Type": "application/json"
           },
           body: JSON.stringify(book)
        });
        if (!res.ok) {
            throw new Error(`request xətası: xəta baş verdi, status: ${res.status}`)
        };
        const data = await res.json();
        return data
    } catch (error) {
        console.error(error.message);
    }
}; 




export {
    getAllBooks,
    getBooksSliders,
    getCategs,
    deleteBooksById,
    postBooksById,
    editBooksById,
    getCompanies
};