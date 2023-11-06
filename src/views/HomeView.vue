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
import { useDisplay } from "vuetify";
import router from "@/router";

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
const { mobile } = useDisplay();

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
  if (type === "Create") {
    updateData.value = null;
  }
  modalType.value = type;
  openModal.value = true;
};

const onClose = () => {
  openModal.value = false;
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

const closeConfirmModal = () => {
  openConfirmModal.value = false;
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

const onConfirm = () => {
  closeConfirmModal();
  todoStore.deleteTodo(selectedTodoID.value);
  selectedTodoID.value = "";
};

const completedTodo = (id) => {
  todoStore.markAsCompleted(id);
};

const duplicateTodo = (id) => {
  const itemToDuplicate = getTodo.value(id);
  todoStore.duplicateTodo(itemToDuplicate);
};

const onProductsPageClick = () => {
  router.push({ name: "products" });
};
</script>

<template>
  <div class="home-container flex flex-col w-full h-full">
    <div
      class="header flex justify-between align-center text-3xl font-bold text-white"
    >
      My Todo App
      <div class="products-page cursor-pointer" @click="onProductsPageClick">
        Products Page
      </div>
    </div>
    <div class="body flex flex-col w-3/4p">
      <div
        class="page-header flex justify-center align-center text-base font-bold"
      >
        {{ viewAllCompleted ? "All completed todo's" : "All todo's" }}
      </div>
      <div class="create-todos-section flex justify-between">
        <div class="create-todo" v-if="!mobile">
          <v-btn color="primary" @click="open('Create')"> Create Todo </v-btn>
        </div>
        <div class="view-all-todos flex w-full justify-end">
          <v-btn @click="viewAllCompleted = !viewAllCompleted">
            {{ viewAllCompleted ? "View all" : "View completed" }}
          </v-btn>
        </div>
      </div>
      <template v-if="!viewAllCompleted">
        <template v-if="todoStore.getAllTodos.length">
          <div
            class="todo-list-container flex flex-col"
            v-for="todo in todoStore.getAllTodos"
            :key="todo.id"
          >
            <TodoDetails :todo="todo" @updateTodo="updateTodo"></TodoDetails>
          </div>
        </template>
        <template v-else>
          <div class="empty-section flex justify-center">
            It's time to create a task !!
          </div>
        </template>
      </template>

      <template v-if="viewAllCompleted">
        <template v-if="todoStore.getAllCompletedTodos.length">
          <div
            class="todo-list-container"
            v-for="todo in todoStore.getAllCompletedTodos"
            :key="todo.id"
          >
            <TodoDetails
              :todo="todo"
              @updateTodo="updateTodo"
            ></TodoDetails></div
        ></template>
        <template v-else>
          <div class="empty-section flex justify-center">
            No task is completed yet !!
          </div>
        </template>
      </template>

      <div
        class="mobile-create-todo absolute bottom-8 right-8"
        v-if="mobile"
        @click="open('Create')"
      >
        <v-col cols="auto">
          <v-btn
            icon="mdi-plus"
            size="large"
            class="create-todo-mbile-btn"
          ></v-btn>
        </v-col>
      </div>
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

<style lang="scss" scoped>
.home-container {
  .header {
    background-color: #708090;
    height: 100px;

    .products-page {
      background: white;
      border-radius: 4px;
      padding: 5px 10px;
      color: rgba(32, 32, 39, 0.8);
    }
    .products-page:hover {
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    }
  }
  .body {
    padding: 10px 0px;
    margin: 0 auto;
    width: 1000px;

    @media (max-width: 440px) {
      width: 100%;
      padding: 10px;
    }
    .page-header {
      padding: 10px 0 20px 0;
    }
    .create-todos-section {
      @media (max-width: 440px) {
        justify-content: center;
      }
      .create-todo {
        width: 300px;
      }
    }
    .todo-list-container {
      width: 80%;
      margin: 10px auto;
      @media (max-width: 440px) {
        width: 100%;
        margin: 10px 0;
      }
    }
    .mobile-create-todo {
      .create-todo-mbile-btn {
        background-color: rgb(98, 0, 238);
        color: white;
      }
    }
    .empty-section {
      padding-top: 80px;
    }
  }
}
</style>
