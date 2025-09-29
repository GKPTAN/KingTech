import { useState } from "react";
import ReviewSummary from "./ReviewSummary";
import ReviewFilters from "./ReviewFilters";
import ReviewComments from "./ReviewComments";

const Reviews = ({product}) => {
  const [filter, setFilter] = useState("recent");

  const sortComments = (comments, filter) => {
    switch (filter) {
        case "high":
            return [...comments].sort((a, b) => b.rating - a.rating);
        case "low":
            return [...comments].sort((a, b) => a.rating - b.rating);
        case "recent":
            return [...comments].sort((a, b) => new Date(b.date) - new Date(a.date));
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
