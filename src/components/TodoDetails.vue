<script setup>
import moment from "moment";

const props = defineProps({
  todo: Object,
});

const emit = defineEmits(["updateTodo"]);
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
      <div class="select-item">
        <v-checkbox v-model="todo.checked"></v-checkbox>
      </div>
      <div class="details">
        <div class="todo-name">{{ todo.name }}</div>
        <div class="todo-due">{{ todo.due }}</div>
      </div>
    </div>
    <div class="right-section">
      <div class="todo-actions" v-if="todo.checked">
        <v-btn class="action-btn" @click="updateTodo('Update', todo.id)">
          Update
        </v-btn>
        <v-btn class="action-btn" @click="updateTodo('duplicate', todo.id)">
          Duplicate
        </v-btn>
        <v-btn class="action-btn" @click="updateTodo('done', todo.id)">
          Done
        </v-btn>
        <v-btn class="action-btn" @click="updateTodo('delete', todo.id)">
          Delete
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.todo-item {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  height: 70px;
  .right-section {
    .todo-actions {
      .action-btn {
        margin-left: 5px;
      }
    }
  }
}
</style>