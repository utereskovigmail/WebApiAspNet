export interface CityItemModel {
    id: number;
    name: string;
    slug: string;
    country: string;
    description?: string | null;
    image?: string | null;
}
