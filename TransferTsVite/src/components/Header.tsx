import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="p-4 bg-blue-600 text-white">
            <nav className="flex justify-between gap-4">
                <div className={"flex justify-start gap-4"}>
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/createCountry" className="hover:underline">Create country</Link>
                    <Link to="/createCity" className="hover:underline">Create city</Link>
                    <Link to="/about" className="hover:underline">About</Link>
                </div>
                <div className={"flex justify-start gap-4"}>
                    <Link to="/user/register" className="hover:underline">Register</Link>
                    <Link to="/user/login" className="hover:underline">Log in</Link>
                </div>
            </nav>
        </header>
    );
}
