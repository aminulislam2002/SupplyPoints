import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { MdArrowForwardIos, MdOutlineArrowBackIosNew } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useEffect, useState } from "react";

const ProductImageSliderOne = ({ product }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [sliderRefOne, slider1] = useKeenSlider({
    loop: true,
    mode: "free-snap",
    slides: { perView: 1, spacing: 0 },
    slideChanged: (slider) => {
      setCurrentIndex(slider.track.details.rel);
    },
    renderMode: "performance",
  });

  const [sliderRefTwo, slider2] = useKeenSlider({
    loop: true,
    mode: "free-snap",
    breakpoints: {
      "(min-width: 300px)": {
        slides: { perView: 4, spacing: 5 },
      },
      "(min-width: 601px)": {
        slides: { perView: 4, spacing: 10 },
      },
      "(min-width: 1280px)": {
        slides: { perView: 4, spacing: 10 },
      },
      "(min-width: 1536px)": {
        slides: { perView: 4, spacing: 10 },
      },
    },
  });

  // Combine thumbnail and photos into a single array
  const images = product ? [product.thumbnail, ...(product.photos || [])] : [];

  useEffect(() => {
    if (
      images?.length > 0 &&
      slider1.current &&
      currentIndex !== slider1.current.track.details.rel
    ) {
      slider1.current.moveToIdx(currentIndex);
    }
  }, [currentIndex, images, slider1]);

  const handleImageSelect = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full h-full relative">
      <div className="relative">
        {images?.length > 0 ? (
          <div ref={sliderRefOne} className="keen-slider w-full">
            {images.map((image, index) => (
              <div key={index} className="keen-slider__slide w-full">
                <LazyLoadImage
                  src={import.meta.env.VITE_IMAGE_URL + image}
                  alt={product?.name}
                  width={`100%`}
                  effect="blur"
                  className="aspect-square w-full rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="body-copy text-center">
            We are sorry, but there are no image!
          </p>
        )}

        <div>
          <button
            onClick={() => slider1.current?.prev()}
            className="absolute left-0 top-[48%] flex h-10 w-9 items-center justify-center rounded-r-lg bg-secondary-900/70 text-white opacity-80 transition-colors hover:bg-primary-700"
          >
            <MdOutlineArrowBackIosNew size={20} />
          </button>

          <button
            onClick={() => slider1.current?.next()}
            className="absolute right-0 top-[48%] flex h-10 w-9 items-center justify-center rounded-l-lg bg-secondary-900/70 text-white opacity-80 transition-colors hover:bg-primary-700"
          >
            <MdArrowForwardIos size={20} />
          </button>
        </div>

        {/* Product Code */}
        <div className="absolute left-3 top-3 z-20 rounded-md bg-secondary-900/80 px-2 py-1 text-xs font-semibold text-white">
          Code: {product?.productCode}
        </div>
      </div>

      <div className="relative mt-[5px] lg:mt-2.5">
        {images?.length > 0 ? (
          <div ref={sliderRefTwo} className="keen-slider w-full">
            {images.map((image, index) => (
              <div key={index} className="keen-slider__slide w-full">
                <LazyLoadImage
                  src={import.meta.env.VITE_IMAGE_URL + image}
                  alt={product?.name}
                  width={`100%`}
                  effect="blur"
                  className={
                    currentIndex === index
                      ? "aspect-square w-full cursor-pointer rounded-md border-2 border-primary-500 object-cover"
                      : "aspect-square w-full cursor-pointer rounded-md border-2 border-transparent object-cover"
                  }
                  onClick={() => handleImageSelect(index)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p>We are sorry, but there are no image!</p>
          </div>
        )}

        {images?.length > 4 && (
          <div>
            <button
              onClick={() => slider2.current?.prev()}
              className="absolute top-[40%] left-0 py-1 px-0.5 bg-primary-700 opacity-50 transition-colors duration-300 cursor-pointer rounded-r"
            >
              <MdOutlineArrowBackIosNew size={20} />
            </button>

            <button
              onClick={() => slider2.current?.next()}
              className="absolute top-[40%] right-0 py-1 px-0.5 bg-primary-700 opacity-50 transition-colors duration-300 cursor-pointer rounded-l"
            >
              <MdArrowForwardIos size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageSliderOne;
