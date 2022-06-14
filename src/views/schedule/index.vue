<template>
  <v-container>
    <h1 class="title">{{ msg }}</h1>
    <v-col d-flex>
      <v-carousel
        v-model="currentDayIndex"
        hide-delimiters
        show-arrows-on-hover
        height="500"
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
        <template v-if="selectedWeek"
          ><v-carousel-item v-for="day in selectedWeek.days" :key="day.id">
            <v-card max-width="400" class="mx-auto">
              <v-container class="myContainer">
                <v-row class="day-title">{{ day.title }}</v-row>
                <v-row dense class="day-lessons">
                  <v-row v-if="day.lessons.length">
                    <v-col
                      cols="12"
                      v-for="lesson in day.lessons"
                      :key="lesson.id"
                    >
                      <v-card color="#385F73" outlined dark class="lesson-item">
                        <v-card-title class="text-h5">
                          <div class="card-content">
                            <div class="card-title">
                              <div>{{ lesson.title }}</div>
                              <div>{{ lesson.type }}</div>
                            </div>
                            <div>{{ lesson.teacher }}</div>
                            <div class="card-additional">
                              <div>
                                {{ lesson.startDate }} - {{ lesson.endDate }}
                              </div>
                              <div>{{ lesson.cabinetNumber }}</div>
                            </div>
                          </div>
                        </v-card-title>
                      </v-card>
                    </v-col></v-row
                  >
                  <v-row v-else>
                    <v-col>
                      <v-card color="#385F73" dark>
                        <v-card-title class="text-h6"> Выходной </v-card-title>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-row>
              </v-container>
            </v-card>
          </v-carousel-item>
        </template>
        <template v-else>
          <v-row
            ><v-col class="no-schedule"><h1>Нет расписания</h1></v-col></v-row
          >
        </template>
      </v-carousel>
      <hr class="space" />
      <v-col>
        <v-select
          v-model="selectedWeekType"
          :items="weekTypes"
          item-text="title"
          item-value="type"
          label="Четность недели"
          solo
          @change="changeWeekType"
        ></v-select
        ><v-select
          v-model="selectedGroup"
          :items="getGroupList"
          item-text="title"
          item-value="id"
          label="Группа"
          solo
          @change="changeGroup"
        ></v-select>
      </v-col>
    </v-col>
  </v-container>
</template>

<style src="./style.css" />
<script src="./Schedule.view.ts" />
