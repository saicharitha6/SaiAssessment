import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, searchQuery } from '../redux/productSlice';

function Products() {
    const [search, setSearch] = useState('');
    const [showPopup, setShowPopup] = useState(false); // State to manage pop-up visibility
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleSearch = (event) => {
        const { value } = event.target;
        setSearch(value);
        dispatch(searchQuery(value));
    };

    const handlePurchase = async (productData) => {
        try {
            const response = await fetch('http://localhost:3000/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                setShowPopup(true); // Show pop-up on successful purchase

                // Hide the pop-up after 1 second
                setTimeout(() => {
                    setShowPopup(false);
                }, 1000);
            }
        } catch (error) {
            console.error(`An error occurred: ${error}`);
        }
    };

    return (
        <div>
            {/* Pop-up message */}
            {showPopup && (
                <div className="popup">
                    <p>Item purchased successfully!</p>
                    <button onClick={() => setShowPopup(false)}>Close</button>
                </div>
            )}

            <div className="search">
                <input
                    className="input"
                    type="text"
                    onChange={handleSearch}
                    placeholder="Search Products by title, category"
                    value={search}
                />
            </div>
            <div className="products-container">
                <div className="products-grid">
                    {products
                        .filter((product) => {
                            if (search === '') {
                                return product;
                            }
                            if (
                                product.title.toLowerCase().includes(search.toLowerCase()) ||
                                product.category.toLowerCase().includes(search.toLowerCase())
                            ) {
                                return product;
                            }
                            return null;
                        })
                        .map((product, index) => (
                            <div
                                className={`products-item ${index % 2 === 0 ? 'backgroundColor-1' : 'backgroundColor-2'}`}
                                key={product.id}
                            >
                                <img src={product.thumbnail} alt="" />
                                <h3>{product.title}</h3>

                                <p style={{ marginTop: 5 }}>Category: {product.category}</p>
                                <p style={{ marginTop: 5 }}>Price: ${product.price}</p>
                                <br />

                                <div className="button">
                                    <button
                                        type="submit"
                                        style={{ cursor: 'pointer' }}
                                        title="Purchase"
                                        onClick={() =>
                                            handlePurchase({
                                                productId: product.id,
                                                title: product.title,
                                                price: product.price,
                                                category: product.category,
                                            })
                                        }
                                    >
                                        PURCHASE
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default Products;
