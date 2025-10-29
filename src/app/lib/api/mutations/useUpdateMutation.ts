import { useGenericMutation } from "../useGenericMutation";
import { ModuleType } from "./type";

export const useUpdateMutation = (
  modules: ModuleType,
  id?: number,
  method = "PUT"
) => {
  return useGenericMutation(getLink(modules, id), method);
}

const getLink = (modules: string, id?: number) =>{
  if(id) return `/${modules}/${id}`
  return `/${modules}/`
}