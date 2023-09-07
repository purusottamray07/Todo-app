<script setup>
import { ref, onMounted } from "vue";
import TodoModal from "../components/TodoModal.vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const todoList = ref([]);
const openModal = ref(false);
const modalType = ref();
const updateData = ref();

onMounted(() => {
  // isOverdue();
});

const isOverdue = (date) => {
  const isPastDueDate = moment().diff(date);

  if (isPastDueDate > 0) {
    return true;
  } else {
    return false;
  }
};

const open = (type) => {
  modalType.value = type;
  openModal.value = true;
};

const onSave = (data) => {
  openModal.value = false;
  const newItem = {
    id: uuidv4(),
    name: data.name,
    status: "Pending",
    due: data.date,
    checked: false,
  };

  const isPastDueDate = moment().diff(newItem.due);

  if (isPastDueDate > 0) {
    newItem.status = "Overdue";
  }

  todoList.value = [...todoList.value, newItem];
};

const updateTodo = (type, id) => {
  const item = todoList._rawValue.filter((x) => x.id === id);
  switch (type) {
    case "Update":
      updateData.value = item[0];
      open(type);
      break;
    case "duplicate":
      break;
    case "done":
      break;
    case "delete":
      break;

    default:
      break;
  }
};
</script>

<template>
  <main>
    <!-- <TheWelcome /> -->
    <div class="home-container">
      <div class="header">
        <div class="create-todo">
          <v-btn color="primary" @click="open('Create')"> Create Todo </v-btn>
        </div>
        <div class="view-all-todos">
          <v-btn> View all completed todo's </v-btn>
        </div>
      </div>
      <div class="body">
        <div class="todo-list-container">
          <div
            class="todo-item"
            v-for="todo in todoList"
            :key="todo.id"
            :class="{ overdue: isOverdue(todo.due) }"
          >
            <div class="left-section">
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
                <v-btn
                  class="action-btn"
                  @click="updateTodo('Update', todo.id)"
                >
                  Update
                </v-btn>
                <v-btn class="action-btn" @click="updateTodo('duplicate')">
                  Duplicate
                </v-btn>
                <v-btn class="action-btn" @click="updateTodo('done')">
                  Done
                </v-btn>
                <v-btn class="action-btn" @click="updateTodo('delete')">
                  Delete
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TodoModal
      :updateValues="updateData"
      :type="modalType"
      :visible="openModal"
      @save="onSave"
      v-if="openModal"
    ></TodoModal>
  </main>
</template>

<style lang="scss">
.home-container {
  display: flex;
  flex-direction: column;
  width: 800px;
  height: 100vh;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 200px;
    .create-todo {
      width: 300px;
    }
    .view-all-todos {
    }
  }
  .body {
    display: flex;
    width: 800px;
    .todo-list-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      .overdue {
        background: #f58787;
        color: white;
        border: 2px solid red;
      }
      .todo-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        border-radius: 10px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        margin-bottom: 10px;
        height: 80px;
        .left-section {
          display: flex;
          align-items: center;
        }
        .right-section {
          .todo-actions {
            .action-btn {
              margin-left: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
