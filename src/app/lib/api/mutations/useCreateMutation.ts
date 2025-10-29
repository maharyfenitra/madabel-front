import { useGenericMutation } from "../useGenericMutation";
import { ModuleType } from "./type";

export const useCreateMutation = (modules: ModuleType) => {
  return useGenericMutation(`/${modules}/`, "POST");
};