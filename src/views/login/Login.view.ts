import { Component, Vue } from "vue-property-decorator";
import { EResponseType } from "../../common/enums";
import {
  loginRegex,
  passwordRegex,
  secondPasswordRegex,
  useSnackbar,
} from "../../common/utils";
import router from "../../router";
import { loginQuery } from "./query";

@Component({})
export default class LoginView extends Vue {
  public $refs!: {
    form: HTMLFormElement;
  };

  public msg = "Логин";
  public formValid = false;
  public login = "";
  public password = "";

  public snackbarType: EResponseType | null = null;
  public snackbarMessage: string | null = null;
  public snackbar = false;

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

  public async logIn() {
    if (!this.$refs.form.validate()) {
      return;
    }

    const res = await loginQuery(this.login, this.password);

    const [type, message, show] = useSnackbar(res);

    this.snackbarType = type;
    this.snackbarMessage = message;
    this.snackbar = show;

    if (type === EResponseType.SUCCESS) {
      router.push("/");
    }
  }

  public reset() {
    this.login = "";
    this.password = "";

    this.snackbarType = EResponseType.SUCCESS;
    this.snackbarMessage = "Успешно сброшено";
    this.snackbar = true;
  }
}
