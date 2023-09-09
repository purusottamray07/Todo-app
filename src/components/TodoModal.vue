<script setup>
import { ref, onMounted, watch, computed } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const props = defineProps({
  type: String,
  visible: Boolean,
  updateValues: Object,
});
const emit = defineEmits(["save", "close"]);

const name = ref("");
const due = ref("");
const id = ref();

const dialog = ref(props.visible);
const updateData = ref(props.updateValues);

onMounted(() => {
  if (updateData.value) {
    id.value = updateData.value.id;
    name.value = updateData.value.name;
    due.value = updateData.value.due;
  }
});

watch(props.updateValues, async (first) => {
  id.value = first.id;
  name.value = first.name;
  due.value = first.due;
});

const handleDate = (modelData) => {
  due.value = modelData;
};

const onSave = () => {
  emit("save", {
    id: id._value,
    name: name._value,
    due: due._value.toLocaleString(),
  });
  resetValues();
  dialog.value = false;
};

const onClose = () => {
  emit("close");
};

const resetValues = () => {
  id.value = "";
  name.value = "";
  due.value = "";
};

const isDisabled = computed(() => {
  return (name.value === "" || due.value === "");
});
</script>

<template>
  <div class="d-flex justify-center">
    <!-- <v-btn color="primary" @click="dialog = true"> {{ type }} Todo </v-btn> -->
    <v-dialog v-model="dialog" width="auto">
      <div class="modal-container">
        <div class="header">
          <div class="title">{{ type }} Todo</div>
          <div class="close-modal" @click="onClose">
            <v-icon icon="mdi-close-circle"></v-icon>
          </div>
        </div>
        <div class="body">
          <v-text-field
            label="Name"
            class="todo-name"
            clearable
            variant="outlined"
            v-model="name"
          ></v-text-field>
          <VueDatePicker
            v-model="due"
            @update:model-value="handleDate"
          ></VueDatePicker>
        </div>
        <div class="footer">
          <v-btn
            class="action-btn"
            v-if="type === 'Create'"
            @click="onSave"
            :disabled="isDisabled"
            >Create
          </v-btn>
          <v-btn
            class="action-btn"
            v-else
            @click="onSave"
            :disabled="isDisabled"
          >
            Update
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
.modal-container {
  display: flex;
  flex-direction: column;
  width: 800px;
  background-color: white;
  padding: 10px;
  border-radius: 6px;
  .header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #708090;
    border-radius: 4px;
    font-size: 20px;
    font-weight: bold;
    color: white;
    .close-modal {
      cursor: pointer;
    }
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
