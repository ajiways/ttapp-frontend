import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import LoginView from "../views/login/index.vue";
import RegisterView from "../views/register/index.vue";
import ScheduleView from "../views/schedule/index.vue";
import SettingsView from "../views/settings/index.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    name: "login",
    path: "/login",
    component: LoginView,
  },
  {
    name: "registration",
    path: "/registration",
    component: RegisterView,
  },
  {
    name: "schedule",
    path: "/",
    component: ScheduleView,
  },
  {
    name: "settings",
    path: "/settings",
    component: SettingsView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
