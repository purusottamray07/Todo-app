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
  <div class="d-flex justify-center tabs-container w-full flex-col">
    <div class="tab-header-container w-full flex">
      <div
        class="tab-header flex cursor-pointer"
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
    <div class="tab-content-container h-full">
      <div v-for="item of tabNames" :key="item.id">
        <slot
          class="tab-content w-full flex h-full"
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
  .tab-header-container {
    border-bottom: 1px solid lightgrey;

    .tab-header {
      min-width: 100px;
      padding: 10px;
    }

    .tab-header:hover {
      background-color: rgba(236, 236, 236, 0.8);
    }
  }

  .tab-content-container {
    div:has(div) {
      height: 100%;
    }
  }
}
</style>
