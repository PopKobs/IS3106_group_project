import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewOwnReviews = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        // Fetch reviews for the vendor's store
        const fetchReviews = async () => {
            try {
                const response = await axios.get('/api/reviews');
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, []);

    return (
        <div>
            <h1>My Store Reviews</h1>
            {reviews.length === 0 ? (
                <p>No reviews found.</p>
            ) : (
                <ul>
                    {reviews.map((review) => (
                        <li key={review.id}>
                            <p>Rating: {review.rating}</p>
                            <p>Comment: {review.comment}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewOwnReviews;