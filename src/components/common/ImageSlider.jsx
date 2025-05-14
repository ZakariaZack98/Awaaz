import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = ({ imgUrlArray = ['https://images.ctfassets.net/7mmwp5vb96tc/82025/9b855abd4e17b3e674065fe3928972a3/hjorundfjord-norway-hgr-141715_1920-photo_fabrice_milochau.jpg?q=40&w=3840&fm=webp', 'https://cdn.britannica.com/40/59040-050-BEAE1332/fjords-North-Sea-coast-Norway.jpg', 'https://upload.wikimedia.org/wikipedia/commons/7/78/Geirangerfjord_%286-2007%29.jpg'] }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    appendDots: (dots) => (
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "10px",
          padding: "10px",
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
        }}>
        <ul style={{ margin: "0px" }}>{dots}</ul>
      </div>
    ),
    prevArrow: (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          fontSize: "20px",
          cursor: "pointer",
          color: "white",
        }}>
        <i className="fas fa-chevron-left" />
      </div>
    ),
    nextArrow: (
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          fontSize: "20px",
          cursor: "pointer",
          color: "white",
        }}>
        <i className="fas fa-chevron-right" />
      </div>
    ),
  };

  return (
    <>
      {imgUrlArray && imgUrlArray.length > 0 && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}>
          <Slider {...settings} className="border border-[rgba(0,0,0,0.1)] rounded-md" style={{ maxHeight: "500px"}}>
            {imgUrlArray?.map((url) => (
              <div className="w-full h-125 overflow-hidden">
                <img src={url} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </>
  );
};

export default ImageSlider;
