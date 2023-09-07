<script setup>
import { ref, onMounted, watch } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const props = defineProps({
  type: String,
  visible: Boolean,
  updateValues: Object,
});
const emit = defineEmits(["save"]);

const name = ref();
const date = ref();
const dialog = ref(props.visible);
const updateData = ref(props.updateValues);

onMounted(() => {
  if (updateData.value) {
    name.value = updateData.value.name;
    date.value = updateData.value.due;
  }
});

watch(
  () => props.updateValues,
  (first, second) => {
    name.value = first.name;
    date.value = first.due;
  }
);

const handleDate = (modelData) => {
  date.value = modelData;
};

const onSave = () => {
  emit("save", { name: name._value, date: date._value.toLocaleString() });
  resetValues();
  dialog.value = false;
};

const resetValues = () => {
  name.value = "";
  date.value = "";
};
</script>

<template>
  <div class="d-flex justify-center">
    <!-- <v-btn color="primary" @click="dialog = true"> {{ type }} Todo </v-btn> -->
    <v-dialog v-model="dialog" width="auto">
      <div class="modal-container">
        <div class="header">{{ type }} Todo</div>
        <div class="body">
          <v-text-field
            label="Name"
            class="todo-name"
            clearable
            variant="outlined"
            v-model="name"
          ></v-text-field>
          <VueDatePicker
            v-model="date"
            @update:model-value="handleDate"
          ></VueDatePicker>
        </div>
        <div class="footer">
          <v-btn class="action-btn" v-if="type === 'Create'" @click="onSave"
            >Create
          </v-btn>
          <v-btn class="action-btn" v-else @click="onSave"> Update </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
.custom-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .modal-container {
    display: flex;
    flex-direction: column;
    width: 800px;
    background-color: white;
    padding: 10px;
    border-radius: 6px;
    .header {
      display: flex;
      justify-content: center;
      padding: 10px;
    }
    .body {
      display: flex;
      flex-direction: column;
      padding: 20px 0 80px;
      .todo-name {
        height: 80px;
      }
    }
    .footer {
      display: flex;
      justify-content: flex-end;
    }
  }
}

.modal-container {
  display: flex;
  flex-direction: column;
  width: 800px;
  background-color: white;
  padding: 10px;
  border-radius: 6px;
  .header {
    display: flex;
    justify-content: center;
    padding: 10px;
  }
  .body {
    display: flex;
    flex-direction: column;
    padding: 20px 0 80px;
    .todo-name {
      height: 80px;
    }
  }
  .footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
