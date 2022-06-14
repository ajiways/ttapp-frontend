import { $api } from "../../api";
import store from "../../store";
import { GroupSchedule, TWeekListItem } from "./types";

export const groupListQuery = async () => {
  try {
    const res = await $api.get<TWeekListItem[]>("/group/list");

    store.dispatch("setGroupList", res.data);

    return res.data;
  } catch (error) {
    return error as Error;
  }
};

export const getGroupScheduleQuery = async (id: string) => {
  try {
    const res = await $api.get<GroupSchedule>(`/group/schedule/${id}`);

    store.dispatch("setSelectedGroupSchedule", res.data);

    return res.data;
  } catch (error) {
    return error as Error;
  }
};
