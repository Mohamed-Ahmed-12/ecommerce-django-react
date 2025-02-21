import React, { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import axiosInstance from "../components/axiosInstance";

export default function Store() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [error, setError] = useState(null);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("viewset/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };
    const fetchBrands = async () => {
      try {
        const response = await axiosInstance.get("viewset/brands");
        setBrands(response.data);
      }
      catch (error) {
        console.error("Error fetching brands:", error);
        setError("Failed to load brands.");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
    fetchBrands();
  }, []);

  // Update filters dynamically for price range
  useEffect(() => {
    if (minPrice && maxPrice) {
      if (Number(minPrice) > Number(maxPrice)) {
        setError("Min Price should be less than Max Price!");
      } else {
        setFilters((prevFilters) => ({
          ...prevFilters,
          priceRange: [Number(minPrice), Number(maxPrice)],
        }));
        setError(null);
      }
    } else {
      setFilters((prevFilters) => {
        const { priceRange, ...rest } = prevFilters; // Remove priceRange if inputs are empty
        return rest;
      });
    }
  }, [minPrice, maxPrice]);

  // Handle checkbox filter updates
  const handleFilterChange = (event) => {
    const { name, value, checked } = event.target;
    setFilters((prevFilters) => {
      if (checked) {
        return {
          ...prevFilters,
          [name]: [...(prevFilters[name] || []), value],
        };
      } else {
        return {
          ...prevFilters,
          [name]: prevFilters[name].filter((v) => v !== value),
        };
      }
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setMinPrice("");
    setMaxPrice("");
    setError(null);
    
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-2">
          <div className="accordion my-4" id="accordionPanelsStayOpenExample">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne" >
                  <i className="bi bi-filter"></i> Filter
                </button>
              </h2>
              <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                <div className="accordion-body">
                  {/* Categories */}
                  <div className="my-2">
                    <h5 className="my-2" style={{ fontFamily: "sans-serif" }}>Categories</h5>
                    {!loading &&
                      categories.map((category) => (
                        <div key={category.id}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="category"
                            value={category.name}
                            id={category.id}
                            onChange={handleFilterChange}
                            checked={filters.category?.includes(category.name) || false}
                          />
                          <label className="form-check-label ms-3" htmlFor={category.id}>
                            {category.name}
                          </label>
                        </div>
                      ))}
                    {loading && <p>Loading categories...</p>}
                  </div>

                  {/* Conditions */}
                  <div className="my-3 border-top">
                    <h5 className="my-2" style={{ fontFamily: "sans-serif" }}>Conditions</h5>
                    {["new", "used", "imported", "copy"].map((condition) => (
                      <div key={condition}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="condition"
                          value={condition}
                          id={condition}
                          onChange={handleFilterChange}
                          checked={filters.condition?.includes(condition) || false}
                        />
                        <label className="form-check-label ms-3" htmlFor={condition}>
                          {condition.charAt(0).toUpperCase() + condition.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Brands */}
                  <div className="my-3 border-top">
                    <h5 className="my-2" style={{ fontFamily: "sans-serif" }}>Brands</h5>
                    {brands.map((brand) => (
                      <div key={brand.id}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="brand"
                          value={brand.name}
                          id={brand.name}
                          onChange={handleFilterChange}
                          checked={filters.brand?.includes(brand.name) || false}
                        />
                        <label className="form-check-label ms-3" htmlFor={brand.name}>
                          {brand.name}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Price Range */}
                  <div className="my-3 border-top">
                    <h5 className="my-2" style={{ fontFamily: "sans-serif" }}>Price Range</h5>
                    {error && <span className="text-danger">{error}</span>}
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={clearFilters}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-10">
          <div className="row my-4 p-2 border" id='products'>
            <ProductList filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
}
