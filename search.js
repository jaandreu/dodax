//Obtiene la lista de servidores a los que nos conectaremos.
const getUrlsDodax = function (servers){

    //Obtenemos las opciones de búsqueda.
    let filtro = "";

    filtro = tiposBusqueda.filter((t) => {
        return document.getElementById(t.name).checked;
    }).map( tb => {
      return tb.filter;
    }).join("-");

    filtro2 = tiposBusqueda.filter((t) => {
      return document.getElementById(t.name).checked;
    }).map( tb => {
      return "productTypeName-" + tb.filter2;
    }).join("-");


    return (filtro == "") ? [] : 
              urlsDodax
                .filter(fil => {
                  return (typeof servers !== "undefined" && servers.length > 0) ? servers.includes(fil.text) : true;
                })
                .map(urlDodax => {
                    return {
                        url: (urlDodax.useProxy ? urlDodax.proxy : urlDodax.url),
                        urlLink: urlDodax.url,
                        text: urlDodax.text,
                        params: urlDodax.all + (urlDodax.text == "UK" ? "f-'" + filtro2 : "f-"  + filtro) + "/?s=",
                        proxy: urlDodax.useProxy
                    };
                });
  };

  //Obtiene un JSON con los rates de las monedas en base al EUR.
  const getCurrencyRates = async () => {

      let respuesta = await fetch("https://api.exchangeratesapi.io/latest");
      let data = await respuesta.json();
      return data;

  }  

  //Obtiene información sobre un album de discogs.
  const getDiscogsInfo = async(barcode, item) => {
    
    let url = "https://vinilo.herokuapp.com/discogs/" + barcode + "/" + item + "/tracklist";
    let respuesta = await fetch(url);
    let data = await respuesta.json();

    return data;

  }
  
  //Obtiene un importe en euros, en función de la moneda hace la conversión con el rate indicado.
  const getPrice = function (price, codigo) {
    if (rates != null) {

      switch (codigo) {
        case "UK":
          salida = (parseFloat(price.replace(",", ".")) * (1 / rates.rates["GBP"])).toFixed(2);
          break;
        case "PL":
          salida = (parseFloat(price.replace(",", ".")) * (1 / rates.rates["PLN"])).toFixed(2);
          break;
        default:
          salida = parseFloat(price.replace(",", ".")).toFixed(2);
      }
    } else {
      salida = parseFloat(price.replace(",", ".")).toFixed(2);
    }
    return salida;
  };

  //Obtiene el caracter de moneda en función del código de pais.
  const getCurrency = function (price, codigo) {
    let salida = "";
    switch (codigo) {
      case "UK":
        salida = price + " £";
        break;
      case "PL":
        salida = price + " zł";
        break;
      default:
        salida = "";

    }
    return salida;
  };

  //Devuelve la información de los albums de una url de Dodax.
  const getDodaxAlbums = async (url) => {

    const controller = new AbortController();
    const signal = controller.signal;

    //Aborta el controlador al pasar 10 segundos.
    const timer = setTimeout(() => {
      controller.abort();
    }, 10000);

    console.log("Conectando:" + url);

    let error = "Vaya! algo ha pasado...:";

    let respuesta = await fetch(url, { signal })
                         .finally(() => {
                              clearTimeout(timer);
                              console.log("finalizado fetch.")
                         })
                         .catch(err => {
                              error += err.name === 'AbortError' ? "timeout de la conexión." : err.message;
                         });


    return {
      status: respuesta ? respuesta.status : -1,
      data:  respuesta ? await respuesta.text() : error
    }                            

  };

  const updateAlbumPrices = function(idAlbum, updateAllServers) {

    let servers = [];

    let ficha = document.getElementById(idAlbum);

    //Si no hay que actualizar toda la ficha, metemos en un array los servidores pendientes de precio.
    if (!updateAllServers){

        Array.from(ficha.getElementsByClassName('waiting-price')).forEach(item => {
          servers.push(item.getAttribute('server'));

          Array.from(item.getElementsByClassName('col-price')).forEach(col => {
            col.innerHTML = "<ion-spinner class='spinner-price' color='primary' name='dots'></ion-spinner>";
          });
  
        });

    }
    else{
        //Si hay que actualizar toda la ficha vaciamos la ficha.
        removePrices(idAlbum);
    }

    getAlbums(idAlbum, false, true, servers);

  };

  const updateBestsPrices = function(idAlbum, minPrice){

     let fichaAlbum = document.getElementById(idAlbum);

     Array.from(fichaAlbum.getElementsByClassName('tr-albumprice')).forEach(tr => {

        if (tr.getAttribute('price-int') === minPrice){
            tr.setAttribute("color", "secondary");
        }
        else{
          tr.removeAttribute("color");
        }
        
     });

  };

  const removePrices = function(idAlbum){

    let fichaAlbum = document.getElementById(idAlbum);

    Array.from(fichaAlbum.getElementsByClassName('tr-albumprice')).forEach(tr => {
      tr.removeAttribute('href');
    });

    Array.from(fichaAlbum.getElementsByClassName('col-price')).forEach(col => {
      col.innerHTML = "<ion-spinner class='spinner-price' color='primary' name='dots'></ion-spinner>";
    });

    Array.from(fichaAlbum.getElementsByClassName('col-originalprice')).forEach(col => {
      col.innerHTML = ""
    });

  };

  const removePendingPrices = function(idAlbum){

    let fichaAlbum = document.getElementById(idAlbum);
    fichaAlbum.setAttribute("pending-servers", 0);

    Array.from(fichaAlbum.getElementsByClassName('waiting-price')).forEach(tr => {
        tr.classList.remove('waiting-price');
    });

    Array.from(fichaAlbum.getElementsByClassName('spinner-price')).forEach(col => {
      col.setAttribute("color", "danger");
      col.setAttribute("paused", true);
    });

  };

  const setPaginationEvents = function (idAlbum){

    let ficha = document.getElementById(idAlbum);

    ficha.getElementsByClassName("pagination-forward")[0].addEventListener("click", (ev) => {
        var image = ficha.getElementsByClassName("img-album-cover")[0];
        var backDiv = ficha.getElementsByClassName("back")[0];
        flip(image, ficha.getAttribute("gtin-ficha"), parseInt(backDiv.getAttribute("current-item")) + 1, true);
      ev.stopPropagation();
    });

    ficha.getElementsByClassName("pagination-back")[0].addEventListener("click", (ev) => {
      var image = ficha.getElementsByClassName("img-album-cover")[0];
      var backDiv = ficha.getElementsByClassName("back")[0];
      flip(image, ficha.getAttribute("gtin-ficha"), parseInt(backDiv.getAttribute("current-item")) - 1, true);
      ev.stopPropagation();

    }); 

  }
  const setHTMLPrice = function(idAlbum, price, gtin){
      
       let ficha = document.getElementById(idAlbum);
       let minPrice = parseFloat(ficha.getAttribute('min-price'));
       let gtinFicha = ficha.getAttribute("gtin-ficha");
       ficha.setAttribute("pending-servers", parseInt(ficha.getAttribute("pending-servers")) - 1);

      if (gtinFicha === "" && gtin != ""){

         ficha.setAttribute("gtin-ficha", gtin);

         (ficha.getElementsByClassName("discogs")[0]).setAttribute("href", "https://www.discogs.com/search/?q=" + gtin +"&type=all"); 
         (ficha.getElementsByClassName("amazon")[0]).setAttribute("href", "https://www.amazon.es/s?k=" + gtin + "&i=popular&ref=nb_sb_noss"); 
         (ficha.getElementsByClassName("discogs")[0]).setAttribute("disabled", "false");
         (ficha.getElementsByClassName("amazon")[0]).setAttribute("disabled", "false");

         let imagen = document.getElementById("img-cover-" +  idAlbum);
         imagen.setAttribute("onclick", "flip(this, '" + gtin + "',1,false);");

       }

       let idPrecio = price.text + "-" + idAlbum;
       let trElement = document.getElementById(idPrecio);
       trElement.classList.remove('waiting-price');
       trElement.setAttribute('price-int', price.priceInt);
       trElement.classList.add('tr-albumprice');
       trElement.setAttribute('href', price.url);

       let copyButton = document.getElementById(idPrecio + "-Url");

       document.getElementById(idPrecio + "-Url").addEventListener('ionSwipe', function(event){
          copyButtonEvent(price.url);
       });

       copyButton.setAttribute("onclick", "copyButtonEvent('" + price.url + "');");

       document.getElementById(idPrecio + "-PRICE").innerText = price.price + " " + price.currency;
       document.getElementById(idPrecio + "-ORIGINALPRICE").innerText = price.priceOriginal;
       let priceStock = parseInt(price.stock);

       if (priceStock > 0 ){
        let color = priceStock < 6 ? "danger" : (priceStock < 11 ? "warning" : "success");
        document.getElementById(idPrecio + "-QTY").innerHTML = "<ion-badge color='tertiary'>" + price.stock + "</ion-badge>";
       }

       if (parseFloat(minPrice) >= parseFloat(price.priceInt)) {
           ficha.setAttribute("min-price", price.priceInt);
           updateBestsPrices(idAlbum, price.priceInt);
       }

  };

  //Establece el HTML de un disco completo.
  const setHTMLAlbum = function(disco){

    let base = parser.parseFromString(document.getElementById("div-base").outerHTML, "text/html");

    base.getElementById("div-base").setAttribute("id", disco.id);
    base.getElementById(disco.id).classList.remove('base');
    base.getElementById(disco.id).classList.add("resultados-items");
    base.getElementById(disco.id).setAttribute("min-price",disco.price.priceInt);
    base.getElementById(disco.id).setAttribute("gtin-ficha", disco.gtin);
    base.getElementById(disco.id).setAttribute("pending-servers", urlsDodax.length);
    base.getElementById("p-album").innerHTML = "<ion-text>" 
                                              + disco.title.toLowerCase()
                                              + "</ion-text>"
                                              + "<ion-badge color='secondary'>"
                                              + disco.type
                                              + "</ion-badge>";
    
    base.getElementById("update-album").setAttribute("onclick", "updateAlbumPrices('"+ disco.id + "', true)");

    let spotifyString = encodeURIComponent(disco.from.toLowerCase() + " " + disco.title.toLowerCase().replace(/ \([\s\S]*?\)/g, ''));
    base.getElementById("a-spotify").setAttribute("href", "https://open.spotify.com/search/" + spotifyString);

    if (disco.gtin != ""){
      base.getElementById("a-discogs").setAttribute("href", "https://www.discogs.com/search/?q=" + disco.gtin +"&type=all");
      base.getElementById("a-amazon").setAttribute("href", "https://www.amazon.es/s?k=" + disco.gtin + "&i=popular&ref=nb_sb_noss");
      base.getElementById("a-discogs").setAttribute("disabled", "false");
      base.getElementById("a-amazon").setAttribute("disabled", "false");
    }

    base.getElementById("p-artist").innerText = disco.from.toLowerCase();
    let imagen = base.getElementById("img-cover");
    imagen.id = "img-cover-" +  disco.id;
    imagen.setAttribute("src", disco.image);
  
    if (disco.gtin != ""){
      imagen.setAttribute("onclick", "flip(this, '" + disco.gtin + "', 1, false);");
    }

    urlsDodax.forEach(url => {

      let idPrecio = url.text + "-" + disco.id;
      let trElement = document.createElement("ion-item-sliding");

      let ionItem = "<ion-item "
                  +    " id = '" + idPrecio + "' "
                  +    " server = '" + url.text + "' "
                  +    " class= 'ion-no-padding waiting-price'>";

      let copyButton = "<ion-item-options id='" + idPrecio +"-Url' side='start'><ion-item-option expandable color='primary'><ion-icon name='copy-outline'></ion-icon></ion-item-option></ion-item-options>";

      trElement.innerHTML = ionItem 
                         + "<ion-grid class='no-padding'>"
                         +   "<ion-row>" 
                         +      "<ion-col class='col-server' size='2'>" + url.text + "</ion-col>"
                         +      "<ion-col class='col-price' size='4' id='" + idPrecio + "-PRICE'><ion-spinner class='spinner-price' paused='true' color='primary' name='dots'></ion-spinner></ion-col>"
                         +      "<ion-col class='col-originalprice' size='4' id='" + idPrecio + "-ORIGINALPRICE'></ion-col>"
                         +      "<ion-col class='col-qty' size='2' id='" + idPrecio + "-QTY'></ion-col>"
                         +   "</ion-row>"
                         + "</ion-grid>"
                         + "</ion-item>"
                         +  copyButton;

      base.getElementById("table-precios-body").appendChild(trElement);

    })

    document.getElementById("div-resultados").appendChild(base.getElementById(disco.id));
    setHTMLPrice(disco.id, disco.price, disco.gtin);
    setPaginationEvents(disco.id);
  };

  //Invoca a todas las urls de Dodax al mismo tiempo para obtener su información.
  const getDodaxSitesAlbums = async (cadenaBusqueda, firstCall, updateAlbum, servers) => {

    let urls = firstCall || updateAlbum ? getUrlsDodax(servers) : (JSON.parse(sessionStorage.getItem("nextUrls")));

    const requests = urls.map((urlDodax) => {

      const urlCompleta = (urlDodax.proxy ? "" : proxyurl) + urlDodax.url + urlDodax.params + (firstCall || updateAlbum ? cadenaBusqueda : "");

      return getDodaxAlbums(urlCompleta)
        .then((salida) => {

           let vlistaAlbums = null;
           let vnextUrl = null;
 
           if (salida.status === 200){

            let doc = parser.parseFromString(salida.data, "text/html");
            let nextUrlElement = doc.querySelector("[data-qa='paginationLinkNext']")

            if (nextUrlElement != null){
              vnextUrl = nextUrlElement.getAttribute('href');
            }

            vlistaAlbums = doc.getElementsByClassName('c-frontOfPack');
           
          }

          return {
            url : urlDodax.url
            ,params: urlDodax.params
            ,text: urlDodax.text
            ,listaAlbums: vlistaAlbums
            ,nextUrl: vnextUrl
            ,error: (salida.status !== 200 ? salida.data : "")
            ,proxy: urlDodax.proxy
            ,urlLink: urlDodax.urlLink
            };

        });
    })

    return Promise.all(requests)
  };

  //Obtiene los albums que coinciden con la cadena de búsqueda, a partir de n items (es paginado.)
  const getAlbums = function (cadenaBusqueda, firstCall, updateAlbum, servers, callback) {

    getDodaxSitesAlbums(cadenaBusqueda, firstCall, updateAlbum, servers, callback)
      .then(content => {

        let hayResultados = false;
        let mostrarMasResultados = false;
        let nextUrls = [];

        content.forEach(resultado => {

          //Si ha habido un error mostramos el mensaje pero procesamos la respuesta.
          if (resultado.error !== ""){
            console.log(resultado.error);
            presentToast('Ha fallado alguna de las conexiones ...',3000, "error")
          }
          else{
          
              mostrarMasResultados = resultado.nextUrl != null;

              if (mostrarMasResultados) {
                
                nextUrls.push({
                  url: resultado.url
                ,params: resultado.nextUrl
                ,text: resultado.text
                ,proxy: resultado.proxy
                });

              }

              changeSpinnerMessage("God Save The Queen!")

              Array.from(resultado.listaAlbums).forEach(album => {

                if (!hayResultados){
                  hideElement("div-history");
                  if (!updateAlbum){
                    hideElement("fab-delete");
                  }
                }

                hayResultados = true;


                //Identificador del album
                let idAlbum = album.getAttribute("data-product-id");
                //Precio del disco.
                let precio = album.getAttribute("data-product-price")
                  .replace("€", "")
                  .replace("£", "")
                  .replace("zł", "")
                  .replace(".", ",")
                  .replace(" ", "")
                  .replace(String.fromCharCode(160), "")
                  .replace("&nbsp;", "");

                //Código de barras.
                let gtin =  album.getAttribute("data-product-gtin");

                //Url del detalle del disco.
                let urlRelativa = album.getAttribute("data-product-url");
                //Stock
                let stockQty = album.getAttribute("data-stock-qty");

                //Existe ya la ficha?
                let encontrado = document.getElementById(idAlbum) != null;

                let typeAlbum = album.getElementsByClassName("d-none")[0].innerText;

                //Datos del precio.
                let precioObj = {
                  url: resultado.urlLink + urlRelativa,
                  price: getPrice(precio, resultado.text).replace(".", ","),
                  priceInt: getPrice(precio, resultado.text),
                  priceOriginal: getCurrency(precio, resultado.text),
                  currency: "€",
                  text: resultado.text,
                  stock: stockQty
                };

                if (encontrado) {
                  setHTMLPrice(idAlbum, precioObj, gtin)
                } else {

                  //El disco no está cargado en la página.  
                  let obj = {};
                  obj.id = idAlbum;
                  obj.image = (album.getElementsByTagName('img')[0]).getAttribute('src');
                  obj.title = album.getAttribute("data-product-name") || "";
                  obj.from = album.getAttribute("data-product-brand") || "";
                  //obj.type = album.getAttribute("data-product-category");
                  obj.type = typeAlbum;
                  obj.price = precioObj;
                  obj.minPrice = precioObj.priceInt;
                  obj.gtin = gtin;

                  setHTMLAlbum(obj);

                }

              });
           }
        });

        if (firstCall && !hayResultados && !updateAlbum){
          presentToast('Sin resultados, cambie los términos de búsqueda', 3000, "info");
          showSpinner(false);   
        }

        if (!updateAlbum){
          sessionStorage.setItem('nextUrls', JSON.stringify(nextUrls));
        }

        if (!updateAlbum){
            if (mostrarMasResultados){
                infiniteScroll.disabled = false;
                sessionStorage.setItem("moreItems", "1");
            }
            else{
                  sessionStorage.setItem("moreItems", "0");
                  infiniteScroll.disabled = true;
            }
        }
  
        let htmlToSave = document.getElementById("div-resultados").innerHTML;
        sessionStorage.setItem('lastSearchResult', htmlToSave);

        //completamos los albums pendientes.
        if (!updateAlbum){
          showSpinner(false);   
        }
        else{
            removePendingPrices(cadenaBusqueda);
        }

        let firstAlbum = true;

        Array.from(document.getElementsByTagName('ion-col')).forEach( col => {
          if (parseInt(col.getAttribute("pending-servers")) > 0 && firstAlbum){
            firstAlbum = false;
            sessionStorage.setItem('updating', "1");
            updateAlbumPrices(col.id, false);
          }
        });

        if (firstAlbum){
          sessionStorage.setItem('updating', "0");
          if (hayResultados){
            showElement("fab-delete");
          }
        }

        if (typeof callback === "function"){
          callback();
        }

      });
  };