<template>
  <v-app id="app" dark>
    <v-app-bar app flat>
      <v-tabs v-if="!isAuth" centered class="ml-n9" color="grey darken-1">
        <v-tab v-for="link in links" :key="link.name" :to="link.to">
          {{ link.name }}
        </v-tab>
      </v-tabs>
      <v-tabs v-else centered class="ml-n9" color="grey darken-1">
        <v-tab v-for="link in userLinks" :key="link.name" :to="link.to">
          {{ link.name }}
        </v-tab>
        <v-tab @click="logout"> Выйти </v-tab>
      </v-tabs>
      <v-switch
        hide-details
        color="white"
        v-model="theme"
        @change="changeTheme"
      >
      </v-switch>
      <v-icon large color="darken-2"> mdi-theme-light-dark </v-icon>
    </v-app-bar>

    <v-main class="lighten-3">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="12">
            <v-sheet min-height="84vh" rounded="lg">
              <router-view></router-view>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer class="pd-0">
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} — <strong>TimeTable</strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script src="./App.view.ts" />
<style src="./style.css" />
