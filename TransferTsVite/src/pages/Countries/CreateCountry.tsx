import { useState, type FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { CountryGeneralModel } from "../../Interfaces/Countries/CountryGeneralModel.ts";
import API_BASE_URL from "../../env";
import Input from "../../admin/components/form/input/InputField.tsx";

export default function CreateCountry() {
    const navigate = useNavigate();
    const api = API_BASE_URL.API_BASE_URL;

    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [slug, setSlug] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [description, setDescription] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const tags = tagsInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        const model: CountryGeneralModel = {
            id: 0,
            name,
            code,
            slug,
            shortDescription,
            description,
            tags,
            image,
            imageStr: null
        };

        try {
            setIsSubmitting(true);

            const res = await axios.post(
                `${api}/api/countries/create`,
                model,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );

            if (res.status === 200) {
                navigate(-1);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to create country");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen w-full py-16 px-4 bg-gray-50 dark:bg-gray-950">
            <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="
          max-w-2xl mx-auto p-8 rounded-2xl
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-800
          shadow-sm dark:shadow-lg
          space-y-8
        "
            >
                {/* Title */}
                <h2 className="text-3xl font-semibold tracking-tight
                       text-gray-900 dark:text-gray-100">
                    Create Country
                </h2>

                {/* Name */}
                <Field label="Name">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ukraine"
                    />
                </Field>

                {/* Code */}
                <Field label="Code">
                    <Input
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="UA"
                    />
                </Field>

                {/* Slug */}
                <Field label="Slug">
                    <Input
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="ukraine"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Used in URL, lowercase, no spaces
                    </p>
                </Field>

                {/* Descriptions */}
                <div className="space-y-6">
                    <Field label="Short Description">
            <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={3}
                placeholder="Short summary shown in lists..."
                className="textarea textarea-lg dark:text-gray-400 w-full border dark:border-gray-700 p-2 rounded rounded-xl"
            />
                    </Field>

                    <Field label="Description">
                          <textarea
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              rows={8}
                              placeholder="Full country description..."
                              className="textarea textarea-lg dark:text-gray-400 w-full border dark:border-gray-700 p-2 rounded rounded-xl"
                          />

                    </Field>
                </div>

                {/* Tags */}
                <Field label="Tags">
                    <Input
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="europe, sea, tourism"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Separate tags with commas
                    </p>
                </Field>

                {/* Image */}
                <Field label="Image">
                    <Input
                        type="file"
                        onChange={(e) =>
                            e.target.files && setImage(e.target.files[0])
                        }
                    />

                    {image && (
                        <img
                            src={URL.createObjectURL(image)}
                            alt="Preview"
                            className="
                mt-4 w-48 h-48 object-cover rounded-xl
                border border-gray-200 dark:border-gray-700
              "
                        />
                    )}
                </Field>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="
              px-4 py-2 rounded-md text-sm
              border border-gray-300 dark:border-gray-700
              text-gray-700 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-800
            "
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="
              px-5 py-2 rounded-md text-sm font-medium
              bg-blue-600 text-white hover:bg-blue-700
              disabled:opacity-50
            "
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
}

/* ---------------- Helper ---------------- */

function Field({
                   label,
                   children
               }: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium
                        text-gray-700 dark:text-gray-300">
                {label}
            </label>
            {children}
        </div>
    );
}
