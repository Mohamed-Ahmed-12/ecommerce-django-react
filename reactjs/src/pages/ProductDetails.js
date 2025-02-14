import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Error404 from "./Error404";
import axiosInstance from "../components/axiosInstance";
import { useCart } from "../components/context/CartContext";
import ReviewSection from "../components/ReviewSection";
import { ProductDetailsSkeleton } from '../components/Loader';
import Stars from "../components/Stars";

function ProductDetails() {
    const params = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const imgRef = useRef();
    const { addCartItem } = useCart();
    const [itemQty, setItemQty] = useState(1);


    // Define the callback function
    const fetchProduct = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`viewset/products/${params.slug}/`);
            setProduct(response.data);
        } catch (error) {
            console.error("Error fetching product:", error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 100)

        }
    }, [params.slug]); // Dependencies for useCallback

    // Use the callback in useEffect
    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    useEffect(() => {
        // Cleanup function to hide the modal occurs when the modal backdrop (the dark overlay) is not properly removed when navigating away from the page containing the modal. This can happen if the modal wasn't properly dismissed before the navigation occurred.
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove(); // Remove the backdrop manually
        }

    }, []);

    const showImgInBox = (src) => {
        if (imgRef.current) {
            imgRef.current.src = src;
        }
    };

    const imgContainerRef = useRef(null);

    const handleMouseMove = (event) => {
        const container = imgContainerRef.current;
        const image = container.querySelector("img");

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        const mouseX = event.nativeEvent.offsetX;
        const mouseY = event.nativeEvent.offsetY;

        const offsetX = (mouseX / containerWidth) * 100;
        const offsetY = (mouseY / containerHeight) * 100;

        image.style.transformOrigin = `${offsetX}% ${offsetY}%`;
        image.style.transform = `scale(2)`;
    };

    const handleMouseLeave = () => {
        const image = imgContainerRef.current.querySelector("img");
        image.style.transform = "scale(1)";
        image.style.transformOrigin = "center";
    };


    if (loading) {
        return (
            <div className="container-xxl container-fluid mt-2 border">
                <ProductDetailsSkeleton />
            </div>
        )
    }

    if (!product) {
        return <Error404 />;
    }

    return (
        <div className="container-xxl container-fluid mt-2 border">
            <div className="row p-2">
                <div className="col-md-12 col-xl-6 d-flex">
                    <div className="d-flex flex-column me-2">
                        {[product.image, product.image2, product.image3].map((image, index) => (
                            <div key={index} className="mb-3">
                                <img
                                    src={image}
                                    alt={product.name}
                                    className="img-thumbnail"
                                    onClick={() => showImgInBox(image)}
                                    onMouseEnter={(e) => (e.target.style.cursor = "pointer")}
                                    style={{ height: "100px", width: "100%", objectFit: "cover" }}
                                />
                            </div>
                        ))}
                    </div>
                    <div
                        ref={imgContainerRef}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        draggable="false"
                        style={{
                            overflow: "hidden",
                            position: "relative",
                            cursor: "zoom-in",
                            width: "100%",
                        }}
                    >
                        <img
                            ref={imgRef}
                            src={product.image}
                            alt={product.name}
                            className="border img-fluid"
                            style={{
                                height: "333px",
                                width: "100%",
                                objectFit: "contain",
                                transition: "transform 0.2s ease",
                            }}
                        />
                    </div>
                </div>
                <div className="col-md-12 col-xl-6 d-flex flex-column ">
                    <h4>{product.name}</h4>
                    <div className="d-flex mt-1">
                        <h4 className="lead fw-bold me-2">${product.price}</h4>
                        {product.old_price > 0 && product.price < product.old_price ? (
                            <span className="lead text-decoration-line-through">${product.old_price}</span>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="my-2">
                        <Stars reviews={product.reviews} />
                    </div>
                    <div className="d-flex flex-column  my-2">
                        {product.price < product.old_price && (
                            <span
                                className="text-white rounded bg-danger p-1"
                                style={{ width: "fit-content" }}
                            >
                                Save {(((product.old_price - product.price) / product.old_price) * 100).toFixed(0)}%
                            </span>
                        )}
                        {product.quantity > 0 ? (
                            <div className="d-flex my-2">
                                <input
                                    className="form-control w-25 me-2"
                                    type="number"
                                    placeholder="QTY"
                                    onChange={(e) => setItemQty(e.target.value)}
                                />
                                <button
                                    className="btn btn-dark rounded-pill"
                                    onClick={() => addCartItem(product.id, itemQty)}
                                >
                                    Add To Cart
                                </button>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                    <span>
                        {product.description}
                    </span>

                </div>
            </div>

            <div className="row">
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button className="nav-link" id="details-tab" data-bs-toggle="tab" data-bs-target="#details" type="button" role="tab" aria-controls="details" aria-selected="true">Details</button>
                        <button className="nav-link active" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab" aria-controls="reviews" aria-selected="false">Reviews</button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade " id="details" role="tabpanel" aria-labelledby="details-tab">

                        <table className="table table-striped mt-3">
                            <tbody>
                                <tr>
                                    <th scope="row">Availability</th>
                                    {product.quantity > 0 ? (
                                        <td className="text-success fw-bold">{product.quantity} In stock</td>
                                    ) : (
                                        <td className="text-danger">Out of Stock</td>
                                    )}
                                </tr>
                                <tr>
                                    <th scope="row">Brand</th>
                                    <td>
                                        <img src={product.brand.img} alt={product.brand} width="auto" height="50px" />
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Part Number(OEM)</th>
                                    <td>{product.partnumber}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Compatability</th>
                                    <td>
                                        {product.compatibility.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <span>{item.name}</span>
                                                <span>{item.model_name}, </span>
                                            </React.Fragment>
                                        ))}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Condition</th>
                                    <td>{product.condition}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Category</th>
                                    <td>{product.category.name}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Description</th>
                                    <td>{product.description}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="tab-pane fade show active" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                        <ReviewSection ProductReviews={product.reviews} productId={product.id} />

                    </div>
                </div>


            </div>
        </div>
    );
}

export default memo(ProductDetails);