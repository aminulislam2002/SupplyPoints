import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState } from "react";
import "./TopSlider.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Link } from "react-router";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Loader from "../../../../components/Loader/Loader";
import { motion } from "framer-motion";
import usePlatform from "../../../../hooks/usePlatform/usePlatform";

const TopSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const axiosPublic = useAxiosPublic();
  const { platform } = usePlatform();

  const { isPending, data: sliders = [] } = useQuery({
    queryKey: ["allSliders"],
    queryFn: async () => {
      const res = await axiosPublic.get("/sliders");
      return res?.data && res?.data?.data;
    },

    placeholderData: keepPreviousData,
  });

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
    },
    [
      (slider) => {
        let timeout;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 3000);
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ],
  );

  if (isPending && sliders.length === 0) {
    return <Loader></Loader>;
  }

  return (
    <div className="w-full py-5 lg:py-10">
      {/* Slider */}
      <div className="navigation-wrapper">
        {sliders?.length > 0 ? (
          <div ref={sliderRef} className="keen-slider">
            {sliders?.map((slider) => (
              <Link
                to={slider?.url || "/"}
                key={slider?._id}
                className="keen-slider__slide"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 5, ease: "easeInOut" }}
                  className="w-full h-full"
                >
                  <LazyLoadImage
                    width={`100%`}
                    src={import.meta.env.VITE_IMAGE_URL + slider?.image}
                    effect="blur"
                    alt={`Slider Image ${slider?._id}`}
                    className="w-full h-full object-cover bg-center slider-image"
                  />
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div>
            <p className="font-primary text-[15px] font-medium text-center">
              We are sorry, but there are no images available at the moment!
            </p>
          </div>
        )}

        {loaded && instanceRef.current && (
          <>
            <Arrow
              left
              onClick={(e) =>
                e.stopPropagation() || instanceRef.current?.prev()
              }
              disabled={currentSlide === 0}
            />

            <Arrow
              onClick={(e) =>
                e.stopPropagation() || instanceRef.current?.next()
              }
              disabled={
                currentSlide ===
                instanceRef.current.track.details.slides.length - 1
              }
            />
          </>
        )}
        {loaded && instanceRef.current && (
          <div className="dots">
            {[
              ...Array(instanceRef.current.track.details.slides.length).keys(),
            ].map((idx) => {
              return (
                <button
                  key={idx}
                  onClick={() => {
                    instanceRef.current?.moveToIdx(idx);
                  }}
                  className={"dot" + (currentSlide === idx ? " active" : "")}
                ></button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopSlider;

function Arrow(props) {
  const disabled = props.disabled ? " arrow--disabled" : "";
  return (
    <svg
      onClick={props.onClick}
      className={`arrow ${
        props.left ? "arrow--left" : "arrow--right"
      } ${disabled}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      )}
      {!props.left && (
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      )}
    </svg>
  );
}
