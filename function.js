const refreshButton = document.getElementById("refreshButton");
const errorSpan = document.getElementById("error");
const randomMichisSection = document.getElementById("randomMichis");
const section = document.getElementById("favoriteMichis");
const URL_RANDOM = "https://api.thecatapi.com/v1/images/search?limit=3";
const URL_FAVOURITES = "https://api.thecatapi.com/v1/favourites?api_key=live_BB2sMw0kgdY7FsHSTOK0uTVK0JSoDPUNucqnCi6CNu5i2xHcr7eycwS9O0g8wOnC";
const URL_FAVOURITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}?api_key=live_BB2sMw0kgdY7FsHSTOK0uTVK0JSoDPUNucqnCi6CNu5i2xHcr7eycwS9O0g8wOnC`;
const URL_UPLOAD = "https://api.thecatapi.com/v1/images/upload";
var loadChecker = false;

function initHTMLrandomMichis (data){
    data.forEach(michi => {
        randomMichisSection.innerHTML += `
        <article>
            <img id="${michi.id}" width="150px" class="random_michis_imgs" src="${michi.url}" alt="Random cat image">
            <button class="btnFav" data-id="${michi.id}">Guardar michi en favoritos</button>
        </article>
        `;
    });
    const btnFav = document.querySelectorAll(".btnFav");
    btnFav.forEach(btn => {
        btn.addEventListener("click", () => {
            const michiID = btn.getAttribute("data-id");
            saveFavouriteMichis(michiID);
        });
    });
}

async function loadRandomMichis() {
    const resp = await fetch(URL_RANDOM, {
        method: 'GET',
        headers: {
            'X-API-KEY': 'live_BB2sMw0kgdY7FsHSTOK0uTVK0JSoDPUNucqnCi6CNu5i2xHcr7eycwS9O0g8wOnC',
        },
    });
  
    if (resp.status !== 200) {
        errorSpan.innerText = "Hubo un error: " + resp.status + resp.mesage;
    } else {
        const data = await resp.json();
        console.log("Random ", data);
  
        if (!loadChecker) {
            initHTMLrandomMichis(data);
            loadChecker = true;
        } else {
            updateRandomMichis(data);
        }
    }
}
  
function updateRandomMichis(data) {
    const articles = document.querySelectorAll("#randomMichis article");

    articles.forEach((article, index) => {
        const img = article.querySelector("img");
        const btn = article.querySelector(".btnFav");

        img.setAttribute("id", data[index].id);
        img.setAttribute("src", data[index].url);
        btn.setAttribute("data-id", data[index].id);
    });
}
  

async function loadFavoritesMichis(){
    const data = await fetch(URL_FAVOURITES, {
        method: 'GET',
        headers:{
            'X-API-KEY': 'live_BB2sMw0kgdY7FsHSTOK0uTVK0JSoDPUNucqnCi6CNu5i2xHcr7eycwS9O0g8wOnC',
        }
    });

    if( data.status !== 200){
        errorSpan.innerText = "Hubo un error: " + data.status + data.message;
    } else {
        const urlData = await data.json();
        console.log("Favourites", urlData);
        
        urlData.forEach(michi => {
            section.innerHTML += `
            <article>
                <img id="${michi.id}" width="150px" src="${michi.image.url}" alt="Random cat image">
                <button class="btnDelete" data-id="${michi.id}">Sacar michi de favoritos</button>
            </article>
            `;
        });

        const btnDeletes = document.querySelectorAll(".btnDelete");
        btnDeletes.forEach(btn => {
            btn.addEventListener("click", () => {
                const michiID = btn.getAttribute("data-id");
                deleteFavouriteMichis(michiID);
            });
        });
    }
}
async function saveFavouriteMichis(michiID){
    const res = await fetch(URL_FAVOURITES, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'live_BB2sMw0kgdY7FsHSTOK0uTVK0JSoDPUNucqnCi6CNu5i2xHcr7eycwS9O0g8wOnC',

        },
        body: JSON.stringify({
            image_id: michiID,
        }),
    });

    if (res.status !== 200){
        errorSpan.innerHTML = "Hubo un error POST: " + res.satus;
    }else{
        section.innerHTML = "";
        section.innerHTML += `<h2>Favorite Michis</h2>`;
        console.log("Michi guardado exitosamente en favoritos");
        loadFavoritesMichis();
    }
}
async function deleteFavouriteMichis(michiID){
    const res = await fetch(URL_FAVOURITES_DELETE(michiID), {
        method: "DELETE",
    });
    console.log("Save Favourite Michis", res)

    if (res.status !== 200){
        errorSpan.innerHTML = "Hubo un error DELETE: " + res.satus;
    }else {
        section.innerHTML = "";
        section.innerHTML += `<h2>Favorite Michis</h2>`;
        loadFavoritesMichis();
        console.log("Michi eliminado exitosamente")
    }
}

function previewImage(event){
    const input = event.target;
    
    //Recuperamos la etiqueta img donde cargaremos la imagen
    let imagePreview = document.getElementById("imagePreview");

    // Verificamos si existe una imagen seleccionada
    if(!input.files.length) return
    
    //Recuperamos el archivo subido
    let file = input.files[0];

    //Creamos la url
    let objectURL = URL.createObjectURL(file);
    
    //Modificamos el atributo src de la etiqueta img
    imagePreview.src = objectURL;
                    
    
}
async function uploadMichiPhoto(){
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    console.log(formData.get('file'));

    const res = await fetch(URL_UPLOAD, {
        method: "POST",
        headers:{
            'X-API-KEY': 'live_BB2sMw0kgdY7FsHSTOK0uTVK0JSoDPUNucqnCi6CNu5i2xHcr7eycwS9O0g8wOnC',
        },
        body: formData,
    });
    const data = await res.json();
    if (res.status !== 201) {
        spanError.innerHTML = `Hubo un error al subir michi: ${res.status} ${data.message}`
    }
    else {
        console.log("Foto de michi cargada :)");
        console.log({ data });
        console.log(data.url);
        saveFavouriteMichis(data.id);
    } 
}

loadRandomMichis();
loadFavoritesMichis();


refreshButton.addEventListener("click", () => {
    loadRandomMichis();
})

