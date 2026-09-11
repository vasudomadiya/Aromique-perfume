const API_URL = process.env.REACT_APP_API_URL || "/api";

export const getProductById = async (id) => {
    if (!id || id === "undefined" || id === "null") {
        throw new Error("A valid product ID is required");
    }

    return apiRequest(`/products/${encodeURIComponent(id)}`);
};

export const apiRequest = async (path, options = {}) => {
    if (!path || path.includes("undefined") || path.includes("null")) {
        throw new Error("Invalid API path");
    }

    let userInfo = null;
    try {
        userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
    } catch {
        localStorage.removeItem("userInfo");
    }
    const headers = { ...(options.headers || {}) };

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (userInfo?.token) headers.Authorization = `Bearer ${userInfo.token}`;

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) throw new Error(data.message || "Something went wrong");
    return data;
};

export { API_URL };