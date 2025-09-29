import { Rating, LinearProgress, Box, Typography } from "@mui/material";
import { FaStar } from "react-icons/fa";

const ReviewSummary = ({rating, numberRating, breakdown}) => {
  return (
    <div className="review-summary">
      <div className="rating-header">
        <span className="rating-number">{rating.toFixed(1)}</span>
        <Rating 
          name="product-rating"
          value={rating}
          precision={0.5}
          readOnly
        />
        <p className="number-rating">{numberRating} {numberRating === 1 ? "avaliação" : "avaliações"}</p>
      </div>
      <div className="breakdown">
        {Object.keys(breakdown).sort((a, b) => b - a).map((star) => (
          <Box key={star} className="breakdown-row">
            <Typography className="star-label">{star}<FaStar size={20} fill="#FAAF00"/></Typography>
            <LinearProgress 
              variant="determinate"
              value={breakdown[star]}
              className="progress"
              color="success"
            />
            <Typography className="percent">
              {breakdown[star]}%
            </Typography>
          </Box>
        ))}
      </div>
    </div>
  );
};

export default ReviewSummary