export interface Country {
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