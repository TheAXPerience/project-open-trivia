class Carousel {
    constructor() {
        this.currentIndex = 0;
        this.elements = [];
    }

    addElement(element) {
        this.elements.push(element);
        this.applyTransform();
    }

    clearElements() {
        this.elements = [];
    }

    applyTransform() {
        for (let i = 0; i < this.elements.length; i++) {
            const item = this.elements[i];
            item.style.transform = `translateX(${(-this.currentIndex)*100}%)`;
            if (i === this.currentIndex) {
                item.style.opacity = "1";
            } else {
                item.style.opacity = "0";
            }
        }
    }

    moveRight(x) {
        this.currentIndex += x;
        while (this.currentIndex < 0) {
            this.currentIndex += this.elements.length;
        }
        this.currentIndex %= this.elements.length;
        this.applyTransform();
    }
}

const CAROUSEL_CONSTANT = new Carousel();
const IMAGE_CAROUSEL = new Carousel();

function populateCarousel() {
    const carousel = document.getElementById("carousel");
    const items = document.querySelectorAll(".carousel-txt");
    for (const item of items) {
        CAROUSEL_CONSTANT.addElement(item);
    }
}

function imageCarousel() {
    const carousel = document.getElementById("carousel2");
    const items = document.querySelectorAll(".carousel-image");
    for (const item of items) {
        IMAGE_CAROUSEL.addElement(item);
    }
}

function carouselLeft() {
    CAROUSEL_CONSTANT.moveRight(-1);
}

function carouselRight() {
    CAROUSEL_CONSTANT.moveRight(1);
}

function imageLeft() {
    IMAGE_CAROUSEL.moveRight(-1);
}

function imageRight() {
    IMAGE_CAROUSEL.moveRight(1);
}

populateCarousel();
imageCarousel();
console.log(CAROUSEL_CONSTANT)
