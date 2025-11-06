import { useWidthWindow } from "../../../hooks/useWindowWidth";
import {
  LiaAngleDoubleLeftSolid,
  LiaAngleDoubleRightSolid,
} from "react-icons/lia";
import { MdEdit } from "react-icons/md";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../style/components/layout/Banner.css";
import "../../../style/responsive/components/layout/Banner.responsive.css"

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        left: "10px",
        zIndex: "100" 
    }}
      onClick={onClick}
    >
      <LiaAngleDoubleLeftSolid size={40} color="#000" />
    </div>
  );
};
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        right: "10px",
        zIndex: "100" 
    }}
      onClick={onClick}
    >
      <LiaAngleDoubleRightSolid size={40} color="#000" />
    </div>
  );
};

const BannerCarrossel = ({ banners, className }) => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  let widthWindow = useWidthWindow();

  let mediaQuery = 40;

  if (widthWindow <= 768) {
    mediaQuery = 25;
  }

  if (widthWindow <= 650) {
    mediaQuery = 20;
  }

  return (
    <div className={className}>
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id} className="banner_slide_wrapper">
            <img
              src={banner.src}
              alt="banner promocional"
              className="banner_slide"
            />
          </div>
        ))}
      </Slider>
      <span className="edit-adm">
        <MdEdit fill="#000" size={mediaQuery}/>
      </span>
    </div>
  );
};

export default BannerCarrossel;
