import { Component, Vue } from "vue-property-decorator";
import {
  loginRegex,
  passwordRegex,
  secondPasswordRegex,
} from "../../common/utils";
import store from "../../store";
import { groupListQuery } from "../schedule/query";
import { TWeekListItem } from "../schedule/types";
import { registrationQuery } from "./query";

let password: string;

@Component({})
export default class RegisterView extends Vue {
  public $refs!: {
    form: HTMLFormElement;
  };

  protected msg = "Регистрация";

  public selectedGroup: string | null = null;

  public get groupList(): TWeekListItem[] {
    return store.getters.getGroupList;
  }

  public formValid = false;
  public login = "";
  public password = "";
  public passwordConfirm = "";

  public passwordKostyl() {
    password = this.password;
  }

  public selectRules = [(v: string) => !!v || "Вы должны выбрать группу"];

  public loginRules = [
    (v: string) =>
      (v !== null && v !== undefined && v !== "") ||
      "Поле обязательно для заполнения",
    (v: string) => loginRegex.test(v) || "Введите корректный логин",
    (v: string) => v.length > 4 || "Мало символов",
    (v: string) => v.length < 16 || "Много символов",
  ];
  public passwordRules = [
    (v: string) =>
      (v !== null && v !== undefined && v !== "") ||
      "Поле обязательно для заполнения",
    (v: string) => passwordRegex.test(v) || "Пароль слишком простой",
    (v: string) => secondPasswordRegex.test(v) || "Пароль слишком простой",
  ];
  public confirmPasswordRules = [
    (v: string) =>
      (v !== null && v !== undefined && v !== "") ||
      "Поле обязательно для заполнения",
    (v: string) => v === password || "Пароли не совпадают",
  ];

  public async register() {
    if (!this.$refs.form.validate() || !this.selectedGroup) {
      return;
    }

    const res = await registrationQuery(
      this.login,
      this.password,
      this.passwordConfirm,
      this.selectedGroup
    );
    if (res instanceof Error) return;

    this.$router.push("/");
  }

  public reset() {
    this.login = "";
    this.password = "";
    this.passwordConfirm = "";
  }

  private async mounted() {
    if (!this.groupList.length) await groupListQuery();
  }
}
