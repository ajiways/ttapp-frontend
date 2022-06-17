import { Component, Vue } from "vue-property-decorator";
import store from "../../store";
import { logoutQuery, refreshQuery } from "./query";

@Component({})
export default class App extends Vue {
  public get isAuth() {
    return store.getters.getAuth;
  }

  public themeType = false;

  public get theme() {
    return this.themeType;
  }

  public changeTheme() {
    const currentTheme = !this.$vuetify.theme.dark;

    localStorage.setItem("theme", currentTheme ? "dark" : "light");

    this.$vuetify.theme.dark = currentTheme;
  }

  public links = [
    {
      name: "Расписание",
      to: "/",
    },
    {
      name: "Регистрация",
      to: "/registration",
    },
    {
      name: "Войти",
      to: "/login",
    },
  ];

  public userLinks = [
    {
      name: "Расписание",
      to: "/",
    },
    {
      name: "Настройки",
      to: "/settings",
    },
  ];

  public async logout() {
    await logoutQuery();
    store.commit("setAuth", false);
    this.$router.push("/login");
  }

  private async mounted() {
    const theme = localStorage.getItem("theme") === "dark" ? true : false;
    this.themeType = theme;

    this.$vuetify.theme.dark = theme;

    await refreshQuery();
    store.dispatch("setGroupId", localStorage.getItem("groupId") || "");
  }
}
