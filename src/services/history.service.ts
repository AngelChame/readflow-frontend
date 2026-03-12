import {HistorySessionDetail} from "@/types/api/history.types";
import {apiFetch} from "@/services/api.service";

export const getHistorySessionService = async (id: number):Promise<HistorySessionDetail> => {
    return apiFetch(`/study-session/${id}/history`)
}