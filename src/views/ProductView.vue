<script setup>
import { ref, onMounted, watch } from "vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useDisplay } from "vuetify";
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
  },
  {
    id: uuidv4(),
    thumbnailImage: productImageFrontThumbnail,
    normalSizeImage: productImageFrontImage,
    largeSizeImage: productImageFrontLarge,
  },
  {
    id: uuidv4(),
    thumbnailImage: productImageBackThumbnail,
    normalSizeImage: productImageBack,
    largeSizeImage: productImageBackLarge,
  },
]);

const visibleImage = ref(imagesList.value[0].id);
const { mobile } = useDisplay();

onMounted(() => {});

const onThumbnailClick = (data) => {
  console.log(data);
  visibleImage.value = data;
};

const onArrowClick = (type) => {
  const imagePosition = imagesList.value.findIndex(
    (image) => image.id === visibleImage.value
  );
  const lastPosition = imagesList.value.length - 1;

  if (type === "left") {
    if (imagePosition === 0) {
      // set to last
      visibleImage.value = imagesList.value[lastPosition].id;
    } else {
      // set to prev number
      visibleImage.value = imagesList.value[imagePosition - 1].id;
    }
  } else {
    if (imagePosition === lastPosition) {
      // set to first
      visibleImage.value = imagesList.value[0].id;
    } else {
      // set to next number
      visibleImage.value = imagesList.value[imagePosition + 1].id;
    }
  }
};
</script>

<template>
  <div class="home-container flex flex-col w-full h-full">
    <div
      class="header flex justify-start align-center h-full text-3xl font-bold text-white"
    >
      <img src="../assets/tbps-logo.webp" class="app-logo" />
    </div>
    <div class="body flex w-3/4p">
      <div class="product-page-container">
        <div class="image-carousel-container">
          <div class="carousel-section">
            <div class="thumbnails-section">
              <div
                class="thumbnail-images"
                v-for="image in imagesList"
                :key="image.id"
                @click="onThumbnailClick(image.id)"
              >
                <img :src="image.thumbnailImage" alt="" />
              </div>
            </div>
            <div class="left-move" @click="onArrowClick('left')">&lt;</div>
            <div class="image-container">
              <div
                class="images"
                v-for="image in imagesList"
                :key="image.id"
                @click="onThumbnailClick(image.id)"
                :style="{
                  display: visibleImage === image.id ? 'flex' : 'none',
                }"
              >
                <img :src="image.normalSizeImage" alt="" />
              </div>
            </div>
            <div class="right-move" @click="onArrowClick('right')">></div>
          </div>
          <div class="scroll-display">
            <div
              class="images-dot"
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
        <div class="product-description">
          <div class="section-1">
            <div class="product-manufacturer">
              <span>SAMSUNG</span>
              <span class="offer">Hurry Limited Stock</span>
            </div>
            <div class="product-name">Samsung Galaxy S23 Plus 5G</div>
            <div class="product-price">&#163;880.00</div>
          </div>
          <div class="section-2">
            <div class="sim-info">
              <label for="" class="name">Sim:</label>
              <span>DUAL SIM</span>
            </div>
            <div class="condition-info">
              <label for="" class="name">Condition:</label>
              <span>LIKE NEW</span>
            </div>
            <div class="colour-info">
              <label for="" class="name">Colour:</label>
              <span>LAVENDAR</span>
            </div>
            <div class="network-info">
              <label for="" class="name">Network:</label>
              <span>UNLOCKED</span>
            </div>
            <div class="storage-info">
              <label for="" class="name">Storage:</label>
              <span>512 GB</span>
            </div>
          </div>
          <div class="section-3">
            <div class="modify-quantity">
              <span class="decrease">-</span>
              <span class="quantity">1</span>
              <span class="increase">+</span>
            </div>
            <div class="add-to-basket">
              <Button class="add-button">Add to Basket</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
    height: 100%;
    width: 100%;
    justify-content: center;
    .product-page-container {
      display: flex;
      height: 50vh;
      width: 100%;
      @media (max-width: 440px) {
        flex-direction: column;
        height: calc(100% - 100px);
        overflow-y: auto;
      }
      .image-carousel-container {
        width: 40%;
        height: 100%;
        padding: 0px 30px;
        @media (max-width: 440px) {
          width: 100%;
          padding: 0px 0px 40px 0px;
        }

        .carousel-section {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          padding: 10px 0px;
          background-color: white;
          @media (max-width: 440px) {
            height: 400px;
          }

          .thumbnails-section {
            display: flex;
            flex-direction: column;
            padding: 10px;
            justify-content: flex-start;
            height: 100%;
            .thumbnail-images {
              border: 2px solid transparent;
              border-radius: 4px;
              padding: 4px;
              box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
            }

            .thumbnail-images:hover {
              border: 2px solid black;
              cursor: pointer;
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

          .left-move:hover,
          .right-move:hover {
            cursor: pointer;
          }

          .image-container {
            display: flex;
            justify-content: center;
            width: 100%;
            height: 100%;
            .images {
              display: flex;
              align-items: center;
              justify-content: center;
              img {
                height: 100%;
                width: auto;
              }
            }
          }
        }
        .scroll-display {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 20px;
          margin-top: 10px;

          .images-dot {
            display: flex;
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
        width: 60%;
        height: 100%;
        padding: 0px 30px;
        @media (max-width: 440px) {
          width: 100%;
          padding: 0px;
        }

        .section-1 {
          padding-top: 0px;
          .product-manufacturer {
            display: flex;
            justify-content: space-between;

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
            display: flex;
            align-items: center;
            margin: 10px 0px;
            @media (max-width: 440px) {
              justify-content: center;
            }

            span.decrease,
            span.increase {
              font-size: 24px;
              display: flex;
              align-items: center;
              font-weight: bold;
            }

            .quantity {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 10%;
              background-color: #eeeeee;
              height: 40px;
              margin: 0px 10px;
            }
          }
          .add-to-basket {
            display: flex;
            justify-content: center;

            .add-button {
              padding: 10px;
              width: 100%;
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
