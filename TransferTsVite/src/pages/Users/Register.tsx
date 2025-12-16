import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Label from "../../admin/components/form/Label.tsx";
import Input from "../../admin/components/form/input/InputField.tsx";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../admin/icons";
import axios from "axios";
import ENV from "../../env";

function Register() {
    const [showPassword, setShowPassword] = useState(false);
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

        if (photo) formData.append("image", photo);

        try {
            const res = await axios.post(
                ENV.API_BASE_URL + "/api/entity/register",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            localStorage.setItem("token", res.data.token);
            alert("Registration successful!");
        } catch (err) {
            console.error("Error:", err);
            alert("Registration failed");
        }

        navigate("/");
    };

    return (
        <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-2/3 no-scrollbar mx-auto">
            <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
                <Link
                    to="/"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeftIcon className="size-5" />
                    Back to dashboard
                </Link>
            </div>

            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md dark:text-white/90">
                            Sign Up
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your email and password to sign up!
                        </p>
                    </div>

                    {/*<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 mb-6">*/}
                    {/*    <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">*/}
                    {/*        Sign up with Google*/}
                    {/*    </button>*/}
                    {/*    <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">*/}
                    {/*        Sign up with X*/}
                    {/*    </button>*/}
                    {/*</div>*/}

                    {/*<div className="relative py-3 sm:py-5">*/}
                    {/*    <div className="absolute inset-0 flex items-center">*/}
                    {/*        <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>*/}
                    {/*    </div>*/}
                    {/*    <div className="relative flex justify-center text-sm">*/}
                    {/*          <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">*/}
                    {/*            Or*/}
                    {/*          </span>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <Label>
                                        First Name<span className="text-error-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        name="fname"
                                        placeholder="Enter your first name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>

                                <div className="sm:col-span-1">
                                    <Label>
                                        Last Name<span className="text-error-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        name="lname"
                                        placeholder="Enter your last name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>
                                    Email<span className="text-error-500">*</span>
                                </Label>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>
                                    Password<span className="text-error-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        placeholder="Enter your password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                    >
                    {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                                </div>
                            </div>

                            <div>
                                <Label>Photo</Label>
                                <input
                                    className="mt-1 w-full rounded-2xl border border-gray-300 bg-white p-4 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600 dark:placeholder-gray-400"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />


                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="mt-3 h-24 w-24 rounded-lg object-cover border dark:border-gray-700"
                                    />
                                )}
                            </div>

                            <div>
                                <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs  dark:bg-blue-600 hover:bg-blue-700">
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="mt-5">
                        <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                            Have an account? {""}
                            <Link
                                to="/signin"
                                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
