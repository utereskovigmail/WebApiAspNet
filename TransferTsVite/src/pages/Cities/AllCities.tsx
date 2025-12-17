import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import API_BASE_URL from "../../env";
import type {CityItemModel} from "../../Interfaces/Cities/CityItemModel.ts";

import {useNavigate, useParams} from "react-router-dom";
function AllCities() {
    const { id } = useParams<{ id: string }>();
    const api = API_BASE_URL.API_BASE_URL;
    const {data, isLoading, error} = useQuery<CityItemModel[]>({
        queryKey: ["cities"],
        queryFn: async () => {
            const res = await axios.get(api + "/api/cities/"+id);
            console.log(res.data);
            return res.data;

        }
    });
    const navigate = useNavigate();

    if (error)
        return (
            <p className="text-4xl text-center text-red-800 dark:text-red-500">
                Error loading cities
            </p>
        );
    if (isLoading)
        return (
            <p className="text-4xl text-center text-blue-500 dark:text-blue-400">
                Loading...
            </p>
        );
    if (data === null)
        return (
            <p className="text-4xl text-center text-red-800 dark:text-red-500">
                No cities found
            </p>
        );

    return (
        <div className="flex flex-col w-full">
            {/* Header with Create City button */}
            <div className={"flex justify-end px-4"}>
                <button
                    onClick={() => navigate("/admin/city/create")}
                    className="
        px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700
        text-white text-lg font-medium
        transition-colors
        dark:bg-blue-500 dark:hover:bg-blue-600 mt-8
      "
                >
                    + Create City
                </button>
            </div>
            <div className="flex justify-center items-center mb-6 px-4">
                <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 text-center">
                    Cities
                </h1>
            </div>

            {/* Cities grid */}
            <div className="flex justify-center gap-4 flex-wrap">
                {!data && (
                    <p className="text-center text-xl my-4 text-gray-700 dark:text-gray-300">
                        No data found
                    </p>
                )}

                {data?.map((item, index: number) => (
                    <div
                        key={index}
                        className="max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-md dark:shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                    >
                        <img
                            src={`${api}/images/${item.image}`}
                            alt={item.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6 text-center">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-md">
            {item.slug}
          </span>

                            <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                {item.name}
                            </h3>

                            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                                Country - {item.country}
                            </p>

                            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllCities;