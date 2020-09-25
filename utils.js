//Método que muestra u oculta el spinner de buscando.
const showSpinner = function(show, customMessage) {
    
    var loadingMessage = typeof customMessage !== "undefined" ? customMessage : "Hey Ho! Let's Go!";

    if (show){

      //Creamos el componente (10 segundos como máximo.)
      this.loadingController.create({
          message: loadingMessage,
          duration: 10000
        }).then((res) => {
          res.present();
        });

    }
    else{

      this.loadingController.dismiss().then((res) => {
        console.log("Quitando loading...");
      }).catch((error) => {
        console.log('error', error);
      });

    }
};

//Método para cambiar el mensaje del spinner.
const changeSpinnerMessage = function(message){
  const elem = document.querySelector("div.loading-wrapper div.loading-content");
  if(elem){
    elem.innerHTML = message;
  }
}

//Funciones auxiliares DOM
const showElement = function(idElement){
    let elem = document.getElementById(idElement);
    if (elem != null) {
      elem.style.display = "";
    }
};
 
const hideElement = function(idElement){
  let elem = document.getElementById(idElement);
  if (elem != null) {
    elem.style.display = "none";
  }
};
 
const addClass = function(idElement, className){
  let elem = document.getElementById(idElement);
  if (elem != null) {
    elem.classList.add(className);
  }
};
 
const removeClass = function(idElement, className){
  let elem = document.getElementById(idElement);
  if (elem != null) {
    elem.classList.remove(className);
  }
};
 