import { useWidthWindow } from "../../hooks/useWindowWidth";
import { RiHeartLine, RiHeartFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Button from "./Button";
import "../../style/components/layout/HeartFavorite.css";

const HeartFavorite = () => {
  const location = useLocation();
  const isFavoritesPage = location.pathname === "/favorites";
  const [animate, setAnimate] = useState(false);
  const [isFavorite, setIsFavorite] = useState(isFavoritesPage);

  let widthWindow = useWidthWindow();

  let mediaQuery = 30;

  if (widthWindow <= 650) {
    mediaQuery = 25;
  }

  useEffect(() => {
    if (isFavoritesPage) {
      setIsFavorite(true);
    }
  }, [isFavoritesPage]);

  const handleClick = () => {
    if (isFavoritesPage) return;
    setAnimate(true);
    if (isFavorite) {
      setAnimate(false);
      setIsFavorite(false);
    } else {
      setTimeout(() => setAnimate(false), 700);
      setIsFavorite(true);
    }
  };

  return (
    <div className={`heart_bubbly_wrapper ${animate ? "animate" : ""}`}>
        <Button
            type="button"
            nameAction={isFavorite ? <RiHeartFill size={mediaQuery} /> : <RiHeartLine size={mediaQuery} />}
            className={`heart_bubbly ${isFavorite ? 'favorite' : ''}`}
            disabled={false}
            onClick={handleClick}
        />
        {animate && (
            <>
                <span className="bubble bubble1"><RiHeartFill color="red" size={30} /></span>
                <span className="bubble bubble2"><RiHeartFill color="red" size={30} /></span>
                <span className="bubble bubble3"><RiHeartFill color="red" size={30} /></span>
                <span className="bubble bubble4"><RiHeartFill color="red" size={30} /></span>
                <span className="bubble bubble5"><RiHeartFill color="red" size={30} /></span>
            </>
        )}
    </div>
  );
};

export default HeartFavorite;
