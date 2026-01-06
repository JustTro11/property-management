export interface Property {
    id: string;
    created_at?: string;
    title: string;
    description: string;
    price: number;
    address: string;
    image_url: string;
    images: string[];
    sqft: number;
    bedrooms: number;
    bathrooms: number;
    status: 'available' | 'rented' | 'maintenance';
}
