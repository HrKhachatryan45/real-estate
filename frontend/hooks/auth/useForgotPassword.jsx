import { useState } from "react";
import { useDispatch } from "react-redux";
import Constants from "expo-constants";

const useForgetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const HOST_URL = Constants.expoConfig?.extra?.HOST_URL;
    
    const forgetPassword = async (email) => {
        setLoading(true);
        try{
            const response = await fetch(`${HOST_URL}/api/auth/forgot/password`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email}),
            });
            const json = await response.json();
            
            if (!response.ok || json.error) {
                setError(json.error || 'forgetPassword failed');
                setLoading(false);
                return null;    
            }
            return json.message;
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return {forgetPassword,error,loading,setError};
}

export default useForgetPassword