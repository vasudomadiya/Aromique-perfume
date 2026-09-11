import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { apiRequest } from "../utils/api";
import { useSearchParams } from "react-router-dom";
import "../style/commerce.css";

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState(() => searchParams.get("category") || "all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        apiRequest("/products")
            .then(setProducts)
            .catch((requestError) => setError(requestError.message))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setCategory(searchParams.get("category") || "all");
    }, [searchParams]);

    const selectCategory = (nextCategory) => {
        setCategory(nextCategory);
        if (nextCategory === "all") {
            setSearchParams({});
        } else {
            setSearchParams({ category: nextCategory });
        }
    };

    const categories = ["all", ...new Set(products.map((product) => product.category).filter(Boolean))];
    const normalizedQuery = query.trim().toLowerCase();
    const visibleProducts = products.filter((product) => {
        const searchableText = [product.name, product.description, product.category]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
        const matchesQuery = searchableText.includes(normalizedQuery);
        return matchesQuery && (category === "all" || product.category === category);
    });

    const categoryLabel = category === "all" ? "Everything" : category;
    const categoryDescription = category === "Accessories"
        ? "The finishing touches that make every setup feel more considered."
        : category === "Electronics"
            ? "Smart, useful tech for work, play, and the everyday in between."
            : "Thoughtful products, clear prices, and a checkout that stays out of your way.";

    return (
        <main className="commerce-page">
            <div className="commerce-hero">
                <span className="commerce-kicker">THE AROMIQUE EDIT / {categoryLabel.toUpperCase()}</span>
                <h1>{categoryLabel}</h1>
                <p>{categoryDescription}</p>
            </div>
            <section className="commerce-content">
                <div className="shop-toolbar">
                    <label className="shop-search-wrap">
                        <span className="sr-only">Search products</span>
                        <input className="shop-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" />
                    </label>
                    <div className="shop-results" aria-live="polite">{loading ? "Loading" : `${visibleProducts.length} ${visibleProducts.length === 1 ? "item" : "items"}`}</div>
                </div>
                <div className="category-tabs" aria-label="Shop categories">
                    {categories.map((item) => (
                        <button className={category === item ? "active" : ""} key={item} onClick={() => selectCategory(item)} aria-pressed={category === item}>
                            {item === "all" ? "Everything" : item}
                            <span>{item === "all" ? products.length : products.filter((product) => product.category === item).length}</span>
                        </button>
                    ))}
                </div>
                {loading && <p className="commerce-message">Loading the collection...</p>}
                {error && <p className="commerce-error">{error}</p>}
                {!loading && !error && <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product._id} product={product} />)}</div>}
                {!loading && !error && visibleProducts.length === 0 && <p className="commerce-message">No products match that search.</p>}
            </section>
        </main>
    );
};

export default Shop;
