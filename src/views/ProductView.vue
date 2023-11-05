<script setup>
import { ref, onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useDisplay } from "vuetify";
import PopupViewerModal from "../components/PopupViewerModal.vue";
import productImageThumbnail from "../assets/product-image-thumbnail.jpeg";
import productImage from "../assets/product-image.jpeg";
import productImageLarge from "../assets/product-image-large.jpeg";
import productImageFrontThumbnail from "../assets/product-image-front-thumbnail.jpeg";
import productImageFrontImage from "../assets/product-image-front.jpeg";
import productImageFrontLarge from "../assets/product-image-front-large.jpeg";
import productImageBackThumbnail from "../assets/product-image-back-thumbnail.jpeg";
import productImageBack from "../assets/product-image-back.jpeg";
import productImageBackLarge from "../assets/product-image-back-large.jpeg";

const imagesList = ref([
  {
    id: uuidv4(),
    thumbnailImage: productImageThumbnail,
    normalSizeImage: productImage,
    largeSizeImage: productImageLarge,
    description:
      "Samsung Galaxy S23 Plus 5G (Phantom Black, 8GB, 256GB Storage)",
  },
  {
    id: uuidv4(),
    thumbnailImage: productImageFrontThumbnail,
    normalSizeImage: productImageFrontImage,
    largeSizeImage: productImageFrontLarge,
    description:
      "Samsung Galaxy S23 Plus 5G (Phantom Black, 8GB, 256GB Storage)",
  },
  {
    id: uuidv4(),
    thumbnailImage: productImageBackThumbnail,
    normalSizeImage: productImageBack,
    largeSizeImage: productImageBackLarge,
    description:
      "Samsung Galaxy S23 Plus 5G (Phantom Black, 8GB, 256GB Storage)",
  },
]);

const productDetails = ref([
  {
    id: uuidv4(),
    label: "SIM",
    value: "Dual sim",
  },
  {
    id: uuidv4(),
    label: "Condition",
    value: "Like new",
  },
  {
    id: uuidv4(),
    label: "colour",
    value: "Lavendar",
  },
  {
    id: uuidv4(),
    label: "network",
    value: "Unlocked",
  },
  {
    id: uuidv4(),
    label: "storage",
    value: "512 GB",
  },
]);

const visibleImage = ref(imagesList.value[0].id);
const showZoomedInContent = ref(false);
const { mobile } = useDisplay();
const openModal = ref(false);

const onThumbnailClick = (data) => {
  visibleImage.value = data;
};

const onImageClick = (data) => {
  openModal.value = true;
};

const onArrowClick = (type) => {
  const imagePosition = imagesList.value.findIndex(
    (image) => image.id === visibleImage.value
  );
  const lastPosition = imagesList.value.length - 1;

  if (type === "left") {
    if (imagePosition === 0) {
      visibleImage.value = imagesList.value[lastPosition].id;
    } else {
      visibleImage.value = imagesList.value[imagePosition - 1].id;
    }
  } else {
    if (imagePosition === lastPosition) {
      visibleImage.value = imagesList.value[0].id;
    } else {
      visibleImage.value = imagesList.value[imagePosition + 1].id;
    }
  }
};

const onImageMouseOver = (event) => {
  const backgroundX = (event.offsetX / event.srcElement.clientWidth) * 100;
  const backgroundY = (event.offsetY / event.srcElement.clientHeight) * 100;
  const largerImageContainer = document.getElementsByClassName(
    "image-zoomed-content"
  )[0];

  largerImageContainer.style.backgroundPosition = `${backgroundX}% ${backgroundY}%`;
  showZoomedInContent.value = true;
};

const getZoomedPic = () => {
  const imageURL = imagesList.value.find(
    (image) => image.id === visibleImage.value
  ).largeSizeImage;
  return imageURL;
};

const onClose = () => {
  openModal.value = false;
};
</script>

<template>
  <div class="home-container flex flex-col w-full h-full">
    <div
      class="header flex justify-start align-center h-full text-3xl font-bold text-white"
    >
      <img src="../assets/tbps-logo.webp" class="app-logo" />
    </div>
    <div class="body flex justify-center w-full">
      <div class="product-page-container flex w-full">
        <div class="image-carousel-container">
          <div class="carousel-section flex align-center w-full h-full">
            <div
              class="thumbnails-section flex flex-col justify-start h-full"
              v-if="!mobile"
            >
              <div
                class="thumbnail-images cursor-pointer"
                v-for="image in imagesList"
                :key="image.id"
                @click="onThumbnailClick(image.id)"
              >
                <img :src="image.thumbnailImage" alt="" />
              </div>
            </div>
            <div class="left-move cursor-pointer" @click="onArrowClick('left')">
              &lt;
            </div>
            <div
              class="image-container flex justify-center w-full h-full"
              @mousemove="onImageMouseOver"
              @mouseout="showZoomedInContent = false"
            >
              <div
                class="images flex justify-center items-center"
                v-for="image in imagesList"
                :key="image.id"
                @click="onImageClick(image.id)"
                :style="{
                  display: visibleImage === image.id ? 'flex' : 'none',
                }"
              >
                <img :src="image.normalSizeImage" alt="" class="h-full" />
              </div>
            </div>
            <div
              class="image-zoomed-content absolute overflow-hidden"
              v-show="showZoomedInContent"
              :style="{
                'background-image': `url(${getZoomedPic()})`,
              }"
            ></div>
            <div
              class="right-move cursor-pointer"
              @click="onArrowClick('right')"
            >
              >
            </div>
          </div>
          <div class="scroll-display flex items-center justify-center">
            <div
              class="images-dot flex"
              v-for="image in imagesList"
              :key="image.id"
              @click="onThumbnailClick(image.id)"
              :style="{
                backgroundColor:
                  visibleImage === image.id ? '#eb7d7c' : '#BDBDBD',
              }"
            ></div>
          </div>
        </div>
        <div class="product-description h-full">
          <div class="section-1">
            <div class="product-manufacturer flex justify-between">
              <span>SAMSUNG</span>
              <span class="offer">Hurry Limited Stock</span>
            </div>
            <div class="product-name">Samsung Galaxy S23 Plus 5G</div>
            <div class="product-price">&#163;880.00</div>
          </div>
          <div class="section-2">
            <div
              class="product-details"
              v-for="item of productDetails"
              :key="item.id"
            >
              <label for="" class="name capitalize">{{ item.label }}:</label>
              <span class="name uppercase mx-1">{{ item.value }}</span>
            </div>
          </div>
          <div class="section-3">
            <div class="modify-quantity flex items-center">
              <span class="decrease flex items-center">-</span>
              <span class="quantity flex items-center justify-center">1</span>
              <span class="increase flex items-center">+</span>
            </div>
            <div class="add-to-basket flex justify-center">
              <Button class="add-button w-full">Add to Basket</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <PopupViewerModal
    :visible="openModal"
    :imagesList="imagesList"
    :selectedImage="visibleImage"
    @close="onClose"
    v-if="openModal"
  ></PopupViewerModal>
</template>

<style lang="scss">
.home-container {
  background-color: #f5f5f5;
  .header {
    background-color: white;
    height: 100px;
    padding: 0px 200px;
    @media (max-width: 440px) {
      padding: 0px 20px;
    }

    .app-logo {
      height: 80%;
    }
  }
  .body {
    padding: 20px 200px;
    margin: 0 auto;
    height: calc(100% - 100px);
    .product-page-container {
      height: 80%;
      @media (max-width: 440px) {
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
      }
      .image-carousel-container {
        width: 50%;
        height: 100%;
        padding: 0px 30px;
        @media (max-width: 440px) {
          width: 100%;
          padding: 0px 0px 40px 0px;
        }

        .carousel-section {
          padding: 10px 0px;
          background-color: white;

          @media (max-width: 440px) {
            height: 400px;
          }

          .thumbnails-section {
            padding: 10px;
            .thumbnail-images {
              border: 2px solid transparent;
              border-radius: 4px;
              padding: 4px;
              box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
            }

            .thumbnail-images:hover {
              border: 2px solid black;
            }
          }

          .thumbnails-section > div {
            margin-bottom: 10px;
          }
          .left-move,
          .right-move {
            font-size: 22px;
            font-weight: bold;
            margin: 0px 10px;
            border: 2px solid transparent;
          }

          .image-container {
            .images {
              padding: 20px;
              img {
                width: auto;
              }
            }
          }

          .image-zoomed-content {
            width: 600px;
            height: 400px;
            background-position: 50% 50%;
            border: 2px solid red;
            right: 380px;
            top: 120px;
            z-index: 1;
          }
        }
        .scroll-display {
          height: 20px;
          margin-top: 10px;

          .images-dot {
            width: 12px;
            height: 12px;
            border-radius: 12px;
            background-color: #bdbdbd;
            margin: 0px 6px;
          }
        }
      }

      .product-description > div {
        padding: 30px 0px;
      }

      .product-description {
        width: 50%;
        padding: 0px 30px;
        @media (max-width: 440px) {
          width: 100%;
          padding: 0px;
        }

        .section-1 {
          padding-top: 0px;
          .product-manufacturer {
            .offer {
              color: #adcbbb;
              font-weight: 500;
            }
          }
          .product-name {
            font-weight: bold;
            font-size: 22px;
            margin-bottom: 10px;
          }
          .product-price {
            font-weight: bold;
            font-size: 18px;
          }
        }

        .section-2 > div {
          margin-bottom: 20px;
          label {
            font-weight: bold;
          }
        }

        .section-3 {
          .modify-quantity {
            margin: 10px 0px;
            @media (max-width: 440px) {
              justify-content: center;
            }

            span.decrease,
            span.increase {
              font-size: 24px;
              font-weight: bold;
            }

            .quantity {
              width: 10%;
              background-color: #eeeeee;
              height: 40px;
              margin: 0px 10px;
            }
          }
          .add-to-basket {
            .add-button {
              padding: 10px;
              background-color: #ffd812;
              border-radius: 4px;
              font-weight: bold;
            }
          }
        }
      }

      .product-description > div:not(:last-child) {
        border-bottom: 2px solid grey;
      }
    }

    @media (max-width: 440px) {
      width: 100%;
      padding: 10px;
    }
  }
}
</style>
