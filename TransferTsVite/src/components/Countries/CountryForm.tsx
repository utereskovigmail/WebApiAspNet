import React, { useState } from "react";
import type {FormEvent} from "react";
import type {CountryGeneralModel} from "../../Interfaces/Countries/CountryGeneralModel";
import API_BASE_URL from "../../env/index";
import { useNavigate } from "react-router-dom";


interface CountryFormProps {
    initialValue?: Partial<CountryGeneralModel>;
    onSubmit: (model: CountryGeneralModel) => Promise<void>;
}

const CountryForm: React.FC<CountryFormProps> = ({ initialValue, onSubmit }) => {
    const api = API_BASE_URL;
    const [id] = useState(initialValue?.id ?? 0);
    const [name, setName] = useState(initialValue?.name ?? "");
    const [code, setCode] = useState(initialValue?.code ?? "");
    const [slug, setSlug] = useState(initialValue?.slug ?? "");
    const [description, setDescription] = useState(initialValue?.description ?? "");
    const [shortDescription, setShortDescription] = useState(
        initialValue?.shortDescription ?? ""
    );
    const [tagsInput, setTagsInput] = useState(
        initialValue?.tags?.join(", ") ?? ""
    );
    const [imageStr] = useState(initialValue?.imageStr || null);
    const [image, setImage] = useState<File | null>(null);

    const navigate = useNavigate();


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const tags =
            tagsInput
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t.length > 0) ?? [];

        const model: CountryGeneralModel = {
            id,
            name,
            code,
            slug,
            description,
            shortDescription,
            tags,
            image: image || null,
            imageStr: ""
        };

        onSubmit(model);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6"
            encType="multipart/form-data"
        >
            <h2 className="text-2xl font-semibold text-gray-800">
                {id ? "Edit Country" : "CreateCountry Country"}
            </h2>


            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ukraine"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code
                </label>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="UA"
                    maxLength={3}
                    required
                />
            </div>


            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                </label>
                <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ukraine"
                    required
                />
                <p className="text-xs text-gray-500 mt-1">
                    Використовується в URL, тільки маленькі букви, без пробілів.
                </p>
            </div>


            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                </label>
                <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Short summary of the country..."
                />
            </div>


            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Detailed description..."
                />
            </div>


            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                </label>
                <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. europe, sea, tourism"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Введи теги через кому. Наприклад: <code>europe, sea, tourism</code>
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image File
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            setImage(e.target.files[0]);
                        }
                    }}
                />

                <div className="mt-4">
                    <img
                        src={ image ?
                            URL.createObjectURL(image) : `${api}/images/${imageStr}`
                    }
                        alt="Image"
                        className="w-48 h-48 object-cover rounded"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Save
                </button>
            </div>
        </form>
    );
};

export default CountryForm;
