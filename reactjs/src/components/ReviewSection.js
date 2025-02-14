import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import { ReviewProductSkelton } from "./Loader";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min"; // Ensure Bootstrap JS is imported

const handleDateTime = (isoString) => {
  const date = new Date(isoString);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} | ${date.getHours()}:${date.getMinutes()}`;
};

export default function ReviewSection({ ProductReviews, productId }) {
  const [reviews, setReviews] = useState(ProductReviews || []);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reviews) {
      setLoading(false);
      setReviews(reviews);
    }
  }, [reviews]);

  const closeModal = () => {
    const modalElement = document.getElementById("AddReviewModal");
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide(); // Hide the modal
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0 || comment === "") {
      toast.error("Please provide a rating and a comment.");
      return;
    }
    try {
      const response = await axiosInstance.post(
        `reviews/add/${productId}/`,
        {
          comment: comment,
          rating: rating,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      );

      setReviews([...reviews, response.data]);
      toast.success("Thanks for your feedback");
      closeModal(); // Close the modal after successful submission
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error(err);
    } finally {
      setComment("");
      setRating(0);
      setLoading(false);
    }
  };

  if (loading) {
    return <ReviewProductSkelton />;
  }

  return (
    <div className="row mt-2">
      <div className="col-12 col-md-8 my-2" id="reviews-col">
        {reviews.length > 0 ? (
          <ul className="list-group list-group-flush">
            {reviews.map((review, index) => (
              <li key={index} className="list-group-item">
                <div className="d-flex align-items-top justify-content-between mb-0 ">
                  <div className="d-flex">
                    <div className="">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzIdr7HcfjPdwSAGPtaGRxlaM7d-PaAJdX9Q&s"
                        width={"45px"}
                        className="rounded-circle border border-2"
                      />
                    </div>
                    <div className="d-flex flex-column ms-3">
                      <p className="text-primary mb-0">{review.user.username}</p>
                      <div className="d-flex">
                        {[...Array(5)].map((_, index) => (
                          <i
                            key={index}
                            className={`text-warning bi ${
                              index < review.rating ? "bi-star-fill" : "bi-star"
                            }`}
                          ></i>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span>{handleDateTime(review.created_at)}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="" style={{ fontFamily: "serif" }}>
                    {review.review}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="">
            <h6 className="alert alert-danger">No reviews yet</h6>
          </div>
        )}
      </div>

      <div className="col-12 col-md-4 border-start" id="add-review-col">
        <div className="d-flex flex-column p-4">
          <h3>Review this product</h3>
          <p>Share your thoughts with other customers</p>
          <button
            type="button"
            className="btn btn-dark rounded-pill mb-2"
            data-bs-toggle="modal"
            data-bs-target="#AddReviewModal"
          >
            Add Review
          </button>
        </div>

        <div
          className="modal fade"
          id="AddReviewModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  New Review
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={handleSubmitReview}
                  className="bg-light p-3 rounded shadow-sm"
                >
                  <div className="mb-3">
                    <label htmlFor="rating" className="form-label">
                      Rating:
                    </label>
                    <select
                      id="rating"
                      name="rating"
                      className="form-select"
                      onChange={(e) => setRating(e.target.value)}
                      required
                    >
                      <option value="0">Select rating</option>
                      {[...Array(5)].map((_, index) => (
                        <option key={index + 1} value={index + 1}>
                          {index + 1} Star{index > 0 && "s"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="review" className="form-label">
                      Review:
                    </label>
                    <textarea
                      id="review"
                      name="review"
                      className="form-control"
                      rows="3"
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write your review here..."
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Save Review
                  </button>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
