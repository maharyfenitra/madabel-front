import axios from "axios";

export const useFetch = () => {
  const sendRequest = async (
    method: string,
    endpoint: string,
    params: any,
    headers = {}
  ) => {
    let response;

    // Si c'est un FormData, on ne touche pas au Content-Type, Axios le gère
    const isFormData = params instanceof FormData;
    const finalHeaders = isFormData ? headers : { "Content-Type": "application/json", ...headers };

    switch (method.toUpperCase()) {
      case "GET":
        response = await axios.get(endpoint, { params, headers: finalHeaders });
        break;
      case "POST":
        response = await axios.post(endpoint, params, { headers: finalHeaders });
        break;
      case "PUT":
        response = await axios.put(endpoint, params, { headers: finalHeaders });
        break;
      case "PATCH":
        response = await axios.patch(endpoint, params, { headers: finalHeaders });
        break;
      case "DELETE":
        response = await axios.delete(endpoint, { headers: finalHeaders, data: params });
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return response;
  };

  return sendRequest;
};
