import { BiSolidUserCheck } from "react-icons/bi";
import Rating from "@mui/material/Rating";

const ReviewComments = ({comments}) => {
  return (
    <article className="comments-wrapper">
      {comments.map(({ id, name, date, verified, rating, comment}) => (
        <div className="comment-card" key={id}>
          <div className="comment-header">
            <span className="name">{name}</span>
            {verified && (
              <span className="verified">
                <BiSolidUserCheck size={20}/> Cliente verificado
              </span>
            )}
            <span className="date">{date}</span>
          </div>
          <Rating value={rating} precision={0.5} readOnly size="small" />
          <p className="comment-text">{comment}</p>
        </div>
      ))}
    </article>
  )
}

export default ReviewComments