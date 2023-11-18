const refreshButton = document.getElementById("refreshButton");
const errorSpan = document.getElementById("error");
const randomMichisSection = document.getElementById("randomMichis");
const URL_RANDOM = "https://api.thecatapi.com/v1/images/search?limit=3&api_key=live_BB2sMw0kgdY7FsHSTOK0uTVK0JSoDPUNucqnCi6CNu5i2xHcr7eycwS9O0g8wOnC";
const URL_FAVOURITES = "https://api.thecatapi.com/v1/favourites?api_key=live_BB2sMw0kgdY7FsHSTOK0uTVK0JSoDPUNucqnCi6CNu5i2xHcr7eycwS9O0g8wOnC";
const URL_FAVOURITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}?api_key=live_BB2sMw0kgdY7FsHSTOK0uTVK0JSoDPUNucqnCi6CNu5i2xHcr7eycwS9O0g8wOnC`;
var loadChecker = false;

function initHTMLrandomMichis (data){
    data.forEach(michi => {
        randomMichisSection.innerHTML += `
        <article>
            <img id="${michi.id}" width="150px" src="${michi.url}" alt="Random cat image">
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
    const resp = await fetch(URL_RANDOM);
  
    if (resp.status !== 200) {
        errorSpan.innerText = "Hubo un error: " + resp.status + resp.mesage;
    } else {
        const data = await resp.json();
        console.log("Random MEEEEEEEEEE", data);
  
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
    const data = await fetch(URL_FAVOURITES);

    if( data.status !== 200){
        errorSpan.innerText = "Hubo un error: " + data.status + data.message;
    } else {
        const urlData = await data.json();
        console.log("Favourites", urlData);
        
        urlData.forEach(michi => {
            const section = document.getElementById("favoriteMicis");
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
        },
        body: JSON.stringify({
            image_id: michiID,
        }),
    });

    if (res.status !== 200){
        errorSpan.innerHTML = "Hubo un error POST: " + res.satus;
    }else{
        const data = await res.json();
        console.log("Michi guardado exitosamente");


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
        const data = await res.json();
        console.log("Michi eliminado exitosamente")
    }
}
loadRandomMichis();
loadFavoritesMichis();

refreshButton.addEventListener("click", () => {
    loadRandomMichis();
})

