
//Se ha cargado el HTML completamente.
document.addEventListener("DOMContentLoaded", function(event) { 

    console.log('DOMContentLoaded');
    hideElement("fab-delete");
    getCurrencyRates()
       .then((salida) => {
         rates = salida;
     });

    //última búsqueda
    let lastSearchResult = sessionStorage.getItem('lastSearchResult');
    let lastSearch = sessionStorage.getItem('lastSearch');

    if (lastSearchResult != null){
      document.getElementById("div-resultados").innerHTML = lastSearchResult;
      document.getElementById("search").value = lastSearch;
      if (sessionStorage.getItem("moreItems") === "1"){
          infiniteScroll.disabled = false;
      }
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
    hideElement("content-search");
  });

   //Página de configuración.
   document.getElementById('button-delete').addEventListener('click', function(){
    deleteAlbums();
  });


  //Click para guardar la configuración.
  document.getElementById('button-check').addEventListener('click', function(){
    showElement("content-search");

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

      //Inicializamos las rutas de las siguientes llamadas.
      sessionStorage.setItem('nextUrls', JSON.stringify([]));

      Array.from(document.getElementsByClassName("resultados-items")).forEach(element => {
          element.parentNode.removeChild(element);
      });
  
      sessionStorage.setItem("lastSearchIndex", "0");
  

} 