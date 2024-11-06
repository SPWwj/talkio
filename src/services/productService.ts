import { ProductModel } from "@/types/productModel";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;

console.log("API Base URL:", API_BASE_URL);

export class ProductService {
    async getProductById(id: string): Promise<ProductModel> {
        try {
            const response = await fetch(`${API_BASE_URL}/product/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const product: ProductModel = await response.json();
            return product;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }

    // You can add more methods here as needed, such as:
    // - createProduct
    // - updateProduct
    // - deleteProduct
    // - getAllProducts
}