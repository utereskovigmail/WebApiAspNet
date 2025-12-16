export default interface UserTokenInfo {
    email: string;
    firstName: string;
    lastName: string;
    roles: string[] |string | null;
    image: string;
    exp: number;
}