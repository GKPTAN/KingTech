import { useState } from "react";
import type { Comment } from "./ReviewComments.tsx";
import ReviewSummary from "./ReviewSummary.tsx";
import ReviewFilters from "./ReviewFilters.tsx";
import ReviewComments from "./ReviewComments.tsx";

interface ReviewsProps {
  product: {
    rating: number;
    numberRating: number;
    compositionRating: {
      [key: number]: number;
    };
    reviewComments: Comment[];
  }
}

const Reviews = ({product}: ReviewsProps) => {
  const [filter, setFilter] = useState("recent");

  const sortComments = (comments, filter) => {
    switch (filter) {
        case "high":
            return [...comments].sort((a, b) => b.rating - a.rating);
        case "low":
            return [...comments].sort((a, b) => a.rating - b.rating);
        case "recent":
            return [...comments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        default:
            return comments;
    };
  };

  return (
    <section className="reviews" id="reviews">
      <h2>Avaliações</h2>
      <ReviewSummary
        rating={product.rating}
        numberRating={product.numberRating}
        breakdown={product.compositionRating}
      />
      <ReviewFilters onFilterChange={setFilter}/>
      <ReviewComments comments={sortComments(product.reviewComments, filter)} />
    </section>
  );
};

export default Reviews;
