<script setup>
import { ref } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import { useDisplay } from "vuetify";

const props = defineProps({
  type: String,
  visible: Boolean,
});
const emit = defineEmits(["save", "close"]);
const dialog = ref(props.visible);
const { mobile } = useDisplay();

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
    <v-dialog v-model="dialog" :fullscreen="mobile">
      <div class="modal-container h-full w-full flex flex-col p-2.5 rounded">
        <div
          class="header flex justify-between p-2.5 rounded text-3xl font-bold text-white"
        >
          <div class="title">{{ type }} Todo</div>
          <div class="close-modal cursor-pointer" @click="onClose">
            <v-icon icon="mdi-close-circle"></v-icon>
          </div>
        </div>
        <div class="body flex flex-col align-center">
          Are you sure you want to do this ?
        </div>
        <div class="footer flex justify-end">
          <v-btn class="action-btn" @click="onSave">Delete </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
.modal-container {
  background-color: white;
  @media (min-width: 440px) {
    width: 800px;
    height: auto;
    margin: 0 auto;
  }
  .header {
    background-color: #708090;
  }
  .body {
    padding: 20px 0 80px;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
