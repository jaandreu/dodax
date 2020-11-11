
//Se ha cargado el HTML completamente.
document.addEventListener("DOMContentLoaded", function(event) { 

    console.log('DOMContentLoaded');
    hideElement("fab-delete");
    getCurrencyRates()
       .then((salida) => {
         rates = salida;
     });

     createHistoryFromStorage();

     //última búsqueda
    let lastSearchResult = sessionStorage.getItem('lastSearchResult');
    let lastSearch = sessionStorage.getItem('lastSearch');

    if (lastSearchResult != null){
      hideElement("div-history");
      document.getElementById("div-resultados").innerHTML = lastSearchResult;
      document.getElementById("search").value = lastSearch;
      if (sessionStorage.getItem("moreItems") === "1"){
          infiniteScroll.disabled = false;
      }
    }else
    {
      showElement("div-history");
    }

    //última configuración.
    let lastConf = localStorage.getItem("conf");

    if (lastConf !== null){

      JSON.parse(lastConf).forEach(item => {
          document.getElementById(item.name).checked = item.checked;
      });

    }

    //dark mode
    let darkMode = localStorage.getItem("themeToggle");
    if (darkMode != null){
      document.getElementById("themeToggle").checked = (darkMode == "true");
      darkModeChange(darkMode == "true");
    }
    
  });

  //Submit del formulario de búsqueda.
  document.getElementById("formulario").addEventListener('submit', function(){

    //Quitamos coletillas sobre el formato a buscar.
    let cadenaBusqueda = document.getElementById("search").value
                        .toUpperCase()
                        .replace("VINILO", "")
                        .replace("VINYL", "")
                        .replace(" CD", "")
                        .replace(" LP","")
                        .replace("CD ", "")
                        .replace("LP ","")
                        .trim()
                        .replace(/ /g, '+');

    //Como mínimo 2 caracteres de búsqueda.
    if (cadenaBusqueda.length < 2)
      return false;

    sessionStorage.setItem('lastSearch', cadenaBusqueda);
    addHistory(cadenaBusqueda, false);
    showSpinner(true);
    hideElement("div-resultados");
    deleteAlbums();
    getAlbums(cadenaBusqueda, true, false, []);
    showElement("div-resultados");

  });

  //Infinite scroll.
  const infiniteScroll = document.getElementById('infinite-scroll');

  //Se dispara cuando llegamos al final del scroll de la página.
  infiniteScroll.addEventListener('ionInfinite', async function () {
    
    if (sessionStorage.getItem("moreItems") == "1"){
      showSpinner(true);
      let cadenaBusquedaActual = sessionStorage.getItem("lastSearch");
      getAlbums(cadenaBusquedaActual, false, false, [], function(){
        infiniteScroll.complete();
      });
    }
    else{
        infiniteScroll.disabled = true;
    }
  });

  //Página de configuración.
  document.getElementById('button-settings').addEventListener('click', function(){
    showElement("content-settings");
    showElement("header-conf");
    hideElement("header-search");
    hideElement("content-search");
  });

   //Página de configuración.
   document.getElementById('button-delete').addEventListener('click', function(){
    deleteAlbums();
  });


  //Click para guardar la configuración.
  document.getElementById('button-check').addEventListener('click', function(){
    showElement("content-search");

    hideElement("header-conf");
    showElement("header-search");

    let conf = [];

    Array.from(document.getElementsByClassName("formato")).forEach(check => {
        conf.push({name: check.name, checked: check.checked});
    });

    localStorage.setItem("conf", JSON.stringify(conf));

    hideElement("content-settings");

  });

  //Evento para copiar una url al portapapeles.
  const copyButtonEvent = function(url){

    let tempInput = document.createElement("input");
        tempInput.setAttribute("readonly", "readonly");
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

        presentToast("Url Copiada!", 1000, "info");
  }

  //Muestra un mensaje.
  async function presentToast(message, duration, type) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = duration;
    toast.color = type == "error" ? "danger" : "secondary";
    toast.position = "bottom";
    toast.translucent = false;
    document.body.appendChild(toast);
    return toast.present();
  };

//Definición del modo heavy
// Query for the toggle that is used to change between themes
const toggle = document.querySelector('#themeToggle');

// Listen for the toggle check/uncheck to toggle the dark class on the <body>
toggle.addEventListener('ionChange', (ev) => {
  darkModeChange(ev.detail.checked);
});

const darkModeChange = function(checked){
  document.body.classList.toggle('dark', checked);
  localStorage.setItem("themeToggle", checked);
}

const deleteAlbums = function() {

      hideElement("fab-delete");
      showElement("div-history");

      Array.from(document.getElementsByClassName("resultados-items")).forEach(element => {
          element.parentNode.removeChild(element);
      });
  
      //Inicializamos las rutas de las siguientes llamadas.
      sessionStorage.setItem('nextUrls', JSON.stringify([]));
      sessionStorage.setItem("lastSearchIndex", "0");
      sessionStorage.setItem("moreItems","0");
      sessionStorage.removeItem('lastSearchResult');
      sessionStorage.removeItem('lastSearch');

}

const addHistory = function(searchMessage, isFavorite){

  let baseChip = parser.parseFromString(document.getElementById("chip-search-base").outerHTML, "text/html");
  let numItems = parseInt(document.getElementById("div-history").getAttribute("num-items"));
  let newId = "chip-search-base" + (numItems + 1) + "";
  baseChip.getElementById("chip-search-base").id = newId;

  //Vemos si ya exite.
  let encontrado = false;
  Array.from(document.getElementsByClassName("chip-history-item-label")).forEach(item => {
      if (item.innerText == searchMessage){
        encontrado = true;
      }
  });

  if (!encontrado){

    (baseChip.getElementsByClassName("label-search")[0]).innerText = searchMessage;
    (baseChip.getElementsByClassName("label-search")[0]).classList.add("chip-history-item-label");
    baseChip.getElementById(newId).classList.remove("base");
    
    if (!isFavorite){
      baseChip.getElementById(newId).classList.add("chip-temporal");
    }
    else{
      (baseChip.getElementsByClassName("icon-heart")[0]).setAttribute("name", "heart");
    }

    (baseChip.getElementsByClassName("chip-icon-close")[0]).addEventListener("click", function(evt){
      evt.target.parentNode.remove();
      let divHistory = document.getElementById("div-history");
      let num = parseInt(divHistory.getAttribute("num-items"));
      divHistory.setAttribute("num-items", num - 1);
      updateHistoryStorage();
      evt.stopPropagation();
      console.log('chip close');
    });

    (baseChip.getElementsByClassName("icon-heart")[0]).addEventListener("click", function(evt){
      evt.target.parentNode.classList.toggle("chip-temporal");
      if (evt.target.name == "heart-outline"){
        evt.target.name = "heart";
      }
      else {
        evt.target.name = "heart-outline";
      }
      updateHistoryStorage();
      console.log('chip favorito');
      evt.stopPropagation();
    });
  
    baseChip.getElementById(newId).addEventListener("click", function(evt){
      console.log('chip search');
      document.getElementById("search").value = evt.target.innerText;
      sessionStorage.setItem('lastSearch', evt.target.innerText);
      showSpinner(true);
      hideElement("div-resultados");
      deleteAlbums();
      getAlbums( evt.target.innerText, true, false, []);
      showElement("div-resultados");
    });


    if (numItems < 10){

      document.getElementById("div-history").prepend(baseChip.getElementById(newId));
      document.getElementById("div-history").setAttribute("num-items", numItems + 1);

    }
    else{
       //nos cargamos el último no favorito.
       let chipsTemporales = document.getElementById("div-history").getElementsByClassName("chip-temporal");

       if (chipsTemporales.length > 0){
         chipsTemporales[chipsTemporales.length - 1].remove();
         document.getElementById("div-history").prepend(baseChip.getElementById(newId));
       }
    }
    updateHistoryStorage();
  }
}

const updateHistoryStorage = function() {

  //Lo guardamos todo en el localstorage.
    let chips = [];
    Array.from(document.getElementById("div-history").getElementsByClassName("chip-history-item-label")).forEach(item => {
      chips.push({text: item.innerText, isFavorite: !item.parentElement.classList.contains("chip-temporal")});
    });

    localStorage.setItem("chips", JSON.stringify(chips));

};

const createHistoryFromStorage = function() {
   let chips = JSON.parse(localStorage.getItem("chips"));
   if (chips != null && chips.length > 0){
      chips.forEach(chip => {
        addHistory(chip.text, chip.isFavorite);
      });
   }
}


// Listen for ionChange on all segments
const segments = document.querySelectorAll('ion-segment')
for (let i = 0; i < segments.length; i++) {
  segments[i].addEventListener('ionChange', (ev) => {
    
    if (ev.target.value == "formato"){
      hideElement("content-otros");
      showElement("content-formato");
    }
    if (ev.target.value == "otros"){
      showElement("content-otros");
      hideElement("content-formato");
    }

  })
}

const toggleArtist = function(element){
  element.lastElementChild.lastElementChild.classList.toggle('base');
}

const flip = function(obj, gtin, numItem, paginating) {

  let flipContainer = obj.parentNode.getElementsByClassName("flip-container")[0];

  let imFlip = flipContainer.classList.contains("flip") && !paginating;
  let frontDiv = flipContainer.getElementsByClassName("front")[0];
  let backDiv = flipContainer.getElementsByClassName("back")[0];

  if (imFlip){

    backDiv.style.display = "none"; 
    frontDiv.style.display = "";
    let paginationContainer = obj.parentNode.getElementsByClassName("pagination-button")[0];
    paginationContainer.style.display = "none";

    obj.parentNode.getElementsByClassName("flip-container")[0].classList.toggle('flip');


  }
  else{

    //Vemos si existe la info que nos piden.
    let albumInfo = flipContainer.getElementsByClassName("album-info-" + numItem)[0];
    let numItems =  parseInt(backDiv.getAttribute("total-items"));

    //Si existe la mostramos y ocultamos el resto.
    if (albumInfo){

      backDiv.setAttribute("current-item", numItem);

      for (var idx = 1; idx<=numItems; idx++){
        let albumInfoIdx = flipContainer.getElementsByClassName("album-info-" + idx)[0];
        if (albumInfoIdx){
          if (idx === numItem){
            albumInfoIdx.style.display = "";
          }
          else{
            albumInfoIdx.style.display = "none";
          }
        }
      }

      let paginationContainer = obj.parentNode.getElementsByClassName("pagination-button")[0];
       
      if (numItems > 1){
        paginationContainer.style.display = "";
      }
      else{
        paginationContainer.style.display = "none";
      }

      let paginationBack = obj.parentNode.getElementsByClassName("pagination-back")[0];

      if (numItem == 1){
        paginationBack.style.display = "none";
        (obj.parentNode.getElementsByClassName("pagination-current")[0]).innerText = numItem + "/" + numItems;
      }
      else{
        paginationBack.style.display = "";
      }

      let paginationForward = obj.parentNode.getElementsByClassName("pagination-forward")[0];

      if (numItem == numItems){
        paginationForward.style.display = "none";
      }
      else{
        paginationForward.style.display = "";
      }


      backDiv.style.display = "";
      frontDiv.style.display = "none";
      
      if (!paginating){
        obj.parentNode.getElementsByClassName("flip-container")[0].classList.toggle('flip');
      }

    }
    else{

      let base = parser.parseFromString(flipContainer.getElementsByClassName("base")[0].outerHTML, "text/html");

      base.getElementsByClassName("album-info")[0].classList.remove("base");
      base.getElementsByClassName("album-info")[0].classList.add("album-info-" + numItem);
      base.getElementsByClassName("album-info")[0].classList.remove("album-info");
      backDiv.appendChild(base.getElementsByClassName("album-info-" + numItem)[0]);

      for (var idx = 1; idx<=numItems; idx++){
        let albumInfoIdx = flipContainer.getElementsByClassName("album-info-" + idx)[0];
        if (albumInfoIdx){
          if (idx === numItem){
            albumInfoIdx.style.display = "";
          }
          else{
            albumInfoIdx.style.display = "none";
          }
        }
      }

      //eventos de la paginación.
      let currentAlbumInfo = flipContainer.getElementsByClassName("album-info-" + numItem)[0];
      let trackList = currentAlbumInfo.getElementsByClassName("table-tracklist")[0];
      let infoList = currentAlbumInfo.getElementsByClassName("table-info")[0];


      getDiscogsInfo(gtin, numItem).then((salida) => {

        Array.from(currentAlbumInfo.getElementsByClassName("item-skeleton")).forEach(it => {
            it.style.display = "none";
        });
        
        if (salida.numItems){
          backDiv.setAttribute("total-items", salida.numItems);
          backDiv.setAttribute("current-item", numItem);
          numItems = salida.numItems;

          //Gestión de la paginación.
          let paginationContainer = obj.parentNode.getElementsByClassName("pagination-button")[0];
          if (numItems > 1){
            paginationContainer.style.display = "";
            (obj.parentNode.getElementsByClassName("pagination-current")[0]).innerText = numItem + "/" + numItems;
          }
          else{
            paginationContainer.style.display = "none";
          }

          let paginationBack = obj.parentNode.getElementsByClassName("pagination-back")[0];

          if (numItem == 1){
            paginationBack.style.display = "none";
          }
          else{
            paginationBack.style.display = "";
          }
    
          let paginationForward = obj.parentNode.getElementsByClassName("pagination-forward")[0];
    
          if (numItem == numItems){
            paginationForward.style.display = "none";
          }
          else{
            paginationForward.style.display = "";
          }

        }

        if (salida.artists && salida.artists.length > 0){

          let sello = salida.labels && salida.labels.length > 0 ? salida.labels.map(it => it.name).join("/") : "";
          infoList.appendChild(newInfoIonItem("Sello", sello ));

          infoList.appendChild(newInfoIonItem("Año", salida.year));

          let formato = salida.formats && salida.formats.length > 0 ? salida.formats.map(it => it.qty + " x " + it.name + "(" + it.descriptions.join("/") +")").join(" / ") : "";
          infoList.appendChild(newInfoIonItem("Formato", formato ));

          let genero = salida.genres && salida.genres.length > 0  ? salida.genres.join("/") : "";
          infoList.appendChild(newInfoIonItem("Género", genero));

          let estilo = salida.styles && salida.styles.length > 0 ? salida.styles.join("/") : "";
          infoList.appendChild(newInfoIonItem("Estilo", estilo));

          infoList.appendChild(newInfoIonItem("Notas", salida.notes ? salida.notes : ""));

        //tracklist
          if (salida.tracklist && salida.tracklist.length > 0){
        
              salida.tracklist.forEach((item) => {

                let ionItem = document.createElement("ion-item");
                let artistas = (item.artists && item.artists.length > 0 ? item.artists.map(it => it.name) : []).join("/");
                let extraartist = (item.extraartists && item.extraartists.length > 0 ? item.extraartists.map(it => it.role + " " + it.name) : []).join("/");


                if (extraartist !== ""){
                  ionItem.setAttribute("onclick", "toggleArtist(this);");
                }

                ionItem.classList.add("ion-no-padding");
                ionItem.classList.add("discogs");
                ionItem.innerHTML =  "<ion-text class='w700 is-infoalbum' color='tertiary'>" + item.position + ".</ion-text>" 
                                  + "<p><ion-text class='is-infoalbum'>" + item.title + "</ion-text>" 
                                  + (item.duration !== "" ? "<ion-text class='is-infoalbum'>(" + item.duration + ")</ion-text>" : "")
                                  + (artistas !== "" ? "<ion-text class='is-infoalbum' color='tertiary'>" + artistas + "</ion-text>" : "")
                                  + (extraartist !== "" ? "<ion-icon class='is-infoalbum' name='caret-forward-outline'></ion-icon> <ion-text class='base' color='tertiary'>" + extraartist + "</ion-text>" : "")
                                  + "</p>";
                trackList.appendChild(ionItem);
              });
          }
      }
       
         if (numItem == 1){
          backDiv.setAttribute("style", "height:" + frontDiv.offsetHeight + "px;");
          backDiv.style.height = frontDiv.offsetHeight + "px;";
         }

         backDiv.style.display = "";
         frontDiv.style.display = "none";

         if (!paginating){
            obj.parentNode.getElementsByClassName("flip-container")[0].classList.toggle('flip');
          }

        });

    }

 
  }


}