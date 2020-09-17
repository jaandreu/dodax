/*jshint esversion: 6 */
/*jshint esversion: 6 */

const getUrlsDodax = function (updateAlbum, servers){

    //Obtenemos las opciones de búsqueda.
    var filtro = "";

    if (!updateAlbum){
      filtro = tiposBusqueda.filter((t) => {
          return document.getElementById(t.name).checked;
      }).map( tb => {
        return tb.filter;
      }).join("-");

      if (filtro !== ""){
        filtro = "-f-" +  filtro;
      }
      else{
        return [];
      }
    }

    return urlsDodax
        .filter(fil => {
           if (typeof servers !== "undefined" && servers.length > 0){
              return servers.includes(fil.text);
           }
           else {
             return true;
           }
        })
        .map(urlDodax => {
       
            var newUrl = {
                url: urlDodax.url,
                text: urlDodax.text,
                params: urlDodax.params + filtro + "/?s="
            };

            return newUrl;

        });

  };

  //Obtiene un JSON con los rates de las monedas en base al EUR.
  const getCurrencyRates = async () => {

      let respuesta = await fetch("https://api.exchangeratesapi.io/latest");
      let data = await respuesta.json();
      return data;

}  

  //Obtiene un importe en euros.
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
    var salida = "";
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

    console.log("Conectando:" + url);
    let respuesta = await fetch(url);
    let data = await respuesta.text();

    return {
         status: respuesta.status,
         data: data
    };

  };

  const updateAlbumPrices = function(idAlbum, updateAllServers) {

    var servers = [];

    var ficha = document.getElementById(idAlbum);

    //Si no hay que actualizar toda la ficha, metemos en un array los servidores pendientes de precio.
    if (!updateAllServers){

        Array.from(ficha.getElementsByClassName('waiting-price')).forEach(item => {
          servers.push(item.getAttribute('server'));
        });

    }
    else{
        //Si hay que actualizar toda la ficha vaciamos la ficha.
        removePrices(idAlbum);
    }

    hideElement("div-error")
    getAlbums(idAlbum, false, true, 0, servers);

  };

  const updateBestsPrices = function(idAlbum, minPrice){

     var fichaAlbum = document.getElementById(idAlbum);

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

    var fichaAlbum = document.getElementById(idAlbum);

    Array.from(fichaAlbum.getElementsByClassName('tr-albumprice')).forEach(tr => {
      tr.removeAttribute('href');
    });

    Array.from(fichaAlbum.getElementsByClassName('col-price')).forEach(col => {
      col.innerHTML = "<ion-spinner class='spinner-price' color='secondary' name='dots'></ion-spinner>";
    });

    Array.from(fichaAlbum.getElementsByClassName('col-originalprice')).forEach(col => {
      col.innerHTML = ""
    });

  };

  const removePendingPrices = function(idAlbum){

    var fichaAlbum = document.getElementById(idAlbum);
    fichaAlbum.setAttribute("pending-servers", 0);

    Array.from(fichaAlbum.getElementsByClassName('tr-albumprice')).forEach(tr => {
        tr.classList.remove('waiting-price');
    });

    Array.from(fichaAlbum.getElementsByClassName('spinner-price')).forEach(col => {
      col.setAttribute("color", "danger");
      col.setAttribute("paused", true);
    });

  };

  const setHTMLPrice = function(idAlbum, price, gtin){
      
       var ficha = document.getElementById(idAlbum);
       var minPrice = parseFloat(ficha.getAttribute('min-price'));
       var gtinFicha = ficha.getAttribute("gtin-ficha");
       ficha.setAttribute("pending-servers", parseInt(ficha.getAttribute("pending-servers")) - 1);

      if (gtinFicha === "" && gtin != ""){

         ficha.setAttribute("gtin-ficha", gtin);

         (ficha.getElementsByClassName("discogs")[0]).setAttribute("href", "https://www.discogs.com/search/?q=" + gtin +"&type=all"); 
         (ficha.getElementsByClassName("amazon")[0]).setAttribute("href", "https://www.amazon.es/s?k=" + gtin + "&i=popular&ref=nb_sb_noss"); 
         (ficha.getElementsByClassName("discogs")[0]).setAttribute("disabled", "false");
         (ficha.getElementsByClassName("amazon")[0]).setAttribute("disabled", "false");

       }

       var idPrecio = price.text + "-" + idAlbum;
       var trElement = document.getElementById(idPrecio);
       trElement.classList.remove('waiting-price');
       trElement.setAttribute('price-int', price.priceInt);
       trElement.classList.add('tr-albumprice');
       trElement.setAttribute('href', price.url);

       document.getElementById(idPrecio + "-PRICE").innerText = price.price + " " + price.currency;
       document.getElementById(idPrecio + "-ORIGINALPRICE").innerText = price.priceOriginal;

       if (parseFloat(minPrice) >= parseFloat(price.priceInt)) {
           ficha.setAttribute("min-price", price.priceInt);
           updateBestsPrices(idAlbum, price.priceInt);
       }

  };

  //Establece el HTML de un disco completo.
  const setHTMLAlbum = function(disco){

    var parser = new DOMParser();
    var base = parser.parseFromString(document.getElementById("div-base").outerHTML, "text/html");

    base.getElementById("div-base").setAttribute("id", disco.id);
    base.getElementById(disco.id).classList.remove('base');
    base.getElementById(disco.id).classList.add("resultados-items");
    base.getElementById(disco.id).setAttribute("min-price",disco.price.priceInt);
    base.getElementById(disco.id).setAttribute("gtin-ficha", disco.gtin);
    base.getElementById(disco.id).setAttribute("pending-servers", urlsDodax.length);
    base.getElementById("p-album").innerHTML = "<ion-text>" 
                                              + disco.title.toLowerCase()
                                              + "</ion-text>"
                                              + "<ion-badge color='warning'>"
                                              + disco.type
                                              + "</ion-badge>";
    
    base.getElementById("update-album").setAttribute("onclick", "updateAlbumPrices('"+ disco.id + "', true)");

    var spotifyString = encodeURIComponent(disco.from.toLowerCase() + " " + disco.title.toLowerCase().replace(/ \([\s\S]*?\)/g, ''));
    base.getElementById("a-spotify").setAttribute("href", "https://open.spotify.com/search/" + spotifyString);

    if (disco.gtin != ""){
      base.getElementById("a-discogs").setAttribute("href", "https://www.discogs.com/search/?q=" + disco.gtin +"&type=all");
      base.getElementById("a-amazon").setAttribute("href", "https://www.amazon.es/s?k=" + disco.gtin + "&i=popular&ref=nb_sb_noss");
      base.getElementById("a-discogs").setAttribute("disabled", "false");
      base.getElementById("a-amazon").setAttribute("disabled", "false");
    }

    base.getElementById("p-artist").innerText = disco.from.toLowerCase();
    base.getElementById("img-cover").setAttribute("src", disco.image);


    urlsDodax.forEach(url => {

      var idPrecio = url.text + "-" + disco.id;
      var trElement = document.createElement("ion-item");
      trElement.setAttribute("id", idPrecio);
      trElement.setAttribute("server", url.text);
      trElement.classList.add("ion-no-padding");
      trElement.classList.add("waiting-price");

      trElement.innerHTML = "<ion-grid class='no-padding'>"
                         +   "<ion-row>" 
                         +      "<ion-col class='col-server' size='2'>" + url.text + "</ion-col>"
                         +      "<ion-col class='col-price' size='5' id='" + idPrecio + "-PRICE'><ion-spinner class='spinner-price' color='secondary' name='dots'></ion-spinner></ion-col>"
                         +      "<ion-col class='col-originalprice' size='5' id='" + idPrecio + "-ORIGINALPRICE'></ion-col>"
                         +   "</ion-row>"
                         + "</ion-grid>";

      base.getElementById("table-precios-body").appendChild(trElement);

    })

    document.getElementById("div-resultados").appendChild(base.getElementById(disco.id));
    setHTMLPrice(disco.id, disco.price, disco.gtin);
  };

  //Invoca a todas las urls de Dodax al mismo tiempo para obtener su información.
  const getDodaxSitesAlbums = async (cadenaBusqueda, firstCall, updateAlbum, servers) => {

    var urls = firstCall || updateAlbum ? getUrlsDodax(updateAlbum, servers) : (JSON.parse(sessionStorage.getItem("nextUrls")));

    const requests = urls.map((urlDodax) => {

    const urlCompleta = proxyurl + urlDodax.url + urlDodax.params + (firstCall || updateAlbum ? cadenaBusqueda : "");

      return getDodaxAlbums(urlCompleta)
        .then((salida) => {

            var parser = new DOMParser();
            var doc = parser.parseFromString(salida.data, "text/html");
            var nextUrlElement = doc.getElementsByClassName('related_list')[0];

            return {

                url : urlDodax.url
               ,params: urlDodax.params
               ,text: urlDodax.text
               ,listaAlbums: doc.getElementsByClassName('product')
               ,nextUrl: nextUrlElement != null ? nextUrlElement.getAttribute('data-scroller-next-url') : null
               ,error: (salida.status !== 200 ? salida.data : "")

            };

        });
    })

    return Promise.all(requests)
  };

  //Variables globales.
  var rates = null;

  //Obtiene los albums que coinciden con la cadena de búsqueda, a partir de n items (es paginado.)
  const getAlbums = function (cadenaBusqueda, firstCall, updateAlbum, index, servers) {

    getDodaxSitesAlbums(cadenaBusqueda, firstCall, updateAlbum, servers)
      .then(content => {

        var hayResultados = false;
        var mostrarMasResultados = false;
        var nextUrls = [];

        content.forEach(resultado => {

          //Si ha habido un error mostramos el mensaje pero procesamos la respuesta.
          if (resultado.error !== ""){
            console.log(resultado.error);
            showElement("div-error");
          }
          
          mostrarMasResultados = resultado.nextUrl != null && index === 0;

          if (resultado.nextUrl != null) {
            
            nextUrls.push({
              url: resultado.url
             ,params: resultado.nextUrl
             ,text: resultado.text
            });

          }

          Array.from(resultado.listaAlbums).forEach(album => {

             hayResultados = true;

             //Identificador del album
             var idAlbum = (album.getElementsByClassName('js-product')[0]).getAttribute('id');
             //Precio del disco.
             var precio = ((album.getElementsByClassName('buy-button')[0]).getElementsByTagName('span')[0]).innerText
               .replace("€", "")
               .replace("£", "")
               .replace("zł", "")
               .replace(".", ",")
               .replace(" ", "")
               .replace(String.fromCharCode(160), "")
               .replace("&nbsp;", "");

             //Código de barras.
             var gtin =  (album.getElementsByClassName('buy-button')[0]).getAttribute('onmousedown');
             gtin = (gtin !== null) ? gtin.replace("RetailRocket.addToCartRetailRocket('", "").replace("');", "") : "";

             //Url del detalle del disco.
             var urlRelativa = (album.getElementsByClassName('js-product')[0]).getAttribute('href');
             //Existe ya la ficha?
             var encontrado = document.getElementById(idAlbum) != null;
             //Datos del precio.
             var precioObj = {
               url: resultado.url + urlRelativa,
               price: getPrice(precio, resultado.text).replace(".", ","),
               priceInt: getPrice(precio, resultado.text),
               priceOriginal: getCurrency(precio, resultado.text),
               currency: "€",
               text: resultado.text,
             };

            if (encontrado) {
              setHTMLPrice(idAlbum, precioObj, gtin)
            } else {

              //El disco no está cargado en la página.  
              var obj = {};
              obj.id = idAlbum;
              obj.image =  (album.getElementsByTagName('img')[0]).getAttribute('src');
              obj.title = (album.getElementsByClassName('product_title')[0]).innerText;
              obj.from = (album.getElementsByClassName('product_from')[0]).innerText;
              obj.type = (album.getElementsByClassName('product_type')[0]).innerText;
              obj.price = precioObj;
              obj.minPrice = precioObj.priceInt;
              obj.gtin = gtin;

              setHTMLAlbum(obj);

            }

          });

        });

        if (firstCall && !hayResultados){
          showElement("div-noresult");
        }

        if (!updateAlbum){
          sessionStorage.setItem('nextUrls', JSON.stringify(nextUrls));
        }

        if (!updateAlbum){
          //Quedan más resultados.
          if (nextUrls.length > 0 && index < 0) {
            getAlbums(cadenaBusqueda, false, false, index + 1);
          }
          else{

            if (mostrarMasResultados){
                //showElement("div-button-more");
                infiniteScroll.disabled = false;
                sessionStorage.setItem("moreItems", "1");
            }
            else{
                  //hideElement("div-button-more");
                  sessionStorage.setItem("moreItems", "0");
                  infiniteScroll.disabled = true;
            }
          }
        }
  
        var htmlToSave = document.getElementById("div-resultados").innerHTML;
        sessionStorage.setItem('lastSearchResult', htmlToSave);
        
        //completamos los albums pendientes.
        if (!updateAlbum){
          showSpinner(false);   
          Array.from(document.getElementsByTagName('ion-col')).forEach( col => {
              if (parseInt(col.getAttribute("pending-servers")) > 0){
                  updateAlbumPrices(col.id, false);
              }
            });
        }
        else{
            removePendingPrices(cadenaBusqueda);
        }

      });
  };