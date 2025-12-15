export default interface UserTokenInfo {
    email: string;
    firstName: string;
    lastName: string;
    roles: string[] | string | null | undefined;
    image: string;
    exp: number;
}