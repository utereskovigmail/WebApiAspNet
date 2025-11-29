import type {CountryGeneralModel} from "../Interfaces/Countries/CountryGeneralModel.ts";
import CountryForm from "../components/Countries/CountryForm";
import axios from "axios";
import API_BASE_URL from "../env/index";
import {useNavigate} from "react-router-dom";
function CreateCountry(){
    const emptyCountry: CountryGeneralModel = {
        id: 0,
        name: "",
        code: "",
        slug: "",
        description: "",
        shortDescription: "",
        tags: [],
        imageStr: null,
        image: null
    };
    const navigate = useNavigate();

    async function handleSubmit(model: CountryGeneralModel): Promise<void>{
        try {
            console.log(API_BASE_URL.API_BASE_URL)
            const res = await axios.post(`${API_BASE_URL.API_BASE_URL}/api/countries/create`, model, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if(res.status === 200){
                navigate(-1);
            }
            else{
                console.log(res.data);
            }
        }
        catch(error){
            console.log(error);
        }


    }

    return (
        <div>
            <CountryForm initialValue={emptyCountry} onSubmit={handleSubmit}/>
        </div>
    );
}

export default CreateCountry;