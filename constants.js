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
          params: "/de-de/musik-cds-dvds-vinyl-cLOFV6FFU7H"
         },
         {
          text: "AT",
          url: "https://www.dodax.at",
          params: "/de-at/musik-cds-dvds-vinyl-cLOFV6FFU7H"
        },
        {
          text: "FR",
          url: "https://www.dodax.fr",
          params: "/fr-fr/musique-cd-dvd-vinyles-cLOFV6FFU7H"
        },
        {
          text: "UK",
          url: "https://www.dodax.co.uk",
          params: "/en-gb/music-cds-dvds-vinyl-cLOFV6FFU7H"
        }, 
        {
          text: "ES",
          url: "https://www.dodax.es",
          params: "/es-es/musica-cds-dvds-vinilos-cLOFV6FFU7H"
        }, 
        {
          text: "IT",
          url: "https://www.dodax.it",
          params: "/it-it/musica-cd-dvd-vinili-cLOFV6FFU7H"
        },
        {
          text: "PL",
          url: "https://www.dodax.pl",
          params: "/pl-pl/muzyka-cd-dvd-winyle-cLOFV6FFU7H"
        }, 
        {
          text: "NL",
          url: "https://www.dodax.nl",
          params: "/nl-nl/muziek-cds-dvds-vinylplaten-cLOFV6FFU7H"
        }
        ];
        
     //Proxy para evitar el CORS
     const proxyurl = window.location.host.includes('netlify') ? "https://dodax-proxy.herokuapp.com/" : "https://cors-anywhere.herokuapp.com/";

