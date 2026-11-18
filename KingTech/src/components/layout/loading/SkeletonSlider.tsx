import { Skeleton } from "@mui/material";

import "@/style/components/layout/loadingPage/SkeletonSlider.css";

interface SkeletonSliderProps {
    slidesNumber: number;
    landscape?: boolean;
}

const SkeletonSlider = ({slidesNumber, landscape}: SkeletonSliderProps) => {
  return (
    <div className={`skeleton_slider ${landscape ? 'landscape' : ''}`}>
        <Skeleton variant="rectangular" height={70}/>
        <div className="slider_cards_fallback">
            {!landscape ?(
                <>
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
                </>
            ): (
                <>
                    {Array.from({ length: slidesNumber }, (_, index) => (
                        <Skeleton 
                            variant="rectangular" 
                            key={index}
                            sx={{
                                flex: "1 1 0",
                                minWidth: 0,
                                maxWidth: 514,
                                height: 165,
                            }}
                        />
                    ))}
                </>
            )}
            
        </div>
    </div>
  )
}

export default SkeletonSlider