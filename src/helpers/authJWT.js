import jwt_decode from "jwt-decode";

export const authJwtToken = () => {
    if (localStorage.getItem("token")) {
            let token = localStorage.getItem("token");
            let decodedToken = jwt_decode(token);
            //console.log("Decoded Token", decodedToken);
            let currentDate = new Date();

            // JWT exp is in seconds
            if (decodedToken.exp * 1000 > currentDate.getTime()) {
                return true
            } 
        }
    return false;
};