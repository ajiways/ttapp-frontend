import { AxiosError } from "axios";
import { $api } from "../../api";
import { EResponseType } from "../../common/enums";
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

    return {
      type: EResponseType.SUCCESS,
      message: "Расписание успешно обновлено",
      updatedLessons,
    };
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response && e.response.status === 400) {
        return {
          type: EResponseType.ERROR,
          message: "Ошибка при обновлении расписания, попробуйте позже",
        };
      }

      if (e.response && e.response.status === 500) {
        return {
          type: EResponseType.ERROR,
          message: "Произошла непредвиенная ошибка, попробуйте позже",
        };
      }
    }
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

    return {
      type: EResponseType.SUCCESS,
      message: `Группа ${title} успешно добавлена в систему`,
    };
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response && e.response.status === 400) {
        return {
          type: EResponseType.ERROR,
          message: "Ошибка при создании группы, попробуйте позже",
        };
      }

      if (e.response && e.response.status === 500) {
        return {
          type: EResponseType.ERROR,
          message: "Произошла непредвиенная ошибка, попробуйте позже",
        };
      }
    }
  }
};

export const updateSelfPassword = async (
  oldPassword: string,
  newPassword: string
) => {
  try {
    await $api.post<boolean>("/user/self/password", {
      oldPassword,
      newPassword,
    });

    return {
      type: EResponseType.SUCCESS,
      message: `Пароль успешно обновлен`,
    };
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response && e.response.status === 400) {
        return {
          type: EResponseType.ERROR,
          message: "Неправильный пароль",
        };
      }

      if (e.response && e.response.status === 500) {
        return {
          type: EResponseType.ERROR,
          message: "Произошла непредвиенная ошибка, попробуйте позже",
        };
      }
    }
  }
};

export const updateSelfGroup = async (newGroupId: string) => {
  try {
    await $api.post<boolean>("/user/self/group", {
      id: newGroupId,
    });

    return {
      type: EResponseType.SUCCESS,
      message: `Группа успешно изменена`,
    };
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response && e.response.status === 400) {
        return {
          type: EResponseType.ERROR,
          message: "При смене группы произошла ошибка, попробуйте позже",
        };
      }

      if (e.response && e.response.status === 500) {
        return {
          type: EResponseType.ERROR,
          message: "Произошла непредвиенная ошибка, попробуйте позже",
        };
      }
    }
  }
};
