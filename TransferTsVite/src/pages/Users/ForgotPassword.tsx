import {Link} from "react-router";
import {ChevronLeftIcon} from "../../admin/icons";
import Label from "../../admin/components/form/Label.tsx";
import Input from "../../admin/components/form/input/InputField.tsx";
import React, {useState} from "react";
import Button from "../../admin/components/ui/button/Button.tsx";
import axios from "axios";
import ENV from "../../env/index";
import {useNavigate} from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await axios.post(ENV.API_BASE_URL + "/api/Entity/ForgotPassword", {
                email: email,
            }).then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            });
            alert("Email was sent successfully!");
            navigate('/');
        }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch(err) {
            alert("something went wrong, try again later.");
        }



    }
    return (
        <div className="flex flex-col flex-1">
            <div className="w-full max-w-md pt-10 mx-auto">
                <Link
                    to="/signin"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeftIcon className="size-5" />
                    Back to Log in
                </Link>
            </div>
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Reset Password
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your email to continue!
                        </p>
                    </div>
                    <div>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        Email <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <Input placeholder="info@gmail.com"  value={email}
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                               setEmail(e.target.value)
                                           } />
                                </div>
                                {/*<div className="flex items-center justify-between">*/}
                                {/*    <Link*/}
                                {/*        to="/Forgot-Password"*/}
                                {/*        className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"*/}
                                {/*    >*/}
                                {/*        Forgot password?*/}
                                {/*    </Link>*/}
                                {/*</div>*/}
                                <div>
                                    <Button className="w-full" size="sm">
                                        Continue
                                    </Button>
                                </div>
                            </div>
                        </form>

                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                Don&apos;t have an account? {""}
                                <Link
                                    to="/signup"
                                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}