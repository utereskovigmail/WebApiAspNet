import {type CredentialResponse, GoogleLogin} from "@react-oauth/google";
import axios from "axios";
import APP_ENV from "../env";
function handleGoogleLoginResponse(response:CredentialResponse) {
    const idToken = response.credential;

    axios.post(
        APP_ENV.API_BASE_URL + "/google-login", {
        idToken: idToken
    })
        .then(res => {
            console.log("Server token:", res.data.token);
            localStorage.setItem("token", res.data.token);
        })
        .catch(err => {
            console.error("Login failed", err);
        });
}
function Landing(){
    return(
        <div>
            <GoogleLogin onSuccess={credentialResponse => handleGoogleLoginResponse(credentialResponse) } onError={()=> console.log("error")}/>
        </div>
    );
}

export default Landing;