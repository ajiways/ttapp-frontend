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
        @input="passwordKostyl"
        label="Пароль"
        required
      ></v-text-field>

      <v-text-field
        v-model="passwordConfirm"
        label="Повторите пароль"
        :rules="confirmPasswordRules"
        required
      ></v-text-field>

      <v-row
        ><v-col class="d-flex" cols="6" sm="3">
          <v-select
            v-model="selectedGroup"
            :items="groupList"
            label="Выберите группу"
            item-text="title"
            item-value="id"
            :rules="selectRules"
            outlined
          ></v-select> </v-col
      ></v-row>

      <v-btn
        :disabled="!formValid"
        color="success"
        class="mr-4"
        @click="register"
      >
        Зарегистироваться
      </v-btn>

      <v-btn color="error" class="mr-4" @click="reset"> Сбросить </v-btn>
    </v-form>
  </v-container>
</template>

<script src="./Register.view.ts" />
