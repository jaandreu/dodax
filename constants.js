//Tipos de búsqueda
const tiposBusqueda = [
  {"name":"lp-vinyl", "filter": "lpvinyl-K6IQQ1BLV9"},
  {"name":"single-vinyl", "filter":"singlevinyl-TVBN098J7D"},
  {"name":"cd", "filter":"cd-QQQ6F29MQA"},
  {"name":"dvd", "filter":"dvd-DBRGQD0GK"},
  {"name" :"sacd", "filter":"sacd-TKLFV1USKM"},
  {"name" : "bluray", "filter":"bluray-FG3LG5QH90"}
];


//Listado de servidores a los que consultaremos.
const urlsDodax = [
     {
    text: "AT",
    url: "https://www.dodax.at",
    all: "/de-at/search/"
  },
  {
    text: "DE",
    url: "https://www.dodax.de",
    all: "/de-de/search/"
    },
   {
     text: "FR",
     url: "https://www.dodax.fr",
     all: "/fr-fr/search/"
   },
   {
     text: "UK",
     url: "https://www.dodax.co.uk",
     all: "/en-gb/search/"
   }, 
   {
     text: "ES",
     url: "https://www.dodax.es",
     all: "/es-es/search/"
   }, 
  {
     text: "IT",
     url: "https://www.dodax.it",
     all: "/it-it/search/"
   },
   {
     text: "PL",
     url: "https://www.dodax.pl",
     all: "/pl-pl/search/"
   }, 
   {
     text: "NL",
     url: "https://www.dodax.nl",
     all: "/nl-nl/search/"
   }
  ];
  
//Proxy para evitar el CORS
let proxyurl = window.location.host.includes('netlify') ? "https://dodax-proxy.herokuapp.com/" : "https://cors-anywhere.herokuapp.com/";

//Parser para tratar el html que obtenemos.
let parser = new DOMParser();

//JSON con los tipos de cambio de las monedas.
let rates = null;
