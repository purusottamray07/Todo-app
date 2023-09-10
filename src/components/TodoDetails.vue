<script setup>
import moment from "moment";
import { useDisplay } from "vuetify";

const props = defineProps({
  todo: Object,
});

const emit = defineEmits(["updateTodo"]);
const { mobile } = useDisplay();

const updateTodo = (type, id) => {
  emit("updateTodo", type, id);
};

const isOverdue = (due) => {
  const isPastDueDate = moment().diff(due);

  if (isPastDueDate > 0) {
    return true;
  } else {
    return false;
  }
};
</script>

<template>
  <div
    class="todo-item flex align-center justify-between p-2.5 rounded-lg"
    :class="{ overdue: isOverdue(todo.due) }"
  >
    <div class="left-section flex align-center">
      <div class="select-item mr-2.5" v-if="!mobile">
        <v-checkbox density="compact" v-model="todo.checked"></v-checkbox>
      </div>
      <div class="details">
        <div class="todo-name">{{ todo.name }}</div>
        <div class="todo-due">{{ todo.due }}</div>
      </div>
    </div>
    <div class="right-section">
      <div class="todo-actions" v-if="todo.checked && !mobile">
        <v-btn class="action-btn" @click="updateTodo('Update', todo.id)">
          Update
        </v-btn>
        <v-btn class="action-btn" @click="updateTodo('duplicate', todo.id)">
          Duplicate
        </v-btn>
        <v-btn class="action-btn" @click="updateTodo('done', todo.id)" v-if="todo.status !== 'Completed'">
          Done
        </v-btn>
        <v-btn class="action-btn" @click="updateTodo('delete', todo.id)">
          Delete
        </v-btn>
      </div>
    </div>

    <div class="select-item" v-if="mobile">
      <!-- <v-btn icon="mdi-plus"> -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-dots-vertical" size="x-small"></v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title @click="updateTodo('Update', todo.id)">
              Update
            </v-list-item-title>
            <v-list-item-title @click="updateTodo('duplicate', todo.id)">
              Duplicate
            </v-list-item-title>
            <v-list-item-title @click="updateTodo('done', todo.id)" v-if="todo.status !== 'Completed'">
              Done
            </v-list-item-title>
            <v-list-item-title @click="updateTodo('delete', todo.id)">
              Delete
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <!-- </v-btn> -->
    </div>

    <!-- <v-btn icon="mdi-plus"> </v-btn> -->
  </div>
</template>

<style lang="scss">
.todo-item {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  height: 70px;
  &.overdue {
    border: 2px solid #e61e10;
    color: #e61e10;
  }
  .left-section {
    .select-item {
      .v-input {
        .v-input__details {
          display: none;
        }
      }
    }
  }
  .right-section {
    .todo-actions {
      .action-btn {
        margin-left: 5px;
      }
    }
  }
}
</style>