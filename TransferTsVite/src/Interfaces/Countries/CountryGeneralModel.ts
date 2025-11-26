export interface CountryGeneralModel {
    id: number;
    name: string;
    code: string;
    slug: string;
    description: string;
    shortDescription: string;
    tags: string[];
    imageStr: string | null;
    image: File | null;
}