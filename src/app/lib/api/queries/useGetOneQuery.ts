import { useGenericQuery } from "../useGenericQuery";
import { ModuleTypeMap } from "./type";

export const useGetOneQuery = <T extends keyof ModuleTypeMap>(
  module: T,
  id?: number,
  params = {}
) => {
  return useGenericQuery(
    (data) => {
      const { data: dataResponse, ...rest } = data;
      return {
        data: (dataResponse?.data || null) as ModuleTypeMap[T],
        ...rest,
      };
    },

    getLink(module, id),
    `details-of-${module}-${id || "details"}`,
    params
  );
};

const getLink = (module: string, id?: number) => {
  if (id) return `/${module}/${id}`;
  return `/${module}/`;
};
