import React, { useMemo } from 'react'

export default function Stars({reviews}) {
    const calculateRate = useMemo(() => {
        if (!reviews?.length) return 0;
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        return totalRating / reviews.length;
    }, [reviews]);

    
    return (
        <>
            {
                Array.from(Array(5)).map((_, index) => {
                    const isHalfStar = calculateRate - index >= 0.5 && calculateRate - index < 1; // Check for half star condition
                    const isFullStar = calculateRate - index >= 1; // Check for full star condition

                    return (
                        <i
                            key={index}
                            className={`bi ${isFullStar ? 'bi-star-fill' : isHalfStar ? 'bi-star-half' : 'bi-star'
                                } me-1 text-warning`}
                        ></i>
                    );
                })
            }

            <span> {calculateRate} out of 5</span>
        </>

    )
}
