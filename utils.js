//Método que muestra u oculta el frame de buscando.
    const showSpinner = function(show, customMessage) {
       
        var loadingMessage = typeof customMessage !== "undefined" ? customMessage : "Hey Ho! Let's Go!";
 
        if (show){
 
         this.loadingController.create({
             message: loadingMessage,
             duration: 10000
           }).then((res) => {
             res.present();
           });
 
        }
        else{
          debugger;
         this.loadingController.dismiss().then((res) => {
           console.log("Quitando loading...");
         }).catch((error) => {
           console.log('error', error);
         });
 
        }
      };

    const changeSpinnerMessage = function(message){
      const elem = document.querySelector("div.loading-wrapper div.loading-content");
       if(elem){
          elem.innerHTML = message;
       }
    }

          //Funciones auxiliares DOM
    const showElement = function(idElement){
        var elem = document.getElementById(idElement);
        if (elem != null) {
          elem.style.display = "";
        }
     };
 
     const hideElement = function(idElement){
        var elem = document.getElementById(idElement);
        if (elem != null) {
          elem.style.display = "none";
        }
     };
 
     const addClass = function(idElement, className){
        var elem = document.getElementById(idElement);
        if (elem != null) {
         elem.classList.add(className);
        }
     };
 
     const removeClass = function(idElement, className){
        var elem = document.getElementById(idElement);
        if (elem != null) {
         elem.classList.remove(className);
        }
     };
 
    /**
    * Timeout function
    * @param {Integer} time (miliseconds)
    * @param {Promise} promise
    */
    const timeout = (time, promise) => {
      return new Promise(function(resolve, reject) {
        setTimeout(() => {
          reject(new Error('Request timed out.'))
        }, time);
        promise.then(resolve, reject);
      });
    } 