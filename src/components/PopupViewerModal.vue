<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useDisplay } from "vuetify";
import CustomTabs from "../components/CustomTabs.vue";
import { v4 as uuidv4 } from "uuid";

const props = defineProps({
  visible: Boolean,
  imagesList: Array,
  showHeader: Boolean,
  selectedImage: String,
});
const emit = defineEmits(["close"]);
const dialog = ref(props.visible);
const currentImage = ref(props.selectedImage);
const { mobile } = useDisplay();
const isZoomedInVisible = ref(false);

const touchStartPosX = ref();

const onTouchStart = (event) => {
  touchStartPosX.value = event.changedTouches[0].pageX;
};

const onTouchEnd = (event) => {
  const currentEndPosX = event.changedTouches[0].pageX;
  const diff = currentEndPosX - touchStartPosX.value;
  
  if (diff > 0) {
    handleSwipe("right");
  } else if (diff < 0) {
    handleSwipe("left");
  }
};

const handleSwipe = (type) => {
  const currentImagePosition = props.imagesList.findIndex(
    (image) => image.id === currentImage.value
  );
  const lastPosition = props.imagesList.length - 1;
  switch (type) {
    case "left":
      if (currentImagePosition === 0) {
        currentImage.value = props.imagesList[lastPosition].id;
      } else {
        currentImage.value = props.imagesList[currentImagePosition - 1].id;
      }
      break;

    case "right":
      if (currentImagePosition === lastPosition) {
        currentImage.value = props.imagesList[0].id;
      } else {
        currentImage.value = props.imagesList[currentImagePosition + 1].id;
      }
      break;
    default:
      break;
  }
};

const onClose = () => {
  dialog.value = false;
  emit("close");
};

const tabHeader = ref([
  {
    name: "Images",
    id: uuidv4(),
  },
  {
    name: "Videos",
    id: uuidv4(),
  },
]);

const onThumbnailClick = (id) => {
  currentImage.value = props.imagesList.find((image) => image.id === id).id;
};

const getZoomedPic = () => {
  const imageURL = props.imagesList.find(
    (image) => image.id === currentImage.value
  ).largeSizeImage;
  return imageURL;
};

const onZoomedImageClick = () => {
  const originalImageElement = document.getElementsByClassName("image")[0];
  const zoomedElement = document.getElementsByClassName("zoomed-image")[0];

  originalImageElement.style.display = "flex";
  zoomedElement.style.display = "none";
  isZoomedInVisible.value = false;
};

const onImageClick = (event) => {
  const originalImageElement = document.getElementsByClassName("image")[0];
  const zoomedElement = document.getElementsByClassName("zoomed-image")[0];

  const clientWidth = event.srcElement.clientWidth;
  const clientHeight = event.srcElement.clientHeight;
  const offsetX = event.offsetX;
  const offsetY = event.offsetY;
  const backgroundX = (offsetX / clientWidth) * 100;
  const backgroundY = (offsetY / clientHeight) * 100;

  originalImageElement.style.display = "none";
  zoomedElement.style.display = "flex";
  zoomedElement.style.backgroundImage = `url(${getZoomedPic()})`;
  zoomedElement.style.backgroundPosition = `${backgroundX}% ${backgroundY}%`;
  isZoomedInVisible.value = true;
};

const getDescription = () => {
  let x = props.imagesList.find((image) => image.id === currentImage.value);
  return x.description;
};

const getImage = () => {
  return props.imagesList.find((image) => image.id === currentImage.value)
    .normalSizeImage;
};

const getIsActive = (id) => {
  return id === currentImage.value;
};
</script>

<template>
  <div class="d-flex justify-center popup-background" v-if="visible">
    <div class="popup-container">
      <div class="popup-body">
        <div class="popup-header">
          <div class="header-title" v-if="showHeader">Header</div>
          <div class="close-popup" @click="onClose" v-if="!mobile">
            <v-icon icon="mdi-close-circle"></v-icon>
          </div>
          <div class="back-btn" @click="onClose" v-else>Back</div>
        </div>
        <div class="popup-content">
          <CustomTabs :tabNames="tabHeader">
            <template v-slot:Images>
              <div class="images-container">
                <div
                  class="left-section swipe-container"
                  @touchstart="onTouchStart"
                  @touchend="onTouchEnd"
                >
                  <div class="product-description" v-if="mobile">
                    {{ getDescription() }}
                  </div>
                  <div
                    class="zoomed-image"
                    :style="{ display: 'none' }"
                    @click="onZoomedImageClick"
                  ></div>
                  <img
                    class="image"
                    :src="getImage()"
                    alt=""
                    @click="onImageClick"
                  />
                </div>
                <div class="right-section">
                  <div class="product-description" v-if="!mobile">
                    {{ getDescription() }}
                  </div>
                  <div class="thumbnails-container">
                    <div
                      class="thumbnail-images"
                      v-for="image in imagesList"
                      :key="image.id"
                      @click="onThumbnailClick(image.id)"
                    >
                      <img
                        :src="image.thumbnailImage"
                        alt=""
                        :style="{
                          border: getIsActive(image.id)
                            ? '3px solid lightcoral'
                            : 'none',
                        }"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-slot:Videos></template>
          </CustomTabs>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.popup-background {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(228, 228, 228, 0.8);
  z-index: 10;
  .popup-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .popup-body {
      width: 80%;
      height: 75vh;
      background-color: white;
      padding: 10px;
      border-radius: 4px;
      @media screen and (max-width: 440px) {
        width: 100%;
        height: 100%;
        overflow-y: auto;
      }

      .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        padding: 5px 10px;

        .back-btn {
          border: 1px solid lightgray;
          padding: 5px 10px;
          border-radius: 4px;
          box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
        }

        .close-popup {
          position: absolute;
          right: 0;
          top: 0px;
          cursor: pointer;
        }
      }

      .popup-content {
        display: flex;
        align-content: center;
        justify-content: center;
        height: 100%;

        .images-container {
          display: flex;
          height: 100%;

          @media (max-width: 440px) {
            flex-direction: column;
            padding: 10px;
          }
          .left-section {
            display: flex;
            justify-content: center;
            width: 70%;
            height: 100%;
            padding: 20px 0px;
            @media (max-width: 440px) {
              flex-direction: column;
              justify-content: flex-start;
              align-items: center;
              width: 100%;
              flex: 1;
            }

            .product-description {
              margin-bottom: 10px;
              display: flex;
              font-weight: bold;
            }

            img {
              height: 520px;

              @media screen and (max-width: 440px) {
                width: fit-content;
              }
            }

            .zoomed-image {
              width: 100%;
              height: 520px;
            }
          }
          .right-section {
            .product-description {
              margin-bottom: 10px;
              display: flex;
              font-weight: bold;
            }
            .thumbnails-container {
              display: flex;
              align-items: center;
              .thumbnail-images {
                margin-right: 20px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
