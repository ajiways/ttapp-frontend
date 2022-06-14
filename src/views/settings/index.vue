<template>
  <v-container>
    <h1 class="title">{{ msg }}</h1>

    <v-tabs vertical>
      <v-tab v-if="userRoles.includes('student')" class="tab-mt-45">
        <v-icon left> mdi-account </v-icon>
        Аккаунт
      </v-tab>
      <v-tab v-if="userRoles.includes('headman')">
        <v-icon left> mdi-account </v-icon>
        Группа
      </v-tab>
      <v-tab v-if="userRoles.includes('admin')">
        <v-icon left> mdi-account </v-icon>
        Админка
      </v-tab>

      <v-tab-item>
        <v-card flat>
          <v-tabs>
            <v-tab>
              <v-icon left> mdi-account </v-icon>
              Данные
            </v-tab>
            <v-tab>
              <v-icon left> mdi-account </v-icon>
              Группа
            </v-tab>

            <v-tab-item>
              <v-card flat>
                <v-form
                  ref="userDataForm"
                  v-model="accountCredentialsForm"
                  lazy-validation
                >
                  <v-text-field
                    v-model="oldPassword"
                    :rules="passwordRules"
                    label="Старый пароль"
                    @input="passwordKostyl"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="newPassword"
                    :rules="resetPasswordRules"
                    label="Новый пароль"
                    required
                  ></v-text-field>

                  <v-checkbox
                    v-model="saveUserDataCheckbox"
                    :rules="[(v) => !!v || 'Так уверен или нет?']"
                    label="Я точно уверен."
                    required
                  ></v-checkbox>

                  <v-btn
                    :disabled="!accountCredentialsForm"
                    color="success"
                    class="mr-4"
                    @click="saveUpdatedUserData"
                  >
                    Сохранить
                  </v-btn>

                  <v-btn color="error" class="mr-4" @click="resetUserDataForm">
                    Сбросить
                  </v-btn>
                </v-form>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card flat>
                <v-form
                  ref="userGroupForm"
                  v-model="changeGroupForm"
                  lazy-validation
                >
                  <v-card-text>
                    Текущая группа: {{ getCurrentUserGroup }}
                  </v-card-text>

                  <v-select
                    v-model="newSelectedGroupId"
                    :items="getGroupList"
                    :rules="[(v) => !!v || 'Группу нужно выбрать']"
                    label="Новая группа"
                    item-text="title"
                    item-value="id"
                    required
                  ></v-select>

                  <v-checkbox
                    v-model="saveUpdatedGroupDataCheckbox"
                    :rules="[(v) => !!v || 'Так уверен или нет?']"
                    label="Я точно уверен."
                    required
                  ></v-checkbox>

                  <v-btn
                    :disabled="!changeGroupForm"
                    color="success"
                    class="mr-4"
                    @click="saveUserGroupData"
                  >
                    Сохранить
                  </v-btn>

                  <v-btn color="error" class="mr-4" @click="resetUserGroupData">
                    Сбросить
                  </v-btn>
                </v-form>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-tab-item>

      <v-tab-item>
        <v-card flat>
          <v-tabs>
            <v-tab>
              <v-icon left> mdi-account </v-icon>
              Расписание
            </v-tab>

            <v-tab-item>
              <v-card-text>
                Вы староста группы: {{ headmanGroup }}
              </v-card-text>
              <v-card flat>
                <v-form
                  ref="headmanGroupSchedule"
                  v-model="headmanGroupScheduleForm"
                  lazy-validation
                >
                  <template v-slot:prev="{ on, attrs }">
                    <v-btn color="success" v-bind="attrs" v-on="on"
                      ><v-icon>mdi-arrow-left</v-icon></v-btn
                    >
                  </template>
                  <template v-slot:next="{ on, attrs }">
                    <v-btn color="info" v-bind="attrs" v-on="on"
                      ><v-icon>mdi-arrow-right</v-icon></v-btn
                    >
                  </template>

                  <template>
                    <v-data-table
                      :headers="headers"
                      :items="selectedDayLessons"
                      sort-by="calories"
                      class="elevation-1"
                      no-data-text="Нет пар"
                      hide-default-footer
                    >
                      <template v-slot:top>
                        <v-toolbar flat>
                          <v-toolbar-title>
                            {{ selectedDayTitle }}</v-toolbar-title
                          >
                          <v-divider class="mx-4" inset vertical></v-divider>
                          <v-spacer></v-spacer>
                          <v-dialog
                            v-if="selectedDayIdx"
                            v-model="dialog"
                            max-width="500px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn dark class="mb-2" v-bind="attrs" v-on="on">
                                Добавить пару
                              </v-btn>
                            </template>
                            <v-card>
                              <v-card-title>
                                <span class="text-h5"> {{ formTitle }} </span>
                              </v-card-title>

                              <v-card-text>
                                <v-container>
                                  <v-form
                                    v-model="lessonCreateFormValid"
                                    ref="lessonCreateForm"
                                  >
                                    <v-row>
                                      <v-col cols="12" sm="6" md="4">
                                        <v-text-field
                                          :rules="teacherAndTitleRules"
                                          v-model="editedItem.title"
                                          label="Название пары"
                                        ></v-text-field>
                                      </v-col>
                                      <v-col cols="12" sm="6" md="4">
                                        <v-text-field
                                          :rules="lessonDateRules"
                                          v-model="editedItem.startDate"
                                          label="Время начала"
                                        ></v-text-field>
                                      </v-col>
                                      <v-col cols="12" sm="6" md="4">
                                        <v-text-field
                                          :rules="lessonDateRules"
                                          v-model="editedItem.endDate"
                                          label="Время конца"
                                        ></v-text-field>
                                      </v-col>
                                    </v-row>
                                    <v-row>
                                      <v-col cols="12" sm="6" md="4">
                                        <v-text-field
                                          :rules="cabinetRules"
                                          v-model="editedItem.cabinetNumber"
                                          label="Номер кабинета"
                                        ></v-text-field>
                                      </v-col>
                                      <v-col cols="12" sm="6" md="4">
                                        <v-text-field
                                          :rules="teacherAndTitleRules"
                                          v-model="editedItem.teacher"
                                          label="Преподаватель"
                                        ></v-text-field>
                                      </v-col>
                                      <v-col cols="12" sm="6" md="4">
                                        <v-select
                                          :rules="defaultRules"
                                          v-model="selectedEditedType"
                                          :items="lessonTypes"
                                          item-text="title"
                                          item-value="type"
                                          label="Тип"
                                          solo
                                          @change="changeEditedType"
                                        ></v-select>
                                      </v-col>
                                    </v-row>
                                  </v-form>
                                </v-container>
                              </v-card-text>

                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color="blue darken-1"
                                  text
                                  @click="close"
                                >
                                  Отмена
                                </v-btn>
                                <v-btn
                                  :disabled="!lessonCreateFormValid"
                                  color="blue darken-1"
                                  text
                                  @click="save"
                                >
                                  Сохнарить
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                          <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card>
                              <v-card-title class="text-h5"
                                >Ты точно хочешь удалить эту пару?</v-card-title
                              >
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color="blue darken-1"
                                  text
                                  @click="closeDelete"
                                  >Отмена</v-btn
                                >
                                <v-btn
                                  color="blue darken-1"
                                  text
                                  @click="deleteItemConfirm"
                                  >Да!</v-btn
                                >
                                <v-spacer></v-spacer>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </v-toolbar>
                      </template>
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-icon small class="mr-2" @click="editItem(item)">
                          mdi-pencil
                        </v-icon>
                        <v-icon small @click="deleteItem(item)">
                          mdi-delete
                        </v-icon>
                      </template>
                    </v-data-table></template
                  >

                  <v-select
                    v-model="selectedWeekType"
                    :items="weekTypes"
                    item-text="title"
                    item-value="type"
                    label="Четность недели"
                    solo
                    @change="changeWeekType"
                  ></v-select>

                  <v-select
                    v-model="selectedDayIdx"
                    :items="weekDaysSelect"
                    item-text="title"
                    item-value="index"
                    label="День недели"
                    solo
                    @change="changeDay"
                  ></v-select>

                  <v-checkbox
                    v-model="saveUpdatedSchedule"
                    :rules="[(v) => !!v || 'Так уверен или нет?']"
                    label="Я точно уверен."
                    required
                  ></v-checkbox>

                  <v-btn
                    :disabled="!headmanGroupScheduleForm"
                    color="success"
                    class="mr-4"
                    @click="saveUpdatedGroupSchedule"
                  >
                    Сохранить
                  </v-btn>

                  <v-btn
                    color="error"
                    class="mr-4"
                    @click="resetGroupScheduleChanges"
                  >
                    Сбросить
                  </v-btn>
                </v-form>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-tab-item>

      <v-tab-item>
        <v-card flat>
          <v-tabs>
            <v-tab>
              <v-icon left> mdi-account </v-icon>
              Группы
            </v-tab>

            <v-tab-item>
              <v-card flat>
                <v-form
                  ref="createGroupForm"
                  v-model="createGroupFormValid"
                  lazy-validation
                >
                  <v-text-field
                    v-model="newGroupTitle"
                    :rules="groupTitleRules"
                    label="Название группы"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="newHeadmanLogin"
                    :rules="loginRules"
                    label="Логин старосты"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="newHeadmanPassword"
                    :rules="resetPasswordRules"
                    label="Пароль старосты"
                    required
                  ></v-text-field>

                  <v-checkbox
                    v-model="saveNewGroupCheckbox"
                    :rules="[(v) => !!v || 'Так уверен или нет?']"
                    label="Я точно уверен."
                    required
                  ></v-checkbox>

                  <v-btn
                    :disabled="!createGroupFormValid"
                    color="success"
                    class="mr-4"
                    @click="saveNewGroup"
                  >
                    Создать
                  </v-btn>

                  <v-btn color="error" class="mr-4" @click="resetNewGroup">
                    Сбросить
                  </v-btn>
                </v-form>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<style src="./style.css" />
<script src="./Settings.view.ts" />
