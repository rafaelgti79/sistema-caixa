import { use } from "react";
import { useState, useEffect } from "react";

export const useFetch = (url) => {
    const [data, setData] = useState(null)

    //Methodo POST
    const [config, setConfig] = useState(null);
    const [method, setMethod] = useState(null);
    const [callFetch, setCallFetch] = useState(null);
    const [responseData, setResponseData] = useState(null);
    const [fetchUrl, setFetchUrl] = useState(url); // usado para GET dinâmico



    const httpConfig = (data, method) => {
        if (method === "POST"){
            // Remover o id se vier do formulário
      if (data.id) {
        delete data.id;
      }

        setConfig({
            method,
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        });

        setMethod(method);
    }

     if (method === "GET") {
      const queryParams = new URLSearchParams(data).toString();
      setFetchUrl(`${url}?${queryParams}`);
      setMethod(method);
      setCallFetch(prev => !prev); // força reexecução do fetch
    }
};



    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(url);
            const json = await res.json();

            setData(json);
        };

        fetchData();

    }, [url, callFetch]);

    //Methodo POST
    useEffect(()=> {
 
    const httpRequest = async() => {
        let json

       if (method === "POST") {
        const res = await fetch(url, config);
        json = await res.json();
        setCallFetch(json); // força novo fetch
      }
    };

    if (config && method) httpRequest();
  }, [config, method, url]);

  return { data, httpConfig };

};


/*
 const httpRequest = async() => {
        let json

        if(method === "POST"){
            let fetchOption = [url, config];

            const res = await fetch(...fetchOption);

            json = await res.json();
        }
        setCallFetch(json);
    };

    httpRequest();
}, [config, method, url]); 
*/