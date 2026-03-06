import { apiFetch } from "@/services/api.service";
import type { CatalogsApiResponse, CatalogsData } from "@/types/api/catalogs.types";

export const getCatalogsService = async (): Promise<CatalogsData> => {
    const res = await apiFetch<CatalogsApiResponse>("/catalogs");
    return res.data;
};
