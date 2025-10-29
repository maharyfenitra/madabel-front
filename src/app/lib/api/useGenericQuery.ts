import { useFetch } from "./useFetch";
import { useQuery } from "@tanstack/react-query";
import { UseQueryResult } from "@tanstack/react-query";
import { useAccessToken } from "./useAccessToken";
import { URL_CONFIG } from "./configServer";

export const useGenericQuery = <TData>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callBack: (data: UseQueryResult<any, Error>) => TData,
  endpoint: string,
  cacheKey: string,
  params = {},
  //refetchInterval = 5000
) => {
  const { getAccessToken } = useAccessToken()
 
  const sendRequest = useFetch();
 
  const query = useQuery({
    enabled: true,
    queryKey: [cacheKey],
    //refetchInterval,
    queryFn: async () => {
      return await sendRequest(
        "GET",
        `${URL_CONFIG.uri}${endpoint}`,
        params,
        {
          Authorization: `Token ${getAccessToken()}`
        }
      );
    },
  });

  return callBack(query);
};