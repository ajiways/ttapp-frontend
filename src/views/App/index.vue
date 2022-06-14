<template>
  <v-app id="app">
    <v-app-bar app color="white" flat>
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
    </v-app-bar>

    <v-main class="grey lighten-3">
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
    <v-footer class="white pd-0">
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} — <strong>TimeTable</strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script src="./App.view.ts" />
