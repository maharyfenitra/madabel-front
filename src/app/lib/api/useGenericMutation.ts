import { useFetch } from "./useFetch";
import { useMutation } from "@tanstack/react-query";
import { useAccessToken } from "./useAccessToken";
import { URL_CONFIG } from "./configServer";

export const useGenericMutation = <TVariables>(
  endpoint: string,
  method = "POST"
) => {
 
  const sendRequest = useFetch();
  const { getAccessToken } = useAccessToken()
  const accessToken = getAccessToken()
  
  const mutation = useMutation({
    mutationFn: (variables: TVariables) => {
      
      return sendRequest(
        method,
        `${URL_CONFIG.uri}${endpoint}`,
        variables,
        {
          ...(accessToken ? { Authorization: `Token ${accessToken}` } : {}),
        }
      )
        .then((data) => data?.data)
        .catch((error) => {
          throw error;
        });
    },
  });

  return mutation;
};