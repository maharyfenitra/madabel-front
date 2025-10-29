import { ModuleTypeMap } from "./type";
import { useGenericQuery } from "../useGenericQuery";

export const useGetAllQuery = <T extends keyof ModuleTypeMap>(module: T, params ={}) => {
  return useGenericQuery(
    (data) => {
      const { data: dataResponse, ...rest } = data;
      return {
        data: (dataResponse?.data || null) as ModuleTypeMap[T][],
        ...rest,
      };
    },

    `/${module}/`,
    `list-of-${module}`,
     params
  );
};