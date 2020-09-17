
/*Se han cargado HTML y recursos completamente*/
window.addEventListener('load', (event) => {

    console.log('window.load');

});
  
/*Se ha cargado el HTML completamente*/
document.addEventListener("DOMContentLoaded", function(event) { 

    console.log('DOMContentLoaded');

    getCurrencyRates()
       .then((salida) => {
         rates = salida;
     });

    // //última búsqueda
     var lastSearchResult = sessionStorage.getItem('lastSearchResult');
     var lastSearch = sessionStorage.getItem('lastSearch');

     if (lastSearchResult != null){
       document.getElementById("div-resultados").innerHTML = lastSearchResult;
       document.getElementById("search").value = lastSearch;
       if (sessionStorage.getItem("moreItems") === "1"){
           infiniteScroll.disabled = false;
       }
 
     }

    //última configuración.
    var lastConf = localStorage.getItem("conf");

    if (lastConf !== null){

      JSON.parse(lastConf).forEach(item => {
          document.getElementById(item.name).checked = item.checked;
      });

    }
    
  });

  document.getElementById("formulario").addEventListener('submit', function(){

    cadenaBusqueda = document.getElementById("search").value
                        .toUpperCase()
                        .replace("VINILO", "")
                        .replace("VINYL", "")
                        .replace(" CD", "")
                        .replace(" LP","")
                        .replace("CD ", "")
                        .replace("LP ","")
                        .trim()
                        .replace(/ /g, '+');

    //Como mínimo 6 caracteres de búsqueda.
    if (cadenaBusqueda.length < 2)
      return false;

    sessionStorage.setItem('lastSearch', cadenaBusqueda);

    //Inicializamos las rutas de las siguientes llamadas.
    sessionStorage.setItem('nextUrls', JSON.stringify([]));

    showSpinner(true);

    //hideElement("div-error")
    //hideElement("div-noresult");
    hideElement("div-resultados");

    Array.from(document.getElementsByClassName("resultados-items")).forEach(element => {
        element.parentNode.removeChild(element);
    });

    sessionStorage.setItem("lastSearchIndex", "0");
    getAlbums(cadenaBusqueda, true, false, 0, []);
    
    showElement("div-resultados");

  });

  /*Infinite scroll*/
  const infiniteScroll = document.getElementById('infinite-scroll');
  
  infiniteScroll.addEventListener('ionInfinite', async function () {
    
    if (sessionStorage.getItem("moreItems") == "1"){
      console.log('Loading data...');
      showSpinner(true);
      var cadenaBusquedaActual = sessionStorage.getItem("lastSearch");
      getAlbums(cadenaBusquedaActual, false, false, 0, [], function(){
        infiniteScroll.complete();
      });
    }
    else{
      console.log('No More Data');
        infiniteScroll.disabled = true;
    }
  });

  document.getElementById('button-settings').addEventListener('click', function(){
    showElement("content-settings");
    hideElement("content-search");
  });

  document.getElementById('button-check').addEventListener('click', function(){
    showElement("content-search");

    var conf = [];

    Array.from(document.getElementsByClassName("formato")).forEach(check => {
        conf.push({name: check.name, checked: check.checked});
    });

    localStorage.setItem("conf", JSON.stringify(conf));

    hideElement("content-settings");

  });

  async function presentToast() {
    const toast = document.createElement('ion-toast');
    toast.message = 'No se han encontrado coincidencias';
    toast.duration = 3000;
  
    document.body.appendChild(toast);
    return toast.present();
  };

