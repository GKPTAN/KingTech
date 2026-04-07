import { useState } from "react";

import { ReviewSortOrder } from "@/types/filters.ts";

import type { Comment } from "./ReviewComments.tsx";
import type { Product } from "@/types/products.ts";

import ReviewSummary from "./ReviewSummary.tsx";
import ReviewFilters from "./ReviewFilters.tsx";
import ReviewComments from "./ReviewComments.tsx";


interface ReviewsProps {
  product: Partial<Product>;
}

const Reviews = ({product}: ReviewsProps) => {
  const [filter, setFilter] = useState<ReviewSortOrder>(ReviewSortOrder.RECENT);

  const sortComments = (comments: Comment[], filter: ReviewSortOrder) => {
    const sortedComments = [...comments];

    switch (filter) {
        case ReviewSortOrder.HIGH:
            return sortedComments.sort((a, b) => b.rating - a.rating);
        case ReviewSortOrder.LOW:
            return sortedComments.sort((a, b) => a.rating - b.rating);
        case ReviewSortOrder.RECENT:
            return sortedComments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        default:
            return sortedComments;
    };
  };

  return (
    <section className="reviews" id="reviews">
      <h2>Avaliações</h2>
      <ReviewSummary
        rating={product.rating ?? 0}
        numberRating={product.numberRating ?? 0}
        breakdown={product.compositionRating ?? []}
      />
      <ReviewFilters onFilterChange={setFilter}/>
      <ReviewComments comments={sortComments(product.reviewComments ?? [], filter)} />
    </section>
  );
};

export default Reviews;
