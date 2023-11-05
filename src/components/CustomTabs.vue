<script setup>
import { ref } from "vue";

const props = defineProps({
  tabNames: Array,
});
const emit = defineEmits(["close"]);

const selectedTab = ref(props.tabNames[0]?.id);

const onHeaderClick = (id) => {
  selectedTab.value = id;
};

const isTabSelected = (id) => {
  return id === selectedTab.value;
};
</script>

<template>
  <div class="d-flex justify-center tabs-container">
    <div class="tab-header-container">
      <div
        class="tab-header"
        v-for="item of tabNames"
        :key="item.id"
        @click="onHeaderClick(item.id)"
        :style="{
          borderBottom: isTabSelected(item.id) ? '1px solid red' : 'none',
        }"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="tab-content-container">
      <div v-for="item of tabNames" :key="item.id">
        <slot
          class="tab-content"
          :name="item.name"
          v-if="isTabSelected(item.id)"
          >Nothing to display !!</slot
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tabs-container {
  flex-direction: column;
  width: 100%;
  .tab-header-container {
    display: flex;
    border-bottom: 1px solid lightgrey;
    width: 100%;
    .tab-header {
      display: flex;
      min-width: 100px;
      padding: 10px;
      cursor: pointer;
    }

    .tab-header:hover {
      background-color: rgba(236, 236, 236, 0.8);
    }
  }

  .tab-content-container {
    height: 100%;
    div:has(div) {
      height: 100%;
      .tab-content {
        display: flex;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
