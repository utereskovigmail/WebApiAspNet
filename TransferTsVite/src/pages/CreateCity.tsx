import API_BASE_URL from "../env";
import {type FormEvent, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import type {Country} from "../Interfaces/Countries/Country";
import { Editor } from '@tinymce/tinymce-react';


function CreateCity() {
    const api = API_BASE_URL.API_BASE_URL;

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
        if (image) {
            formData.append("Image", image); // must match property name!
        }

        try {
            const res = await axios.post(api + "/api/cities", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            console.log(res.data);
            navigate(-1);
        }
        catch (error) {
            console.log(error);
        }


    }
    async function GetCountries(): Promise<Country[]> {

        const res = await axios.get(api + "/api/countries");
        setCountries(res.data);
        // console.log(api + "/api/countries");
        // console.log(res.data);
        return res.data;
    }

    useEffect(() => {
        const fetchData = async () => {
            await GetCountries();
        };

        fetchData();
    }, []);



    const navigate = useNavigate();

    return (
     <div className={"h-screen w-full bg-blue-100 flex flex-row justify-center items-center m-0"}>
         <form
             onSubmit={handleSubmit}
             className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6"
             encType="multipart/form-data"
         >
             <h2 className="text-2xl font-semibold text-gray-800">
                 Create a new City
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


             <Editor
                 apiKey='xuoy7fssq4jz9fs9ye4cap56e23cp83j4w9s139x9vktlaph'
                 onEditorChange={c => setDescription(c)}
             />



             <div>
                 <label htmlFor={"countries"} className="block text-sm font-medium text-gray-700 mb-1">
                     Country
                 </label>
                 <select
                     defaultValue=""
                     onChange={(e) => setCountryId(Number(e.target.value))}
                     className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                 >
                     <option value="" disabled>Choose a country</option>

                     {countries.map((country: Country) => (
                         <option key={country.id} value={country.id}>
                             {country.name}
                         </option>
                     ))}
                 </select>

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
                     {image ? (
                         <img
                             src={
                                 URL.createObjectURL(image)
                             }
                             alt="Image"
                             className="w-48 h-48 object-cover rounded"
                         />
                     ) : <></>}

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
     </div>
    )
}

export default CreateCity;