<template>
  <v-container>
    <h1>{{ msg }}</h1>
    <v-form ref="form" v-model="formValid" lazy-validation>
      <v-text-field
        v-model="login"
        :rules="loginRules"
        label="Логин"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="Пароль"
        required
      ></v-text-field>

      <v-btn :disabled="!formValid" color="success" class="mr-4" @click="logIn">
        Войти
      </v-btn>

      <v-btn color="error" class="mr-4" @click="reset"> Сбросить </v-btn>
    </v-form>

    <v-snackbar v-model="snackbar">
      {{ snackbarMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script src="./Login.view.ts" />
