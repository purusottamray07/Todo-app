<script setup>
import { ref } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";

const props = defineProps({
  type: String,
  visible: Boolean,
});
const emit = defineEmits(["save", "close"]);
const dialog = ref(props.visible);

const onSave = () => {
  emit("save");
  dialog.value = false;
};

const onClose = () => {
  emit("close");
};
</script>

<template>
  <div class="d-flex justify-center">
    <v-dialog v-model="dialog" width="auto">
      <div class="modal-container">
        <div class="header">
          <div class="title">{{ type }} Todo</div>
          <div class="close-modal" @click="onClose">
            <v-icon icon="mdi-close-circle"></v-icon>
          </div>
        </div>
        <div class="body">Are you sure you want to do this ?</div>
        <div class="footer">
          <v-btn class="action-btn" @click="onSave">Delete </v-btn>
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
    align-items: center;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
