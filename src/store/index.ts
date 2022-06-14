import Vue from "vue";
import Vuex from "vuex";
import { GroupSchedule } from "../views/schedule/types";
import { GroupList } from "./common";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuth: false,
    userRoles: [{ id: "", title: "" }],
    groupList: [] as GroupList[],
    selectedGroupSchedule: {} as GroupSchedule,
    userId: "",
    groupId: "",
  },
  getters: {
    getAuth(state) {
      return state.isAuth;
    },
    getUserRoles(state) {
      return state.userRoles;
    },
    getGroupList(state) {
      return state.groupList;
    },
    getSelectedGroupSchedule(state) {
      return state.selectedGroupSchedule;
    },
    getUserId(state) {
      return state.userId;
    },
    getGroupId(state) {
      return state.groupId;
    },
  },
  mutations: {
    setAuth(state, auth: boolean) {
      state.isAuth = auth;
    },
    setUserRoles(state, roles: { id: string; title: string }[]) {
      state.userRoles = roles;
    },
    setGroupList(state, list: GroupList[]) {
      state.groupList = list;
    },
    setSelectedGroupSchedule(state, schedule: GroupSchedule) {
      state.selectedGroupSchedule = schedule;
    },
    setUserId(state, id: string) {
      state.userId = id;
    },
    setGroupId(state, id: string) {
      state.groupId = id;
    },
  },
  actions: {
    setAuth(ctx, auth) {
      ctx.commit("setAuth", auth);
    },
    setUserRoles(ctx, roles) {
      ctx.commit("setUserRoles", roles);
    },
    setGroupList(ctx, list) {
      ctx.commit("setGroupList", list);
    },
    setSelectedGroupSchedule(ctx, schedule) {
      ctx.commit("setSelectedGroupSchedule", schedule);
    },
    setUserId(ctx, id) {
      ctx.commit("setUserId", id);
    },
    setGroupId(ctx, id) {
      ctx.commit("setGroupId", id);
    },
  },
  modules: {},
});
