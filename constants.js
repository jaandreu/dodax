//Tipos de búsqueda
const tiposBusqueda = [
  {"name":"lp-vinyl", "filter": "lpvinyl-K6IQQ1BLV9"},
  {"name":"single-vinyl", "filter":"singlevinyl-TVBN098J7D"},
  {"name":"cd", "filter":"cd-QQQ6F29MQA"},
  {"name":"dvd", "filter":"dvd-DBRGQD0GK"},
  {"name" :"sacd", "filter":"sacd-TKLFV1USKM"}
];

//Listado de servidores a los que consultaremos.
const urlsDodax = [
  {
    text: "DE",
    url: "https://www.dodax.de",
    musica: "/de-de/musik-cds-dvds-vinyl-cLOFV6FFU7H",
    electronica: "/de-de/elektronik-cPPEA17VBM7",
    all: "/de-de/search/"
    },
  {
    text: "FR",
    url: "https://www.dodax.fr",
    musica: "/fr-fr/musique-cd-dvd-vinyles-cLOFV6FFU7H",
    electronica: "/fr-fr/elektronik-cPPEA17VBM7",
    all: "/fr-fr/search/"
  },
  {
    text: "PL",
    url: "https://www.dodax.pl",
    musica: "/pl-pl/muzyka-cd-dvd-winyle-cLOFV6FFU7H",
    electronica: "/pl-pl/elektronik-cPPEA17VBM7",
    all: "/pl-pl/search/"
  } 
  ];
  
//Proxy para evitar el CORS
let proxyurl = window.location.host.includes('netlify') ? "https://dodax-proxy.herokuapp.com/" : "https://cors-anywhere.herokuapp.com/";

//Parser para tratar el html que obtenemos.
let parser = new DOMParser();

//JSON con los tipos de cambio de las monedas.
let rates = null;
