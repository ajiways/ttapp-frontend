import { Component, Vue } from "vue-property-decorator";
import {
  getCurrentWeekType,
  loginRegex,
  passwordRegex,
  secondPasswordRegex,
} from "../../common/utils";
import store from "../../store";
import { groupListQuery } from "../schedule/query";
import {
  DaySchedule,
  ELessonType,
  GroupSchedule,
  LessonInterface,
  TWeekListItem,
  WeekSchedule,
} from "../schedule/types";
import {
  getGroupSchedule,
  saveNewGroup,
  updateDayLessons,
  updateSelfPassword,
} from "./query";

let password: string;

@Component({})
export default class SettingsView extends Vue {
  public $refs!: {
    userDataForm: HTMLFormElement;
    userGroupForm: HTMLFormElement;
    headmanGroupSchedule: HTMLFormElement;
    lessonCreateForm: HTMLFormElement;
    createGroupForm: HTMLFormElement;
  };

  public msg = "Настройки";

  public accountCredentialsForm = false;
  public saveUserDataCheckbox = false;
  public oldPassword = "";
  public newPassword = "";

  public passwordKostyl() {
    password = this.oldPassword;
  }

  public passwordRules = [
    (v: string) =>
      (v !== null && v !== undefined && v !== "") ||
      "Поле обязательно для заполнения",
    (v: string) => passwordRegex.test(v) || "Пароль слишком простой",
    (v: string) => secondPasswordRegex.test(v) || "Пароль слишком простой",
  ];

  public resetPasswordRules = [
    ...this.passwordRules,
    (v: string) => v !== password || "Пароли совпадают",
  ];

  public get userRoles(): string[] {
    const roles: { id: string; title: string }[] = store.getters.getUserRoles;
    return roles.map((role) => role.title);
  }

  public async saveUpdatedUserData() {
    if (!this.$refs.userDataForm.validate()) {
      return;
    }

    await updateSelfPassword(this.oldPassword, this.newPassword);
  }

  public resetUserDataForm() {
    this.oldPassword = "";
    this.newPassword = "";
    this.saveUserDataCheckbox = false;
  }

  // USER GROUP ======================================================================

  public saveUpdatedGroupDataCheckbox = false;
  public changeGroupForm = false;
  public newSelectedGroupId = "";
  public get getGroupList(): TWeekListItem[] {
    return store.getters.getGroupList;
  }
  public currentUserGroupId = localStorage.getItem("groupId");

  public get userId() {
    return store.getters.getUserId;
  }

  public get getCurrentUserGroup() {
    if (!this.currentUserGroupId) {
      return "Не выбрана";
    }

    return (
      this.getGroupList.find((group) => group.id === this.currentUserGroupId)
        ?.title || "Не выбрана"
    );
  }
  public saveUserGroupData() {
    if (!this.$refs.userGroupForm.validate()) {
      return;
    }

    console.log("saved group");
  }

  public resetUserGroupData() {
    this.saveUpdatedGroupDataCheckbox = false;
    this.newSelectedGroupId = "";
  }

  private async mounted() {
    if (!this.getGroupList.length) await groupListQuery();
    this.getCurrentWeekType();
    this.selectedDayIdx =
      new Date(Date.now()).getDay() - 1 <= 0
        ? 6
        : new Date(Date.now()).getDay();
    await this.changeWeek();
  }

  // HEADMAN GROUP SETTINGS =================================================

  public get headmanGroup(): string {
    return (
      this.getGroupList.find((group) => group.headmanId === this.userId)
        ?.title || "Загрузка..."
    );
  }

  public evenWeek: WeekSchedule | null = null;
  public oddWeek: WeekSchedule | null = null;
  public selectedWeekType = true;
  public selectedWeek: WeekSchedule | null = null;
  public weekTypes = [
    { title: "Четная", type: true },
    { title: "Не четная", type: false },
  ];
  public dialog = false;
  public dialogDelete = false;
  public headers = [
    { text: "Название пары", align: "start", sortable: false, value: "title" },
    { text: "Время начала", value: "startDate", sortable: false },
    { text: "Время конца", value: "endDate", sortable: false },
    { text: "Тип", value: "type", sortable: false },
    { text: "Кабинет", value: "cabinetNumber", sortable: false },
    { text: "Преподователь", value: "teacher", sortable: false },
    { text: "Действия", value: "actions", sortable: false },
  ];
  public selectedDayLessons: LessonInterface[] = [];
  public selectedDay: DaySchedule | null = null;
  public selectedDayIdx: number | null = null;

  public get formTitle() {
    return this.editedIndex === -1 ? "Создание пары" : "Редактирование пары";
  }

  public weekDaysSelect = [
    { title: "Понедельник", index: 1 },
    { title: "Вторник", index: 2 },
    { title: "Среда", index: 3 },
    { title: "Четверг", index: 4 },
    { title: "Пятница", index: 5 },
    { title: "Суббота", index: 6 },
    { title: "Воскресенье", index: 7 },
  ];
  public lessonTypes = [
    { title: "ЛК", value: ELessonType.LK },
    { title: "ПЗ", value: ELessonType.PZ },
    { title: "ЛБ", value: ELessonType.LB },
  ];

  public get headmanGroupId() {
    return (
      this.getGroupList.find((item) => item.title === this.headmanGroup)?.id ||
      ""
    );
  }

  private errorWeekChangeCounter = 0;

  public async changeWeek() {
    if (!this.headmanGroupId) {
      setTimeout(() => {
        if (this.errorWeekChangeCounter >= 5) return;

        this.changeWeek();

        this.errorWeekChangeCounter++;
      }, 1000);
    }

    const res = await getGroupSchedule(this.headmanGroupId);

    if (res instanceof Error) return;

    this.evenWeek = res.weeks.find((week: WeekSchedule) => week.isEven) || null;
    this.oddWeek = res.weeks.find((week: WeekSchedule) => !week.isEven) || null;
    this.changeWeekType();
  }

  public selectedEditedType: ELessonType | null = null;

  public get selectedDayTitle() {
    return this.selectedDay?.title || "Не выбран";
  }

  public changeDay() {
    this.selectedDay =
      this.selectedWeek?.days.find(
        (day) => day.order === this.selectedDayIdx
      ) || null;
    this.selectedDayLessons = this.selectedDay?.lessons.slice() || [];
    this.deletedLessons = [];

    if (this.selectedDayLessons) {
      this.selectedDayLessons = this.selectedDayLessons.sort((a, b) => {
        return a.order - b.order;
      });
    }
  }

  public changeEditedType() {
    this.editedItem.type = this.selectedEditedType || ELessonType.LK;
  }

  public editItem(item: LessonInterface) {
    this.editedIndex = this.selectedDayLessons.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialog = true;
  }

  public deleteItem(item: LessonInterface) {
    this.editedIndex = this.selectedDayLessons.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialogDelete = true;
  }

  public deleteItemConfirm() {
    const arr = this.selectedDayLessons.splice(this.editedIndex, 1);
    this.deletedLessons.push(arr[0]);
    this.closeDelete();
  }

  public changeWeekType() {
    this.selectedWeek = this.selectedWeekType ? this.evenWeek : this.oddWeek;
    this.changeDay();
  }

  public deletedLessons: LessonInterface[] = [];

  public close() {
    this.dialog = false;
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    });
    this.selectedEditedType = null;
  }

  public closeDelete() {
    this.dialogDelete = false;
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    });
  }

  public save() {
    if (!this.$refs.lessonCreateForm.validate()) {
      return;
    }

    if (this.editedIndex > -1) {
      Object.assign(this.selectedDayLessons[this.editedIndex], {
        ...this.editedItem,
        order: this.dayLessonsOrder,
      });
    } else {
      this.selectedDayLessons.push({
        ...this.editedItem,
        order: this.dayLessonsOrder,
      });
    }
    this.close();
  }

  public editedIndex = -1;

  public get dayLessonsOrder() {
    return this.selectedDayLessons.length + 1;
  }

  public lessonCreateFormValid = false;

  public editedItem: Omit<LessonInterface, "order"> = {
    id: "",
    title: "",
    type: ELessonType.LK,
    teacher: "",
    cabinetNumber: "",
    startDate: "",
    endDate: "",
  };

  public defaultItem: LessonInterface = {
    id: "",
    title: "",
    type: ELessonType.LK,
    teacher: "",
    cabinetNumber: "",
    startDate: "",
    endDate: "",
    order: 1,
  };

  private getCurrentWeekType() {
    const type = getCurrentWeekType();
    type ? (this.selectedWeekType = true) : (this.selectedWeekType = false);
  }

  public headmanGroupSchedule: GroupSchedule | null = null;
  public headmanGroupScheduleForm = false;
  public saveUpdatedSchedule = false;

  public defaultRules = [(v: string) => !!v || "Нужно заполнить"];

  public lessonDateRules = [
    ...this.defaultRules,
    (v: string) =>
      v.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/) ||
      "Должно быть в формате ЧЧ:ММ",
  ];

  public teacherAndTitleRules = [
    ...this.defaultRules,
    (v: string) => v.length >= 5 || "Не менее 5-ти символов",
  ];

  public cabinetRules = [
    ...this.defaultRules,
    (v: string) => v.length >= 2 || "Не менее 2х символов",
  ];

  public async saveUpdatedGroupSchedule() {
    if (!this.$refs.headmanGroupSchedule.validate() || !this.selectedDay) {
      return;
    }

    const res = await updateDayLessons(
      this.selectedDayLessons,
      this.deletedLessons,
      this.selectedDay.id
    );

    if (res instanceof Error) {
      console.log("error");
      return;
    }

    this.selectedDayLessons = res;
  }

  public resetGroupScheduleChanges() {
    this.saveUpdatedSchedule = false;
    this.deletedLessons = [];
    this.selectedDayLessons = this.selectedDay?.lessons.slice() || [];
  }

  //ADMIN SETTINGS ========================================================

  public createGroupFormValid = false;
  public newGroupTitle = "";
  public newHeadmanLogin = "";
  public newHeadmanPassword = "";
  public saveNewGroupCheckbox = false;

  public loginRules = [
    (v: string) =>
      (v !== null && v !== undefined && v !== "") ||
      "Поле обязательно для заполнения",
    (v: string) => loginRegex.test(v) || "Введите корректный логин",
    (v: string) => v.length > 4 || "Мало символов",
    (v: string) => v.length < 16 || "Много символов",
  ];

  public groupTitleRules = [
    (v: string) => v.length >= 2 || "Мало символов",
    (v: string) => v.length <= 5 || "Много символов",
  ];

  public async saveNewGroup() {
    if (!this.$refs.createGroupForm.validate()) {
      this.createGroupFormValid = false;
      return;
    }
    await saveNewGroup(
      this.newGroupTitle,
      this.newHeadmanLogin,
      this.newHeadmanPassword
    );
    console.log("save");
  }

  public resetNewGroup() {
    console.log("reset");
  }
}
