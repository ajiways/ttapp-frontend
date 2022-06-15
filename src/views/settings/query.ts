import { $api } from "../../api";
import { groupListQuery } from "../schedule/query";
import { GroupSchedule, LessonInterface } from "../schedule/types";

export const getGroupSchedule = async (id: string) => {
  try {
    const res = await $api.get<GroupSchedule>(`/group/schedule/${id}`);

    return res.data;
  } catch (error) {
    return error as Error;
  }
};

export const updateDayLessons = async (
  lessons: LessonInterface[],
  lessonsToDelete: LessonInterface[],
  dayId: string
) => {
  try {
    const existingLessons = lessons
      .filter((lesson) => lesson.id)
      .map((lesson) => {
        return {
          ...lesson,
          dayId,
          cabinetNumber: lesson.cabinetNumber.toString(),
        };
      });
    const newLessons = lessons
      .filter((lesson) => !lesson.id)
      .map((lesson): Omit<LessonInterface, "id"> & { dayId: string } => {
        return {
          title: lesson.title,
          type: lesson.type,
          teacher: lesson.teacher,
          startDate: lesson.startDate,
          endDate: lesson.endDate,
          order: lesson.order,
          dayId,
          cabinetNumber: lesson.cabinetNumber.toString(),
        };
      });
    const lessonToDeleteIds = lessonsToDelete.map((i) => i.id);

    const updatedLessons: LessonInterface[] = [];

    for (const existingLesson of existingLessons) {
      const res = await $api.patch<LessonInterface>("/lesson", {
        ...existingLesson,
      });

      updatedLessons.push(res.data);
    }

    for (const newLesson of newLessons) {
      const res = await $api.post<LessonInterface>("/lesson", { ...newLesson });

      updatedLessons.push(res.data);
    }

    for (const id of lessonToDeleteIds) {
      await $api.delete("/lesson", { data: { id } });
    }

    return updatedLessons;
  } catch (error) {
    return error as Error;
  }
};

export const saveNewGroup = async (
  title: string,
  login: string,
  password: string
) => {
  try {
    const user = await $api.post<{ id: string }>("/user/headman", {
      login,
      password,
    });

    const group = await $api.post<{ id: string }>("/group", {
      title,
      headmanId: user.data.id,
    });

    await $api.post("/student-group", {
      studentId: user.data.id,
      groupId: group.data.id,
    });

    await groupListQuery();

    return true;
  } catch (error) {
    return error as Error;
  }
};

export const updateSelfPassword = async (
  oldPassword: string,
  newPassword: string
) => {
  try {
    const res = await $api.post<boolean>("/user/self/password", {
      oldPassword,
      newPassword,
    });

    return res.data;
  } catch (e) {
    return e as Error;
  }
};

export const updateSelfGroup = async (newGroupId: string) => {
  try {
    const res = await $api.post<boolean>("/user/self/group", {
      id: newGroupId,
    });

    return res.data;
  } catch (error) {
    return error as Error;
  }
};
