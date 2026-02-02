
import {useQuery} from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import type {Country} from "../../Interfaces/Countries/Country.ts";
import {useState} from "react";
import Modal from "../../Modals/Country.tsx"
import APP_ENV from "../../env";
import {useNavigate} from "react-router-dom";
import api from "../../components/axios/authorized.tsx";
import {useAppSelector} from "../../store";

const Home = () =>{
    const api_src = APP_ENV.API_BASE_URL + "/api";
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selected, setSelected] = useState<Country | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    // const [selectedCountryId, setSelectedCountryId] = useState<number>(-1);

    const isAdmin = useAppSelector(redux => redux.auth.isAdmin);


    function openModal(item: Country){
        setSelected(item);
        setIsOpen(true);
    }
    function closeModal(){
        setIsOpen(false);
        setSelected(null);
    }




    const {data, isLoading, error} = useQuery<Country[]>({
        queryKey: ["countries"],
        queryFn: async () => {
            const res = await axios.get(api_src + "/countries");
            return res.data;
        }
    });



    async function Delete(id: number) {
        try {
            const res = await api.delete("/Countries/delete/" + id);

            if (res.status === 200) {
                console.log("Successfully deleted");
                await queryClient.invalidateQueries({ queryKey: ["countries"] });

            }
        } catch (err) {
            console.error(err);
            alert("Error deleting the data");
        }
    }


    if (error)
        return (
            <p className="text-4xl text-center text-red-700 dark:text-red-400">
                Error loading Users
            </p>
        );

    if (isLoading)
        return (
            <div className={"h-screen w-full dark:bg-gray-800"}>
                <p className="text-4xl text-center text-blue-600 dark:text-blue-400">
                    Loading...
                </p>
            </div>

        );

    if(data === null) return <p className="text-4xl text-center text-red-700 dark:text-red-400">No users found</p>

    return (
        <div className=" min-h-screen
                  bg-gray-100 dark:bg-gray-900 transition-colors">

            {!data && (
                <p className="text-center text-xl my-4 text-gray-700 dark:text-gray-300">
                    No data found
                </p>
            )}
            <div className={"w-full p-4 flex flex-row flex-wrap gap-4 justify-center h-auto"}>
                {data?.map((item, index: number) => (
                    <div
                        key={index}
                        className="max-w-sm rounded-xl overflow-hidden border
                   bg-white dark:bg-white/[0.03]
                   border-gray-200 dark:border-gray-800
                   shadow-md dark:shadow-lg h-auto"
                    >
                        <img
                            src={`${APP_ENV.API_BASE_URL}/images/${item.image}`}
                            alt={item.name}
                            className="w-full h-48 object-cover"
                        />

                        <div className="p-6 text-center">
          <span
              className="inline-block px-2 py-1 text-xs font-medium rounded-md
                       bg-blue-100 text-blue-700
                       dark:bg-blue-900/40 dark:text-blue-300"
          >
            {item.slug}
          </span>

                            <h3 className="mt-4 text-2xl font-semibold
                         text-gray-900 dark:text-gray-100">
                                {item.name}
                            </h3>

                            <p className="mt-2 text-sm
                        text-gray-600 dark:text-gray-400">
                                {item.description}
                            </p>

                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={() => openModal(item)}
                                    className={`mt-6 inline-flex items-center justify-center px-4 py-2
                          rounded-md text-sm font-medium transition
                          bg-blue-600 text-white hover:bg-blue-700
                          dark:bg-blue-500 dark:hover:bg-blue-600
                          ${isAdmin ? "" : "w-full mx-4"}`}
                                >
                                    Read more →
                                </button>

                                {isAdmin && (
                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            onClick={() => Delete(item.id)}
                                            className="mt-6 inline-flex items-center px-4 py-2
                             rounded-md text-sm font-medium transition
                             bg-red-600 text-white hover:bg-red-700
                             dark:bg-red-500 dark:hover:bg-red-600"
                                        >
                                            Delete
                                        </button>

                                        <button
                                            className="mt-6 inline-flex items-center px-4 py-2
                             rounded-md text-sm font-medium transition
                             bg-yellow-600 text-white hover:bg-yellow-700
                             dark:bg-yellow-500 dark:hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="px-4">
                                <button
                                    onClick={() => navigate(`/cities/${item.id}`)}
                                    className={`mt-6 inline-flex items-center justify-center px-4 py-2
                          rounded-md text-sm font-medium transition
                          bg-yellow-600 text-white hover:bg-yellow-700
                          dark:bg-yellow-500 dark:hover:bg-yellow-600
                          ${isAdmin ? "" : "w-full"}`}
                                >
                                    View Cities
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            <Modal isOpen={isOpen} onClose={closeModal} country={selected} />
        </div>
    );

};
export default Home;