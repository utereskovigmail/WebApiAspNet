
import {useQuery} from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import type {Country} from "../Interfaces/Countries/Country.ts";
import {useState} from "react";
import Modal from "../Modals/Country"
import APP_ENV from "../env";
import {useNavigate} from "react-router-dom";

const Home = () =>{
    const api = APP_ENV.API_BASE_URL + "/api";
    // const url = "http://localhost:5055";
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selected, setSelected] = useState<Country | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    // const [selectedCountryId, setSelectedCountryId] = useState<number>(-1);


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
            const res = await axios.get(api + "/countries");
            return res.data;
        }
    });



    async function Delete(id: number) {
        try {
            const res = await axios.delete(`${api}/countries/delete/${id}`);

            if (res.status === 200) {
                console.log("Successfully deleted");
                await queryClient.invalidateQueries({ queryKey: ["countries"] });

            }
        } catch (err) {
            console.error(err);
            alert("Error deleting the data");
        }
    }


    if(error) return <p className={"text-4xl text-center text-red-800"}>Error loading Users</p>
    if(isLoading) return <p className={"text-4xl text-center text-blue-500"}>Loading...</p>
    if(data === null) return <p className={"text-4xl text-center text-red-800"}>No users found</p>

    return (
        <div className={"w-full p-4 flex flex-row flex-wrap gap-4 justify-center"}>

            {!data && <p className={"text-center text-xl my-4"}>No data found</p>}
            {


                data?.map((item, index:number) => (
                    <div
                        key={index}
                        className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
                    >
                        <img
                            src={`${APP_ENV.API_BASE_URL}/images/${item.image}`}
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
                                {item.description}
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={() => openModal(item)}
                                    className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
                                >
                                    Read more →
                                </button>

                                <button
                                    onClick={() => Delete(item.id)}
                                    className={"mt-6 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition"}>
                                    Delete
                                </button>

                                <button
                                    onClick={() => Delete(item.id)}
                                    className={"mt-6 inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 transition"}>
                                    Edit
                                </button>
                            </div>

                            <button
                                onClick={() => navigate(`/cities/${item.id}`)}
                                className="mt-6 inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 transition"
                            >
                                View Cities
                            </button>








                        </div>
                    </div>

                ))
            }

            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                country={selected}
            />
        </div>
    )
};
export default Home;