
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
      hideElement("content-seccion");
      hideElement("content-otros");
      showElement("content-formato");
    }

    if (ev.target.value == "seccion"){
      showElement("content-seccion");
      hideElement("content-otros");
      hideElement("content-formato");
    }
    if (ev.target.value == "otros"){
      hideElement("content-seccion");
      showElement("content-otros");
      hideElement("content-formato");
    }

  })
}
const flip = function(obj, gtin) {

  
  let flipContainer = obj.parentNode.getElementsByClassName("flip-container")[0];
  let imFlip = flipContainer.classList.contains("flip");
  let frontDiv = flipContainer.getElementsByClassName("front")[0];
  let backDiv = flipContainer.getElementsByClassName("back")[0];
  let trackList = flipContainer.getElementsByClassName("table-tracklist")[0];
  let infoList = flipContainer.getElementsByClassName("table-info")[0];

   if (!imFlip){

    if (!trackList.classList.contains("invocado")){

      getDiscogsInfo(gtin).then((salida) => {

        //Lo marcamos para no volver a invocar.
        trackList.classList.add("invocado");

        Array.from(flipContainer.getElementsByClassName("item-skeleton")).forEach(it => {
            it.style.display = "none";
        });
        
          if (salida.artists && salida.artists.length > 0){

          let sello = salida.labels && salida.labels.length > 0
                      ? salida.labels.map(it => it.name).join("/")
                      : "";
          infoList.appendChild(newInfoIonItem("Sello", sello ));

          infoList.appendChild(newInfoIonItem("Año", salida.year));

          let formato = salida.formats && salida.formats.length > 0 
                    ? salida.formats.map(it => it.qty + " x " + it.name + "(" + it.descriptions.join("/") +")").join("/") 
                    : "";
          infoList.appendChild(newInfoIonItem("Formato", formato ));

          let genero = salida.genres && salida.genres.length > 0 
              ? salida.genres.join("/")
              : "";
          infoList.appendChild(newInfoIonItem("Género", genero));

          let estilo = salida.styles && salida.styles.length > 0 
            ? salida.styles.join("/")
            : "";
          infoList.appendChild(newInfoIonItem("Estilo", estilo));

          infoList.appendChild(newInfoIonItem("Notas", salida.notes ? salida.notes : ""));

        //tracklist
        if (salida.tracklist && salida.tracklist.length > 0){
      
            salida.tracklist.forEach((item) => {
              let ionItem = document.createElement("ion-item");
              let artists = item.artists && item.artists.length > 0 ? item.artists.map(it => it.name) : [];
              let extraartist = item.extraartists && item.extraartists.length > 0 ? item.extraartists.map(it => it.role + " " + it.name) : [];
              let artistas = artists.concat(extraartist).join("/");

              ionItem.classList.add("ion-no-padding");
              ionItem.classList.add("discogs");
              ionItem.innerHTML =  "<ion-text><b>" + item.position + ".</b></ion-text>" 
                                 + "<p><ion-text>" + item.title + "</ion-text>" 
                                 + (item.duration !== "" ? "<ion-text>(" + item.duration + ")</ion-text>" : "")
                                 + "<ion-text color='secondary'>" + artistas + "</ion-text></p>";

              trackList.appendChild(ionItem);
            });
        }
      }
      });
    }

     backDiv.setAttribute("style", "height:" + frontDiv.offsetHeight + "px;");
     backDiv.style.height = frontDiv.offsetHeight + "px;";
     backDiv.style.display = "";
     frontDiv.style.display = "none";
   }
   else{
      backDiv.style.display = "none"; 
      frontDiv.style.display = "";
   }

  obj.parentNode.getElementsByClassName("flip-container")[0].classList.toggle('flip');

}