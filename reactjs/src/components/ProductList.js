import React, { useEffect, useState, memo } from 'react';
import ProductGallary from "../components/ProductGallary";
import { Link } from 'react-router-dom';
import { useCart } from './context/CartContext';
import axiosInstance from "../components/axiosInstance";
import Spinner from './Spinner';
import { ProductListSkeleton } from './Loader';
// Importing AOS
import AOS from 'aos';
import 'aos/dist/aos.css';
import { toast } from 'react-toastify';
import Stars from './Stars';

function ProductList({ filters }) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const { addCartItem } = useCart();
    const [productsView, setProductsView] = useState('grid');
    const [searchStr, setSearchStr] = useState('');
    const [offset, setOffset] = useState(2);
    const [hasMore, setHasMore] = useState(true);
    // Fetch all products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get("viewset/products/");
                console.log(response.data);
                setProducts(response.data.results);
                setFilteredProducts(response.data.results);
                setError(null); // Reset error state on success
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to fetch products. Please try again later.");
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 200)
            }
        };
        fetchProducts();
        AOS.init(); // Initialize AOS on mount
    }, []);

    // Refresh AOS when filteredProducts or productsView changes
    useEffect(() => {
        AOS.refreshHard(); // Force AOS to reinitialize
    }, [filteredProducts, productsView]);

    // Apply filters whenever `filters` or `products` change
    useEffect(() => {
        const applyFilters = () => {
            let filtered = [...products]; // Start with all products

            // Apply condition filter
            if (filters?.condition?.length > 0) {
                filtered = filtered.filter((product) =>
                    filters.condition.some((condition) => product.condition.toLowerCase() === condition.toLowerCase())
                );
            }

            // Apply category filter
            if (filters?.category?.length > 0) {
                filtered = filtered.filter((product) =>
                    filters.category.some((category) => product.category.name.toLowerCase() === category.toLowerCase())
                );
            }

            // Apply price filter
            if (filters?.priceRange?.length > 0) {
                filtered = filtered.filter((product) =>
                    product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
                );
            }

            // Apply brand filter
            if (filters?.brand?.length > 0) {
                filtered = filtered.filter((product) =>
                    filters.brand.some((brand) => product.brand.name.toLowerCase() === brand.toLowerCase())
                );
            }

            setFilteredProducts(filtered);
        };

        applyFilters();
    }, [filters, products]);

    // Add product to cart
    const handleAddToCart = (productId) => {
        addCartItem(productId);
    };

    // Toggle between grid and list view
    const handleProductsView = (view) => {
        if (view === 'grid' || view === 'list') {
            setProductsView(view);
        }
    };

    // Search for products by name
    const productSearch = () => {
        if (searchStr !== '') {
            const searched = products.filter((product) =>
                product.name.toLowerCase().includes(searchStr.toLowerCase())
            );
            setFilteredProducts(searched);
        } else {
            setFilteredProducts(products); // Reset to all products if search is cleared
        }
    };

    const handleLoadMore = async () => {
        setLoading(true);

        try {
            const response = await axiosInstance.get(`viewset/products/?page=${offset}`);
            const newProducts = response.data.results;

            // Update products and filtered products
            setProducts((prev) => [...prev, ...newProducts]);
            setFilteredProducts((prev) => [...prev, ...newProducts]);

            // Update offset and "hasMore" state
            setOffset((prev) => prev + 1); // Assuming page increments by 1
            if (response.data.next == null) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

        } catch (error) {
            console.error("Error loading more products:", error);
            toast.error("Failed to load more products. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    // Highlight matched string in product name
    const highlightText = (text, query) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi'); // Create a case-insensitive regular expression for the query.
        return text.replace(regex, (match) => `<span class="bg-warning">${match}</span>`);
    };

    if (loading) {
        return (
            <div className="mt-2">
                <ProductListSkeleton />
            </div>
        );
    }
    return (
        <>
            {error && <div className="alert alert-danger">{error}</div>}
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center">
                <h3 style={{ fontFamily: "fantasy" }}>Store</h3>

                <div className="input-group mx-1">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        aria-label="Search"
                        value={searchStr}
                        onChange={(e) => setSearchStr(e.target.value)}
                        required={true}
                    />
                    <button className="btn text-white" style={{backgroundColor:"#ff6c2f"}} type="button" onClick={productSearch}>
                        <i className="bi bi-search"></i>
                    </button>
                </div>
                <button
                    onClick={() => handleProductsView('grid')}
                    className={`btn ${productsView === 'grid' ? 'btn-dark' : 'btn-outline-dark'} mx-2`}
                >
                    <i className="bi bi-grid"></i>
                </button>
                <button
                    onClick={() => handleProductsView('list')}
                    className={`btn ${productsView === 'list' ? 'btn-dark' : 'btn-outline-dark'}`}
                >
                    <i className="bi bi-list"></i>
                </button>

            </div>
            {/* Products */}
            {loading ? (
                <Spinner />
            ) : filteredProducts.length > 0 ? (
                <>
                    <div className="row mt-2">
                        {filteredProducts.map((product) =>
                            productsView === 'list' ? (
                                <div className="col-12 my-3" key={`${product.id}-${productsView}`} data-aos="zoom-in">
                                    <div className="card flex-row">
                                        <div className="col-md-3">
                                            <ProductGallary images={[product.image, product.image2, product.image3]} />
                                        </div>
                                        <div className="col-md-9">
                                            <div className="card-body">
                                                <h6 className="card-title">
                                                    <Link to={`/product/${product.slug}`} className="text-decoration-none"
                                                        dangerouslySetInnerHTML={{
                                                            __html: highlightText(product.name, searchStr),
                                                        }}

                                                    >
                                                    </Link>
                                                </h6>
                                                <p className="text-muted">
                                                    {product.description ? product.description.slice(0, 100) + '...' : 'No description available.'}
                                                </p>   
                                                <p className="lead mb-1">{product.category.name}</p>                                             
                                                <div>
                                                    <Stars reviews={product.reviews} />
                                                </div>


                                                <h5 className="h5 my-2">${product.price}</h5>

                                                {product.quantity > 0 ? (
                                                    <button
                                                        className="btn btn-primary btn-sm bi bi-cart-plus mt-2"
                                                        onClick={() => handleAddToCart(product.id)}
                                                    > Add to Cart
                                                    </button>
                                                ) : (
                                                    <h6 className="text-danger my-3">Out of Stock</h6>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="col-sm-6 col-lg-3 col-md-4 my-2" key={`${product.id}-${productsView}`} data-aos="zoom-in">
                                    <div className="card">
                                        <ProductGallary images={[product.image, product.image2, product.image3]} />
                                        <div className="card-body">
                                            <p className="lead">{product.category.name}</p>
                                            <h6 className="card-title">
                                                <Link to={`/product/${product.slug}`} className="text-decoration-none"
                                                    dangerouslySetInnerHTML={{
                                                        __html: highlightText(product.name, searchStr),
                                                    }}
                                                >
                                                </Link>
                                            </h6>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="h5 mb-0">${product.price}</span>
                                                <div>
                                                    <Stars reviews={product.reviews} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-footer d-flex justify-content-between bg-light">
                                            {product.quantity > 0 ? (
                                                <>
                                                    <button
                                                        className="btn btn-primary btn-sm bi bi-cart-plus"
                                                        onClick={() => handleAddToCart(product.id)}
                                                    > Add to Cart
                                                    </button>
                                                    <button className="btn btn-outline-secondary btn-sm">
                                                        <i className="bi bi-heart"></i>
                                                    </button>
                                                </>
                                            ) : (
                                                <h6 className="text-danger">Out of Stock</h6>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        )}


                    </div>
                    {hasMore ? (
                        <div className="row">
                            <div className="col-12 d-flex justify-content-center align-items-center my-5">
                                <button className="btn btn-dark" onClick={handleLoadMore}>
                                    Load More
                                </button>
                            </div>
                        </div>
                    ) :
                        (
                            <div className="row">
                                <div className="col-12 d-flex justify-content-center my-2">
                                    <p className="text-muted">No more products to load</p>
                                </div>
                            </div>
                        )
                    }
                </>
            ) : (
                <div className="row">
                    <div className="col-12 d-flex justify-content-center my-2">
                        <p className="text-muted">No products to display</p>
                    </div>
                </div>
            )}
        </>
    );
}


export default memo(ProductList);
