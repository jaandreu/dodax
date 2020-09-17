    //Método que muestra u oculta el frame de buscando.
    const showSpinner = function(show, customMessage) {
       
        var loadingMessage = typeof customMessage !== "undefined" ? customMessage : "Hey Ho! Let's Go!";
 
        if (show){
 
         this.loadingController.create({
             message: loadingMessage
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
      }

          //Funciones auxiliares DOM
    const showElement = function(idElement){
        var elem = document.getElementById(idElement);
        if (elem != null) {
          elem.style.display = "";
        }
     }
 
     const hideElement = function(idElement){
        var elem = document.getElementById(idElement);
        if (elem != null) {
          elem.style.display = "none";
        }
     }
 
     const addClass = function(idElement, className){
        var elem = document.getElementById(idElement);
        if (elem != null) {
         elem.classList.add(className)
        }
     }
 
     const removeClass = function(idElement, className){
        var elem = document.getElementById(idElement);
        if (elem != null) {
         elem.classList.remove(className)
        }
     }
 
      