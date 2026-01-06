import API_BASE_URL from "../../env";
import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Country } from "../../Interfaces/Countries/Country";
import { Editor } from "@tinymce/tinymce-react";
import Input from "../../admin/components/form/input/InputField.tsx";

function Create() {
    const api = API_BASE_URL.API_BASE_URL;
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [countryId, setCountryId] = useState<number>(0);
    const [image, setImage] = useState<File | null>(null);
    const [countries, setCountries] = useState<Country[]>([]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("Name", name);
        formData.append("Slug", slug);
        formData.append("Description", description);
        formData.append("CountryId", countryId.toString());
        if (image) formData.append("Image", image);

        try {
            await axios.post(`${api}/api/cities/create`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            navigate(-1);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        axios.get(`${api}/api/countries`).then(res => setCountries(res.data));
    }, [api]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center
                        bg-gray-100 dark:bg-gray-900 px-4">

            <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="w-full max-w-3xl rounded-xl p-6 space-y-6
                           bg-white dark:bg-white/[0.03]
                           border border-gray-200 dark:border-gray-800
                           shadow-lg"
            >
                <h2 className="text-2xl font-semibold
                               text-gray-900 dark:text-gray-100">
                    Create New City
                </h2>

                {/* Name */}
                <Field label="Name">
                    <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Kyiv"

                    />
                </Field>

                {/* Slug */}
                <Field label="Slug">
                    <Input
                        value={slug}
                        onChange={e => setSlug(e.target.value)}
                        placeholder="kyiv"

                        className="input"
                    />
                    <p className="hint dark:text-gray-600">
                        Used in URL, lowercase, no spaces
                    </p>
                </Field>

                {/* Description */}
                <Field label="Description">
                    <Editor
                        apiKey="xuoy7fssq4jz9fs9ye4cap56e23cp83j4w9s139x9vktlaph"
                        onEditorChange={setDescription}
                        init={{
                            height: 250,
                            skin: "oxide-dark",
                            content_css: "dark",
                            menubar: false,
                            plugins: "lists link preview",
                            toolbar:
                                "undo redo | bold italic | bullist numlist | link"
                        }}
                    />
                </Field>

                {/* Country */}
                <Field label="Country">
                    <select
                        defaultValue=""
                        onChange={e => setCountryId(Number(e.target.value))}
                        required
                        className="
            w-full appearance-none
            rounded-xl px-4 py-2.5 text-sm
            bg-white dark:bg-gray-900
            border border-gray-300 dark:border-gray-700
            text-gray-900 dark:text-gray-100
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
            hover:border-gray-400 dark:hover:border-gray-600
            transition
        "
                    >
                        <option value="" disabled className="text-gray-400">
                            Choose a country
                        </option>

                        {countries.map(country => (
                            <option
                                key={country.id}
                                value={country.id}
                                className="bg-white dark:bg-gray-900"
                            >
                                {country.name}
                            </option>
                        ))}
                    </select>

                    {/* Dropdown icon */}
                    {/*<div className="">*/}
                        <svg
                            className="h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none absolute inset-y-0 right-5 flex items-center top-1/2 translate-y-1/2 translate-x-1/2 p-0 m-0"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    {/*</div>*/}
                </Field>

                {/* Image */}
                <Field label="Image">
                    <Input
                        type="file"
                        // accept="image/*"
                        onChange={(e) =>
                            e.target.files && setImage(e.target.files[0])
                        }
                    />

                    {image && (
                        <img
                            src={URL.createObjectURL(image)}
                            alt="Preview"
                            className="mt-4 w-48 h-48 object-cover rounded-lg
                                       border border-gray-200 dark:border-gray-700"
                        />
                    )}
                </Field>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn-secondary dark:text-white hover:underline"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="btn-primary dark:text-white hover:underline"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Create;

/* ---------- Helpers ---------- */

function Field({
                   label,
                   children
               }: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className={"relative"}>
            <label className="block mb-1 text-sm font-medium
                              text-gray-700 dark:text-gray-300">
                {label}
            </label>
            {children}
        </div>
    );
}
