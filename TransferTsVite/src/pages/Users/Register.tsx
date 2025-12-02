import React, { useState } from "react";
import axios from "axios";
import ENV from "../../env/index";
import {useNavigate} from "react-router-dom";

const Register: React.FC = () => {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const navigate = useNavigate();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setPhoto(file ?? null);

        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("password", password);

        if (photo) {
            formData.append("image", photo);
        }

        try {
            const res = await axios.post(
                ENV.API_BASE_URL + "/api/entity/register",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            console.log("Registered:", res.data);
            alert("Registration successful!");
        } catch (err) {
            console.error("Error:", err);
            alert("Registration failed");
        }
        navigate("/");
    };

    return (
        <div className="h-screen w-full bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-lg space-y-4 rounded-lg border border-gray-300 bg-gray-100 p-6"
            >
                {/* FIRST NAME */}
                <div>
                    <label className="block text-sm font-medium text-gray-900">
                        First Name
                    </label>
                    <input
                        className="mt-1 w-full rounded-lg border-gray-300"
                        type="text"
                        placeholder="Your first name"
                        value={firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFirstName(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-900">
                        Last Name
                    </label>
                    <input
                        className="mt-1 w-full rounded-lg border-gray-300"
                        type="text"
                        placeholder="Your last name"
                        value={lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setLastName(e.target.value)
                        }
                    />
                </div>

                {/* EMAIL */}
                <div>
                    <label className="block text-sm font-medium text-gray-900">
                        Email
                    </label>
                    <input
                        className="mt-1 w-full rounded-lg border-gray-300"
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                        }
                    />
                </div>

                {/* PASSWORD */}
                <div>
                    <label className="block text-sm font-medium text-gray-900">
                        Password
                    </label>
                    <input
                        className="mt-1 w-full rounded-lg border-gray-300"
                        type="password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setPassword(e.target.value)
                        }
                    />
                </div>

                {/* PHOTO */}
                <div>
                    <label className="block text-sm font-medium text-gray-900">
                        Photo
                    </label>
                    <input
                        className="mt-1 w-full rounded-lg border-gray-300"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="mt-3 h-24 w-24 rounded-lg object-cover border"
                        />
                    )}
                </div>

                {/* SUBMIT BUTTON */}
                <button
                    className="block w-full rounded-lg border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-indigo-600"
                    type="submit"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
