"use client"
import axios from "axios";
import { useRouter } from "next/navigation";

export const useFetch = () => {

  const router = useRouter();

  const sendRequest = async (
    method: string,
    endpoint: string,
    params: any,
    headers = {}
  ) => {

    try{
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
    } catch (error: any) {
      if(error?.response?.data?.err?.name=="TokenExpiredError"){
        router.push("/auth/login");
        console.log("Token expired");
        return error?.response
      };
      console.error("❌ Error in useFetch:", error);
      throw error;
    }
  };

  return sendRequest;
};
