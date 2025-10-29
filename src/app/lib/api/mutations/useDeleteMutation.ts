import { useGenericMutation } from "../useGenericMutation";
import { ModuleType } from "./type";

export const useDeleteMutation = (modules: ModuleType, id: number) => {
  return useGenericMutation(`/${modules}/${id}`, "DELETE");
};