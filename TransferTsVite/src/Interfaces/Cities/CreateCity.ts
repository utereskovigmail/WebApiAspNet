export interface CreateCity{
    name: string;
    slug: string;
    description: string;
    countryId: number;
    image: File | null;
}