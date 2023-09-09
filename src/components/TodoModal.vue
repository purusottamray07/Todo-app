<script setup>
import { ref, onMounted, watch, computed } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useDisplay } from "vuetify";

const props = defineProps({
  type: String,
  visible: Boolean,
  updateValues: Object,
});
const emit = defineEmits(["save", "close"]);
const { mobile } = useDisplay();


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
  return name.value === "" || due.value === "";
});
</script>

<template>
  <div class="d-flex justify-center">
    <v-dialog v-model="dialog" :fullscreen="mobile">
      <div class="modal-container h-full w-full flex flex-col p-2.5 rounded">
        <div
          class="header flex justify-between align-center rounded text-3xl font-bold text-white p-2.5"
        >
          <div class="title">{{ type }} Todo</div>
          <div class="close-modal cursor-pointer" @click="onClose">
            <v-icon icon="mdi-close-circle"></v-icon>
          </div>
        </div>
        <div class="body flex flex-col">
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
        <div class="footer flex justify-end">
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
  @media (min-width: 440px) {
    width: 800px;
    height: auto;
    margin: 0 auto;
  }
  background-color: white;
  .header {
    background-color: #708090;
  }
  .body {
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
