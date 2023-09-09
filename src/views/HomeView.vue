<script setup>
import { ref, onMounted, watch } from "vue";
import TodoModal from "../components/TodoModal.vue";
import ConfirmModal from "../components/ConfirmModal.vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useTodoStore } from "../stores/todoStore";
import TodoDetails from "../components/TodoDetails.vue";
import { storeToRefs } from "pinia";
import TodoService from "../services/TodoServices";

const todoList = ref([]);
const todoListDisplay = ref([]);
const openModal = ref(false);
const openConfirmModal = ref(false);
const modalType = ref();
const updateData = ref();
const isUpdate = ref(false);
const viewAllCompleted = ref(false);
const selectedTodoID = ref("");
const todoService = new TodoService();

onMounted(() => {});

const todoStore = useTodoStore();
const { getTodo } = storeToRefs(todoStore);

watch(todoList, async (newTodoList) => {
  todoListDisplay.value = newTodoList.filter(
    (todo) => todo.status !== "Completed"
  );
});

watch(viewAllCompleted, async (viewAllCompleted) => {
  if (viewAllCompleted) {
    todoListDisplay.value = todoList.value.filter(
      (todo) => todo.status === "Completed"
    );
  } else {
    todoListDisplay.value = todoList.value.filter(
      (todo) => todo.status !== "Completed"
    );
  }
});

const open = (type) => {
  modalType.value = type;
  openModal.value = true;
};

const onClose = () => {
  openModal.value = false;
};

const onSave = (data) => {
  onClose();
  if (isUpdate.value) {
    // update op

    todoStore.updateTodo(data);
    updateData.value = null;
  } else {
    // add op

    const item = {
      id: uuidv4(),
      name: data.name,
      status: todoService.isOverdue(data.due) ? "Overdue" : "Pending",
      due: data.due,
      checked: false,
    };
    const isPastDueDate = moment().diff(item.due);

    if (isPastDueDate > 0) {
      item.status = "Overdue";
    }
    todoStore.addTodo(item);
  }
};

const updateTodo = (type, id) => {
  const item = getTodo.value(id);
  switch (type) {
    case "Update":
      isUpdate.value = true;
      updateData.value = item;
      open(type);
      break;
    case "duplicate":
      duplicateTodo(id);
      break;
    case "done":
      completedTodo(id);
      break;
    case "delete":
      deleteTodo(id);
      break;

    default:
      break;
  }
};

const deleteTodo = (id) => {
  selectedTodoID.value = id;
  openConfirmModal.value = true;
};

const onConfirm = () => {
  closeConfirmModal();
  todoStore.deleteTodo(selectedTodoID.value);
  selectedTodoID.value = "";
};

const closeConfirmModal = () => {
  openConfirmModal.value = false;
};

const completedTodo = (id) => {
  todoStore.markAsCompleted(id);
};

const duplicateTodo = (id) => {
  const itemToDuplicate = getTodo.value(id);
  todoStore.duplicateTodo(itemToDuplicate);
};
</script>

<template>
  <main>
    <div class="home-container">
      <div class="header">
        <div class="create-todo">
          <v-btn color="primary" @click="open('Create')"> Create Todo </v-btn>
        </div>
        <div class="view-all-todos">
          <v-btn @click="viewAllCompleted = !viewAllCompleted">
            {{
              viewAllCompleted ? "View all todo's" : "View all completed todo's"
            }}
          </v-btn>
        </div>
      </div>
      <div class="body">
        <template v-if="!viewAllCompleted">
          <div
            class="todo-list-container"
            v-for="todo in todoStore.getAllTodos"
            :key="todo.id"
          >
            <TodoDetails :todo="todo" @updateTodo="updateTodo"></TodoDetails>
          </div>
        </template>

        <template v-if="viewAllCompleted">
          <div
            class="todo-list-container"
            v-for="todo in todoStore.getAllCompletedTodos"
            :key="todo.id"
          >
            <TodoDetails :todo="todo" @updateTodo="updateTodo"></TodoDetails>
          </div>
        </template>
      </div>
    </div>

    <TodoModal
      :updateValues="updateData"
      :type="modalType"
      :visible="openModal"
      @save="onSave"
      @close="onClose"
      v-if="openModal"
    ></TodoModal>

    <ConfirmModal
      type="Delete"
      :visible="openConfirmModal"
      @save="onConfirm"
      @close="closeConfirmModal"
      v-if="openConfirmModal"
    ></ConfirmModal>
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
    flex-direction: column;
    .todo-list-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      .todo-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        border-radius: 10px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        margin-bottom: 10px;
        height: 80px;
        &.overdue {
          background: #f58787;
          color: white;
          border: 2px solid red;
        }
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
