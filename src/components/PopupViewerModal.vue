<script setup>
import { ref } from "vue";
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
const { mobile } = useDisplay();

const dialog = ref(props.visible);
const currentImage = ref(props.selectedImage);
const isZoomedInVisible = ref(false);
const touchStartPosX = ref();
const doubleTapped = ref(false);

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
  if (mobile.value) {
    if (!doubleTapped.value) {
      doubleTapped.value = true;
      setTimeout(function () {
        doubleTapped.value = false;
      }, 400);
      return false;
    }
    event.preventDefault();
  }

  const originalImageElement = document.getElementsByClassName("image")[0];
  const zoomedElement = document.getElementsByClassName("zoomed-image")[0];
  const backgroundX = (event.offsetX / event.srcElement.clientWidth) * 100;
  const backgroundY = (event.offsetY / event.srcElement.clientHeight) * 100;

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
  <div
    class="d-flex justify-center popup-background absolute w-full h-full"
    v-if="visible"
  >
    <div class="popup-container w-full h-full flex justify-center items-center">
      <div class="popup-body">
        <div class="popup-header flex justify-between items-center relative">
          <div class="header-title" v-if="showHeader">Header</div>
          <div
            class="close-popup absolute right-0 top-0 cursor-pointer"
            @click="onClose"
            v-if="!mobile"
          >
            <v-icon icon="mdi-close-circle"></v-icon>
          </div>
          <div class="back-btn" @click="onClose" v-else>Back</div>
        </div>
        <div class="popup-content flex items-center justify-center h-full">
          <CustomTabs :tabNames="tabHeader">
            <template v-slot:Images>
              <div class="images-container flex h-full">
                <div
                  class="left-section swipe-container flex justify-center h-full"
                  @touchstart="onTouchStart"
                  @touchend="onTouchEnd"
                >
                  <div class="product-description flex font-bold" v-if="mobile">
                    {{ getDescription() }}
                  </div>
                  <div
                    class="zoomed-image w-full"
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
                  <div
                    class="product-description flex font-bold"
                    v-if="!mobile"
                  >
                    {{ getDescription() }}
                  </div>
                  <div class="thumbnails-container flex items-center">
                    <div
                      class="thumbnail-images cursor-pointer"
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
  background-color: rgba(228, 228, 228, 0.8);
  z-index: 10;
  .popup-container {
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
        padding: 5px 10px;

        .back-btn {
          border: 1px solid lightgray;
          padding: 5px 10px;
          border-radius: 4px;
          box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
        }
      }

      .popup-content {
        .images-container {
          @media (max-width: 440px) {
            flex-direction: column;
            padding: 10px;
          }
          .left-section {
            width: 70%;
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
            }
            .thumbnails-container {
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
