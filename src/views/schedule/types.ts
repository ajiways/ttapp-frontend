export type TWeekListItem = {
  id: string;
  title: string;
  headmanId: string;
};

export enum ELessonType {
  PZ = "ПЗ",
  LK = "ЛК",
  LB = "ЛБ",
}

export enum EDayNames {
  MONDAY = "Понедельник",
  TEUSDAY = "Вторник",
  WEDNESDAY = "Среда",
  THURSDAY = "Четверг",
  FRIDAY = "Пятница",
  SATURDAY = "Суббота",
  SUNDAY = "Воскресенье",
}

export interface GroupSchedule {
  id: string;
  title: string;
  weeks: WeekSchedule[];
}

export interface WeekSchedule {
  id: string;
  isEven: boolean;
  days: DaySchedule[];
}

export interface DaySchedule {
  id: string;
  title: EDayNames;
  order: number;
  lessons: LessonInterface[];
}

export interface LessonInterface {
  id: string;
  title: string;
  type: ELessonType;
  teacher: string;
  cabinetNumber: string;
  startDate: string;
  endDate: string;
  order: number;
}
