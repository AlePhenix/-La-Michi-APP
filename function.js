const refreshButton = document.getElementById("refreshButton");
const catImg1 = document.getElementById("catImg1");
const catImg2 = document.getElementById("catImg2");
const catImg3 = document.getElementById("catImg3");
const URL = "https://api.thecatapi.com/v1/images/search?limit=3&api_key=live_BB2sMw0kgdY7FsHSTOK0uTVK0JSoDPUNucqnCi6CNu5i2xHcr7eycwS9O0g8wOnC";


async function fetchIMG(){
    try{
        const data = await fetch(URL);
        const urlImg = await data.json();
        catImg1.src = urlImg[0].url;
        catImg2.src = urlImg[1].url;
        catImg3.src = urlImg[2].url;
    }
    catch (error) {
        console.log("Hubo un error en la perición" + error)
    }
}
fetchIMG();

refreshButton.addEventListener("click", () => {
    fetchIMG();
})
