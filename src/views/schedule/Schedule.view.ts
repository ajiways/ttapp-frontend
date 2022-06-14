import { Component, Vue } from "vue-property-decorator";
import { getCurrentWeekType } from "../../common/utils";
import store from "../../store";
import { getGroupScheduleQuery, groupListQuery } from "./query";
import { GroupSchedule, TWeekListItem, WeekSchedule } from "./types";

@Component({})
export default class ScheduleView extends Vue {
  public msg = "Расписание";

  public model = 0;

  public currentDayIndex =
    new Date(Date.now()).getDay() - 1 <= 0
      ? 6
      : new Date(Date.now()).getDay() - 1;

  public selectedGroup: string | null = null;
  public evenWeek: WeekSchedule | null = null;
  public oddWeek: WeekSchedule | null = null;
  public selectedWeekType = true;
  public selectedWeek: WeekSchedule | null = null;

  public weekTypes = [
    { title: "Четная", type: true },
    { title: "Не четная", type: false },
  ];

  public get getGroupList(): TWeekListItem[] {
    return store.getters.getGroupList;
  }

  public get userId(): string {
    return store.getters.getUserId;
  }

  public get userGroupId(): string {
    return store.getters.getGroupId;
  }

  public get getSelectedGroupSchedule(): GroupSchedule {
    return store.getters.getSelectedGroupSchedule;
  }

  public async changeGroup() {
    if (!this.selectedGroup) {
      return;
    }

    if (this.getSelectedGroupSchedule.id !== this.selectedGroup) {
      await getGroupScheduleQuery(this.selectedGroup);
    }

    this.evenWeek =
      this.getSelectedGroupSchedule.weeks.find(
        (week: WeekSchedule) => week.isEven
      ) || null;
    this.oddWeek =
      this.getSelectedGroupSchedule.weeks.find(
        (week: WeekSchedule) => !week.isEven
      ) || null;

    this.changeWeekType();
  }

  public changeWeekType() {
    this.selectedWeek = this.selectedWeekType ? this.evenWeek : this.oddWeek;

    if (this.selectedWeek) {
      this.selectedWeek.days.forEach((day) => {
        day.lessons = day.lessons.sort((lessonA, lessonB) => {
          return lessonA.order - lessonB.order;
        });
      });
    }
  }

  private async mounted() {
    if (!this.getGroupList.length) {
      await groupListQuery();

      this.selectedGroup =
        localStorage.getItem("groupId") || this.getGroupList[0].id;

      await this.changeGroup();

      this.getCurrentWeekType();
      this.changeWeekType();
    } else {
      this.selectedGroup =
        localStorage.getItem("groupId") || this.getGroupList[0].id;

      await this.changeGroup();

      this.getCurrentWeekType();
      this.changeWeekType();
    }
  }

  private getCurrentWeekType() {
    const type = getCurrentWeekType();
    type ? (this.selectedWeekType = true) : (this.selectedWeekType = false);
  }
}
