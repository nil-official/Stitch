import { PRODUCT_ROUTES } from "../routes/routePaths";

/**
 * Generates a clean, SEO-friendly slug from any text
 * Example: "Apple iPhone 15 128 GB" → "apple-iphone-15-128-gb"
 */
export const createSlug = (text) => {
    if (!text) return "";
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
};

/**
 * Generates a full product detail URL based on the product object.
 * Example output: "/product/apple-iphone-15-128-gb/p/606"
 */
export const getProductUrl = (product) => {
    if (!product) return "#";
    const { id, title, brand } = product;
    const slug = createSlug(`${brand || ""}-${title || ""}`);
    return PRODUCT_ROUTES.DETAILS(slug, id);
};

/**
 * Returns a CSS class based on the product's average rating.
 * - Green for ratings 4.0 and above
 * - Yellow for ratings between 2.5 and 4.0
 * - Red for ratings below 2.5
*/
export const getRatingColor = (rating) => {
    if (rating >= 4.0) return "bg-green-500";
    if (rating >= 2.5) return "bg-yellow-500";
    return "bg-red-500";
};