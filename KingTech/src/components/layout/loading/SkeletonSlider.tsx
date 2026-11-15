import { Skeleton } from "@mui/material";

import "@/style/components/layout/loadingPage/SkeletonSlider.css";

interface SkeletonSliderProps {
    slidesNumber: number;
}

const SkeletonSlider = ({slidesNumber}: SkeletonSliderProps) => {
  return (
    <div className="skeleton_slider">
        <Skeleton variant="rectangular" height={70}/>
        <div className="slider_cards_fallback">
            {Array.from({ length: slidesNumber }, (_, index) => (
                <Skeleton 
                    variant="rectangular" 
                    key={index}
                    sx={{
                        flex: "1 1 0",
                        minWidth: 0,
                        height: 404,
                    }}
                />
            ))}
        </div>
    </div>
  )
}

export default SkeletonSlider