export default interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
    roles: string[];
}