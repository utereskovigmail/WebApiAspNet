import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import API_BASE_URL from "../env/index";
import type {CityItemModel} from "../Interfaces/Cities/CityItemModel";

import {useParams} from "react-router-dom";
function AllCities() {
    const { countryId } = useParams();
    const api = API_BASE_URL.API_BASE_URL;
    const {data, isLoading, error} = useQuery<CityItemModel[]>({
        queryKey: ["countries"],
        queryFn: async () => {
            const res = await axios.get(api + "/api/cities/"+countryId);
            console.log(res.data);
            return res.data;

        }
    });

    if(error) return <p className={"text-4xl text-center text-red-800"}>Error loading cities</p>
    if(isLoading) return <p className={"text-4xl text-center text-blue-500"}>Loading...</p>
    if(data === null) return <p className={"text-4xl text-center text-red-800"}>No cities found</p>


    return (
     <div>
             {!data && <p className={"text-center text-xl my-4"}>No data found</p>}
        {


        data?.map((item, index:number) => (
            <div
                key={index}
                className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
            >
                <img
                    src={`${api}/images/${item.image}`}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                />

                <div className="p-6 text-center">

                        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md">
                          {item.slug}
                        </span>

                    <h3 className="mt-4 text-2xl font-semibold text-gray-900">
                        {item.name}
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm">
                        Country - {item.country}
                    </p>

                    <p className="mt-2 text-gray-600 text-sm">
                        {item.description}
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        {/*<button*/}
                        {/*    onClick={() => openModal(item)}*/}
                        {/*    className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"*/}
                        {/*>*/}
                        {/*    Read more →*/}
                        {/*</button>*/}

                        {/*<button*/}
                        {/*    onClick={() => Delete(item.id)}*/}
                        {/*    className={"mt-6 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition"}>*/}
                        {/*    Delete*/}
                        {/*</button>*/}

                        {/*<button*/}
                        {/*    onClick={() => Delete(item.id)}*/}
                        {/*    className={"mt-6 inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 transition"}>*/}
                        {/*    Edit*/}
                        {/*</button>*/}
                    </div>


                </div>
            </div>

        ))
    }
     </div>
    )
}

export default AllCities;