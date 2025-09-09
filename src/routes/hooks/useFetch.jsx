
import { useState, useEffect } from "react";

export const useFetch = (url) => {
    const [data, setData] = useState(null)

    //Methodo POST
    const [config, setConfig] = useState(null);
    const [method, setMethod] = useState(null);
    const [callFetch, setCallFetch] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const [fetchUrl, setFetchUrl] = useState(url); // usado para GET dinâmico


  const updateData = async (data, method, id) => {
  let urlToUpdate = url;
  if (method === "PUT" && id) {
    urlToUpdate = `${url}/${id}`;
  }

  const res = await fetch(urlToUpdate, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  const json = await res.json();

  // Atualiza a lista local
  setData(prevData =>
    Array.isArray(prevData)
      ? prevData.map(item => (item.id === json.id ? json : item))
      : json
  );

  setCallFetch(prev => !prev); // força reexecução
  return json;
};


    const httpConfig = async (data, method) => {
  if (method === "POST") {
    // Remove o id se vier do formulário
    if (data.id) {
      delete data.id;
    }

    const config = {
      method,
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const res = await fetch(url, config);
      const json = await res.json();

      setCallFetch(json); // força reexecução do useEffect principal
      return json;
    } catch (error) {
      console.error("Erro ao fazer POST:", error);
      throw error;
    }
  }

  if (method === "GET") {
    const queryParams = new URLSearchParams(data).toString();
    setFetchUrl(`${url}?${queryParams}`);
    setMethod(method);
    setCallFetch(prev => !prev);
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
  
          if (method === "POST" && config) {
        const res = await fetch(url, config);
        const json = await res.json();
        setCallFetch(prev => !prev);
      }

          /* backup 
         if (method === "POST") {
          const res = await fetch(url, config);
          json = await res.json();
          setCallFetch(json); // força novo fetch
        }

        */
      };
 

    if (config && method) httpRequest();
  }, [config, method, url]);

  // ✅ Retorna função refetch
  const refetch = () => setCallFetch(prev => !prev);

  return { data, httpConfig, updateData, refetch   };

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