import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../utils/api";
import "./admin.css";

const emptyProduct = { name: "", description: "", price: "", category: "", stock: "", images: [] };
const statuses = ["pending", "shipped", "delivered"];

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [productForm, setProductForm] = useState(emptyProduct);
    const [editingProductId, setEditingProductId] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const loadDashboard = async () => {
        setLoading(true);
        setError("");
        try {
            const [statsData, productsData, ordersData, usersData] = await Promise.all([
                apiRequest("/analytics"),
                apiRequest("/products"),
                apiRequest("/orders"),
                apiRequest("/auth/users"),
            ]);
            setStats(statsData);
            setProducts(productsData);
            setOrders(ordersData);
            setUsers(usersData);
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/login", { state: { from: "/admin" } });
            return;
        }
        if (user.role !== "admin") {
            navigate("/", { replace: true });
            return;
        }
        loadDashboard();
    }, [user, navigate]);

    const lowStock = useMemo(() => products.filter((product) => Number(product.stock) <= 5), [products]);

    const handleProductChange = (event) => {
        const { name, value, files } = event.target;
        setProductForm((current) => ({ ...current, [name]: files ? Array.from(files) : value }));
    };

    const saveProduct = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setNotice("");
        try {
            const body = new FormData();
            Object.entries(productForm).forEach(([key, value]) => {
                if (key === "images") {
                    value.forEach((image) => body.append("images", image));
                } else if (value !== null && value !== "") {
                    body.append(key, value);
                }
            });
            const path = editingProductId ? `/products/${editingProductId}` : "/products";
            await apiRequest(path, { method: editingProductId ? "PUT" : "POST", body });
            setProductForm(emptyProduct);
            setEditingProductId(null);
            setExistingImages([]);
            setNotice(editingProductId ? "Product updated." : "Product added to the catalog.");
            await loadDashboard();
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setSaving(false);
        }
    };

    const editProduct = (product) => {
        setEditingProductId(product._id);
        setProductForm({ name: product.name || "", description: product.description || "", price: product.price || "", category: product.category || "", stock: product.stock || "", images: [] });
        setExistingImages(Array.isArray(product.imageUrls) ? product.imageUrls : product.imageUrls ? [product.imageUrls] : []);
        setError("");
        setNotice("");
    };

    const cancelProductEdit = () => {
        setEditingProductId(null);
        setProductForm(emptyProduct);
        setExistingImages([]);
    };

    const deleteProduct = async (productId) => {
        if (!window.confirm("Remove this product from the catalog?")) return;
        try {
            await apiRequest(`/products/${productId}`, { method: "DELETE" });
            setProducts((current) => current.filter((product) => product._id !== productId));
            setNotice("Product removed.");
        } catch (requestError) {
            setError(requestError.message);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const data = await apiRequest(`/orders/${orderId}/status`, {
                method: "PUT",
                body: JSON.stringify({ status }),
            });
            setOrders((current) => current.map((order) => order._id === orderId ? { ...order, status: data.order.status } : order));
            setNotice("Order status updated.");
        } catch (requestError) {
            setError(requestError.message);
        }
    };

    if (!user || user.role !== "admin") return null;

    return (
        <main className="admin-page">
            <header className="admin-header">
                <div><span className="admin-kicker">AROMIQUE CONTROL ROOM</span><h1>Good morning, {user.name}.</h1><p>Keep the catalog, orders, and customer experience moving.</p></div>
                <div className="admin-header-actions"><button className="admin-refresh" type="button" onClick={loadDashboard} disabled={loading}>{loading ? "Refreshing..." : "Refresh data"}</button><Link className="admin-store-link" to="/shop">View storefront -&gt;</Link></div>
            </header>
            <section className="admin-layout">
                <aside className="admin-sidebar">
                    <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>Overview</button>
                    <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>Products <span>{products.length}</span></button>
                    <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>Orders <span>{orders.length}</span></button>
                    <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>Customers <span>{users.length}</span></button>
                </aside>
                <div className="admin-main">
                    {error && <div className="admin-alert error">{error}</div>}
                    {notice && <div className="admin-alert success">{notice}</div>}
                    {loading ? <div className="admin-loading">Loading dashboard data...</div> : <>
                        {activeTab === "overview" && <>
                            <div className="admin-metrics">
                                <article><span>REVENUE</span><strong>INR {Number(stats?.totalRevenue || 0).toFixed(2)}</strong><small>Across all orders</small></article>
                                <article><span>ORDERS</span><strong>{stats?.totalOrders || 0}</strong><small>All order statuses</small></article>
                                <article><span>PRODUCTS</span><strong>{stats?.totalProducts || 0}</strong><small>{lowStock.length} need attention</small></article>
                                <article><span>CUSTOMERS</span><strong>{stats?.totalUsers || 0}</strong><small>Registered shoppers</small></article>
                            </div>
                            <div className="admin-panels"><section className="admin-panel"><div className="panel-heading"><div><span className="admin-kicker">INVENTORY SIGNAL</span><h2>Low stock</h2></div><button onClick={() => setActiveTab("products")}>Manage -&gt;</button></div>{lowStock.length ? <div className="compact-list">{lowStock.map((product) => <div key={product._id}><span>{product.name}</span><strong>{product.stock} left</strong></div>)}</div> : <p className="admin-muted">Everything is comfortably stocked.</p>}</section><section className="admin-panel"><div className="panel-heading"><div><span className="admin-kicker">LATEST ACTIVITY</span><h2>Recent orders</h2></div><button onClick={() => setActiveTab("orders")}>View all -&gt;</button></div>{orders.slice(0, 5).map((order) => <div className="recent-order" key={order._id}><div><strong>#{order._id.slice(-7).toUpperCase()}</strong><small>{order.user?.name || "Customer"}</small></div><div><strong>INR {Number(order.totalAmount).toFixed(2)}</strong><span className={`admin-status ${order.status}`}>{order.status}</span></div></div>)}</section></div>
                        </>}
                        {activeTab === "products" && <section className="admin-panel"><div className="panel-heading"><div><span className="admin-kicker">CATALOG</span><h2>Products</h2></div></div><form className="product-form" onSubmit={saveProduct}><input name="name" value={productForm.name} onChange={handleProductChange} placeholder="Product name" required /><input name="category" value={productForm.category} onChange={handleProductChange} placeholder="Category" required /><input name="price" type="number" min="0" step="0.01" value={productForm.price} onChange={handleProductChange} placeholder="Price" required /><input name="stock" type="number" min="0" value={productForm.stock} onChange={handleProductChange} placeholder="Stock" required /><textarea name="description" value={productForm.description} onChange={handleProductChange} placeholder="Description" required />{existingImages.length > 0 && <div className="product-photo-preview">{existingImages.map((image) => <img key={image} src={image} alt="Current product" />)}</div>}<label className="photo-upload-button">{editingProductId ? "Change photos" : "Add product photos"}<input name="images" type="file" accept="image/*" multiple onChange={handleProductChange} /></label>{productForm.images.length > 0 && <small className="admin-muted">{productForm.images.length} photo{productForm.images.length === 1 ? "" : "s"} selected</small>}<div className="product-form-actions"><button className="admin-primary" disabled={saving}>{saving ? "Saving..." : editingProductId ? "Save product" : "Add product"}</button>{editingProductId && <button type="button" className="table-action" onClick={cancelProductEdit}>Cancel</button>}</div></form><div className="admin-table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th /></tr></thead><tbody>{products.map((product) => <tr key={product._id}><td><strong>{product.name}</strong></td><td>{product.category}</td><td>INR {Number(product.price).toFixed(2)}</td><td className={product.stock <= 5 ? "warning-text" : ""}>{product.stock}</td><td><button className="table-action" onClick={() => editProduct(product)}>Edit / change photos</button> <button className="table-action danger" onClick={() => deleteProduct(product._id)}>Remove</button></td></tr>)}</tbody></table></div></section>}
                        {activeTab === "orders" && <section className="admin-panel"><div className="panel-heading"><div><span className="admin-kicker">FULFILLMENT</span><h2>Orders</h2></div></div><div className="admin-table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order._id}><td><strong>#{order._id.slice(-7).toUpperCase()}</strong><small>{new Date(order.createdAt).toLocaleDateString()}</small></td><td>{order.user?.name || "Unknown"}<small>{order.user?.email}</small></td><td>{order.items.reduce((sum, item) => sum + item.qty, 0)}</td><td>INR {Number(order.totalAmount).toFixed(2)}</td><td><select className={`status-select ${order.status}`} value={order.status} onChange={(event) => updateOrderStatus(order._id, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div></section>}
                        {activeTab === "users" && <section className="admin-panel"><div className="panel-heading"><div><span className="admin-kicker">COMMUNITY</span><h2>Customers</h2></div></div><div className="admin-table-wrap"><table><thead><tr><th>Customer</th><th>Email</th><th>Role</th><th>Verified</th></tr></thead><tbody>{users.map((customer) => <tr key={customer._id}><td><strong>{customer.name}</strong></td><td>{customer.email}</td><td><span className="role-chip">{customer.role}</span></td><td>{customer.verified ? "Yes" : "Pending"}</td></tr>)}</tbody></table></div></section>}
                    </>}
                </div>
            </section>
        </main>
    );
};

export default AdminDashboard;
