//Tipos de búsqueda
const tiposBusqueda = [
  {"name":"lp-vinyl", "filter": "lpvinyl-K6IQQ1BLV9", "filter2":"LP%20(Vinyl)"},
  {"name":"single-vinyl", "filter":"singlevinyl-TVBN098J7D", "filter2":"Single%20(Vinyl)"},
  {"name":"cd", "filter":"cd-QQQ6F29MQA", "filter2": "CD"},
  {"name":"dvd", "filter":"dvd-DBRGQD0GK", "filter2": "DVD"},
  {"name" :"sacd", "filter":"sacd-TKLFV1USKM", "filter2": "SACD"},
  {"name" : "bluray", "filter":"bluray-FG3LG5QH90", "filter2": "Blu--Ray"}
];


//Listado de servidores a los que consultaremos.
const urlsDodax = [
  /*   {
    text: "AT",
    url: "https://www.dodax.at",
    proxy: "https://dodaxat.vinilo.workers.dev",
    all: "/de-at/search/",
    useProxy: true
  },*/
  {
    text: "DE",
    url: "https://www.dodax.de",
    proxy: "https://dodaxde.vinilo.workers.dev",
    all: "/de-de/search/",
    useProxy: true
    },
   {
     text: "FR",
     url: "https://www.dodax.fr",
     proxy: "https://dodaxfr.vinilo.workers.dev",
     all: "/fr-fr/search/",
     useProxy: true
   },
   {
     text: "UK",
     url: "https://www.dodax.co.uk",
     proxy: "https://dodaxuk.vinilo.workers.dev",
     all: "/en-gb/search/",
     useProxy: true
   }, 
   {
     text: "ES",
     url: "https://www.dodax.es",
     proxy: "https://dodaxes.vinilo.workers.dev",
     all: "/es-es/search/",
     useProxy: true
   }, 
  {
     text: "IT",
     url: "https://www.dodax.it",
     proxy: "https://dodaxit.vinilo.workers.dev",
     all: "/it-it/search/",
     useProxy: true
   },
   {
     text: "PL",
     url: "https://www.dodax.pl",
     proxy: "https://dodaxpl.vinilo.workers.dev",
     all: "/pl-pl/search/",
     useProxy: true
   }, 
   {
     text: "NL",
     url: "https://www.dodax.nl",
     proxy: "https://dodaxnl.vinilo.workers.dev",
     all: "/nl-nl/search/",
     useProxy: true
   }
  ];
  
//Proxy para evitar el CORS
let proxyurl = window.location.host.includes('netlify') ? "https://dodax-proxy.herokuapp.com/" : "https://api.codetabs.com/v1/proxy?quest=";

//https://api.codetabs.com/v1/proxy?quest=
//https://cors-anywhere.herokuapp.com/
//https://www.ryadel.com/en/corsflare-free-cors-reverse-proxy-bypass-same-origin/
//Parser para tratar el html que obtenemos.
let parser = new DOMParser();

//JSON con los tipos de cambio de las monedas.
let rates = null;
