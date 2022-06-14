import { Component, Vue } from "vue-property-decorator";
import store from "../../store";
import { logoutQuery, refreshQuery } from "./query";

@Component({})
export default class App extends Vue {
  public get isAuth() {
    return store.getters.getAuth;
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
    await refreshQuery();
    store.dispatch("setGroupId", localStorage.getItem("groupId") || "");
  }
}
