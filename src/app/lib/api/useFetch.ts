"use client"
import { useRouter } from "next/navigation";
import axiosInstance from "./axiosInstance";
import { URL_CONFIG } from "./configServer";

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

    // Construire l'URL complète si l'endpoint ne commence pas par http
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${URL_CONFIG.uri}${endpoint}`;

    // Si c'est un FormData, on ne touche pas au Content-Type, Axios le gère
    const isFormData = params instanceof FormData;
    const finalHeaders = isFormData ? headers : { "Content-Type": "application/json", ...headers };

    switch (method.toUpperCase()) {
      case "GET":
        response = await axiosInstance.get(fullUrl, { params, headers: finalHeaders });
        break;
      case "POST":
        response = await axiosInstance.post(fullUrl, params, { headers: finalHeaders });
        break;
      case "PUT":
        response = await axiosInstance.put(fullUrl, params, { headers: finalHeaders });
        break;
      case "PATCH":
        response = await axiosInstance.patch(fullUrl, params, { headers: finalHeaders });
        break;
      case "DELETE":
        response = await axiosInstance.delete(fullUrl, { headers: finalHeaders, data: params });
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
