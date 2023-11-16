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
const touchStartPosX = ref();
const doubleTapped = ref(false);

const onTouchStart = (event) => {
  touchStartPosX.value = event.changedTouches[0].pageX;
};

const onTouchEnd = (event, tab) => {
  const currentEndPosX = event.changedTouches[0].pageX;
  const diff = currentEndPosX - touchStartPosX.value;

  if (diff > 0) {
    handleSwipe("right", tab);
  } else if (diff < 0) {
    handleSwipe("left", tab);
  }
};

const handleSwipe = (type, tabInfo) => {
  let filteredData;

  if (tabInfo === "images") {
    filteredData = props.imagesList.filter((item) => !item.isVideo);
  } else {
    filteredData = props.imagesList.filter((item) => item.isVideo);
  }

  const currentImagePosition = filteredData.findIndex(
    (image) => image.id === currentImage.value
  );
  const lastPosition = filteredData.length - 1;
  switch (type) {
    case "left":
      if (currentImagePosition === 0) {
        currentImage.value = filteredData[lastPosition].id;
      } else {
        currentImage.value = filteredData[currentImagePosition - 1].id;
      }
      break;

    case "right":
      if (currentImagePosition === lastPosition) {
        currentImage.value = filteredData[0].id;
      } else {
        currentImage.value = filteredData[currentImagePosition + 1].id;
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
  let zoomedElement;
  const originalImageElement = document.getElementsByClassName("image")[0];

  if (mobile.value) {
    zoomedElement = document.getElementsByClassName("zoomed-image-mobile")[0];
  } else {
    zoomedElement = document.getElementsByClassName("zoomed-image")[0];
  }

  originalImageElement.style.display = "flex";
  zoomedElement.style.display = "none";
};

const getDescription = (isVideo = false) => {
  if (isVideo) {
    return props.imagesList
      .filter((item) => item.isVideo)
      .find((image) => image.id === currentImage.value).description;
  } else {
    return props.imagesList.find((image) => image.id === currentImage.value)
      .description;
  }
};

const getImage = (isVideo) => {
  const isCurrentItemVideo = props.imagesList.find(
    (image) => image.id === currentImage.value
  ).isVideo;

  if (isVideo) {
    if (isCurrentItemVideo) {
      return props.imagesList
        .filter((item) => item.isVideo)
        .find((image) => image.id === currentImage.value).productVideo;
    } else {
      return props.imagesList.filter((item) => item.isVideo)[0].productVideo;
    }
  } else {
    if (isCurrentItemVideo) {
      return props.imagesList[0].normalSizeImage;
    } else {
      return props.imagesList.find((item) => item.id === currentImage.value)
        .normalSizeImage;
    }
  }
};

const getIsActive = (id) => {
  return id === currentImage.value;
};

const getSelectedTab = () => {
  const isVideoSelected = props.imagesList.find(
    (item) => item.id === currentImage.value
  ).isVideo;

  if (isVideoSelected) {
    return tabHeader.value.find((item) => item.name === "Videos").id;
  } else {
    return tabHeader.value[0].id;
  }
};

const getDisplayImage = (isVideo) => {
  const isCurrentItemVideo = props.imagesList.find(
    (image) => image.id === currentImage.value
  ).isVideo;

  if (isVideo) {
    if (isCurrentItemVideo) {
      return props.imagesList
        .filter((item) => item.isVideo)
        .find((image) => image.id === currentImage.value).productVideo;
    } else {
      return props.imagesList.filter((item) => item.isVideo)[0].productVideo;
    }
  } else {
    if (isCurrentItemVideo) {
      return props.imagesList[0].normalSizeImage;
    } else {
      return props.imagesList.find((item) => item.id === currentImage.value)
        .normalSizeImage;
    }
  }
};

const onMouseOver = (event) => {
  const zoomElement = event.currentTarget;
  const backgroundX = (event.offsetX / event.srcElement.clientWidth) * 100;
  const backgroundY = (event.offsetY / event.srcElement.clientHeight) * 100;

  zoomElement.style.backgroundPosition = `${backgroundX}% ${backgroundY}%`;
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

    const originalImageElement = document.getElementsByClassName("image")[0];
    const zoomedElement = document.getElementsByClassName(
      "zoomed-image-mobile"
    )[0];
    const backgroundX = (event.offsetX / event.srcElement.clientWidth) * 100;
    const backgroundY = (event.offsetY / event.srcElement.clientHeight) * 100;

    originalImageElement.style.display = "none";

    zoomedElement.style.display = "flex";
    zoomedElement.style.width = "100%";
    zoomedElement.style.height = "520px";
    zoomedElement.style.opacity = "1";
    zoomedElement.style.backgroundImage = `url(${getZoomedPic()})`;
    zoomedElement.style.backgroundPosition = `${backgroundX}% ${backgroundY}%`;
    event.preventDefault();
  } else {
    const element = document.getElementsByClassName("image")[0];
    element.style.display = "none";

    const zoomedElement = document.getElementsByClassName("zoomed-image")[0];
    zoomedElement.style.display = "flex";
  }
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
        <div class="popup-content flex justify-center h-full">
          <CustomTabs :tabNames="tabHeader" :selectedTab="getSelectedTab()">
            <template v-slot:Images>
              <div class="images-container flex h-full">
                <div
                  class="left-section swipe-container flex justify-center h-full"
                  @touchstart="onTouchStart"
                  @touchend="onTouchEnd($event, 'images')"
                >
                  <div class="product-description flex font-bold" v-if="mobile">
                    {{ getDescription() }}
                  </div>
                  <div
                    class="zoomed-image w-full"
                    @click="onZoomedImageClick"
                    @mousemove="onMouseOver"
                    :style="{
                      'background-image': `url(${getZoomedPic()})`,
                    }"
                    v-if="!mobile"
                  ></div>
                  <div
                    class="zoomed-image-mobile w-full"
                    @click="onZoomedImageClick"
                    :style="{
                      'background-image': `url(${getZoomedPic()})`,
                    }"
                    v-else
                  ></div>

                  <img
                    class="image cursor-pointer"
                    :src="getDisplayImage(false)"
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
                      v-for="image in imagesList.filter(
                        (item) => !item.isVideo
                      )"
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
            <template v-slot:Videos>
              <div class="images-container flex h-full">
                <div
                  class="left-section swipe-container flex justify-center h-full"
                  @touchstart="onTouchStart"
                  @touchend="onTouchEnd($event, 'videos')"
                >
                  <div class="product-description flex font-bold" v-if="mobile">
                    {{ getDescription() }}
                  </div>
                  <video class="videos" controls>
                    <source :src="getImage(true)" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
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
                      v-for="image in imagesList.filter((item) => item.isVideo)"
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
              display: none;
              width: 80%;
              height: 100%;
              margin: 0 auto;
              overflow: hidden;
              cursor: zoom-in;
              background-position: 50% 50%;
            }

            .zoomed-image img:hover {
              opacity: 0;
            }

            .zoomed-image img {
              transition: opacity 0.5s;
              display: block;
              width: 100%;
            }
          }
          .right-section {
            .product-description {
              margin-bottom: 10px;
            }
            .thumbnails-container {
              .thumbnail-images {
                width: 30px;
                height: 40px;
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
