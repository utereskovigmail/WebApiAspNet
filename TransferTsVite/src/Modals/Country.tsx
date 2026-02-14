import type { Country } from "../Interfaces/Countries/Country.ts";
import APP_ENV from "../env";
import {useEffect} from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    country: Country | null;
}

export default function Country({ isOpen, onClose, country }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        // Cleanup when unmounted
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen || !country) return null;

    const url = APP_ENV.API_BASE_URL;

    return (
        <div
            className="fixed inset-0 bg-black/[0.50] dark:bg-white/[0.50] bg-opacity-50 flex items-center justify-center z-50 transition-colors p-4"
            onClick={onClose}
        >
                {/*<div*/}
                {/*    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50*/}
                {/* dark:bg-white/[0.03] transition-colors"*/}
                {/*    onClick={onClose}*/}
                {/*>*/}

                <div
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-lg
                   max-w-lg w-full p-8 relative
                   border border-gray-200 dark:border-gray-800"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-1 right-3 text-2xl
                     text-gray-500 hover:text-gray-800
                     dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        ×
                    </button>

                    <img
                        src={`${url}/images/${country.image}`}
                        alt={country.name}
                        className="w-full h-56 object-cover rounded-lg"
                    />

                    <h2 className="mt-4 text-3xl font-bold text-center
                       text-gray-900 dark:text-gray-100">
                        {country.name}
                    </h2>

                    <p className="text-center text-sm
                      text-gray-500 dark:text-gray-400">
                        {country.slug}
                    </p>

                    <p className="mt-4 leading-relaxed
                      text-gray-700 dark:text-gray-300">
                        {country.description}
                    </p>

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {country.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="px-2 py-1 rounded-md text-xs font-medium
                         bg-blue-100 text-blue-700
                         dark:bg-blue-900/40 dark:text-blue-300"
                            >
              #{tag}
            </span>
                        ))}
                    </div>
                </div>
            </div>



    );
}
