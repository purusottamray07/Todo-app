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
  <div class="home-container">
    <div class="header">My Todo List</div>
    <div class="body">
      <div class="create-todos-section">
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
</template>

<style lang="scss">
.home-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    background-color: #708090;
    border-radius: 4px;
    font-size: 32px;
    font-weight: bold;
    color: white;
  }
  .body {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 70%;
    padding: 10px 0px;
    .create-todos-section {
      display: flex;
      justify-content: space-between;

      .create-todo {
        width: 300px;
      }
      .view-all-todos {
      }
    }
    .todo-list-container {
      display: flex;
      flex-direction: column;
      width: 60%;
      margin: 10px 0px;
    }
  }
}
</style>
