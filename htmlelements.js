
//ion-item para la información del album.
const newInfoIonItem = function (title, text){

    let ionItem = document.createElement("ion-item");
    ionItem.classList.add("ion-no-padding", "discogs");

    ionItem.innerHTML = "<ion-text class='w700' color='tertiary'>" + title + "</ion-text>" 
                      + "<ion-text>" + text + "</ion-text>" 
  
    return ionItem;
}
  