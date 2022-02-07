//Tipos de búsqueda
const tiposBusqueda = [
  {"name":"vinilo", "filter":"art.articleTypeId-vinyl--18-art.articleTypeId-vinyl--boxset--2855-art.articleTypeId-vinyl--single--493"},
  {"name":"cd", "filter": "art.articleTypeId-cd--20-art.articleTypeId-cd--box--set--23-art.articleTypeId-cd--plus--dvd--22-art.articleTypeId-cd--plus--book--21-art.articleTypeId-cd--plus--dvd--boxset--2854-art.articleTypeId-blu----ray--plus--cd--31-art.articleTypeId-cd--mini----album--25-art.articleTypeId-cdplusdvdplusbook--3520"},
  {"name":"dvd", "filter": "art.articleTypeId-dvd--33-art.articleTypeId-cd--plus--dvd--22-art.articleTypeId-dvd--boxset--2884-art.articleTypeId-cd--plus--dvd--boxset--2854-art.articleTypeId-dvd--plus--book--35"},
  {"name" : "bluray", "filter": "art.articleTypeId-blu----ray--disc--30-art.articleTypeId-blu----ray--plus--cd--31-art.articleTypeId-blu----ray--boxset--2883-art.articleTypeId-blu----ray--plus--book--32"}
];


//Listado de servidores a los que consultaremos.
const urlsDodax = [
     {
    text: "AT",
    url: "https://www.dodax.at",
    proxy: "https://dodaxat.wideiscastilla.workers.dev",
    all: "/de-at/search/",
    useProxy: true
  },
  {
    text: "DE",
    url: "https://www.dodax.de",
    proxy: "https://dodaxde.wideiscastilla.workers.dev",
    all: "/de-de/search/",
    useProxy: true
    },
   {
     text: "FR",
     url: "https://www.dodax.fr",
     proxy: "https://dodaxfr.wideiscastilla.workers.dev",
     all: "/fr-fr/search/",
     useProxy: true
   },
   {
     text: "UK",
     url: "https://www.dodax.co.uk",
     proxy: "https://dodaxuk.wideiscastilla.workers.dev",
     all: "/en-gb/search/",
     useProxy: true
   }, 
   {
     text: "ES",
     url: "https://www.dodax.es",
     proxy: "https://dodaxes.wideiscastilla.workers.dev",
     all: "/es-es/search/",
     useProxy: true
   }, 
  {
     text: "IT",
     url: "https://www.dodax.it",
     proxy: "https://dodaxit.wideiscastilla.workers.dev",
     all: "/it-it/search/",
     useProxy: true
   },
   {
     text: "PL",
     url: "https://www.dodax.pl",
     proxy: "https://dodaxpl.wideiscastilla.workers.dev",
     all: "/pl-pl/search/",
     useProxy: true
   }, 
   {
     text: "NL",
     url: "https://www.dodax.nl",
     proxy: "https://dodaxnl.wideiscastilla.workers.dev",
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
