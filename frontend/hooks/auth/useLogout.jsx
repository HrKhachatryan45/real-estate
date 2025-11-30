import { useState } from "react";
import { logoutUser } from "../../redux/slices/authSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";
import { useDispatch } from "react-redux";

const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const HOST_URL = Constants.expoConfig?.extra?.HOST_URL;
    const dispatch = useDispatch()
    const logout = async () => {
        setLoading(true);
        try{
            const response = await fetch(`${HOST_URL}/api/auth/logout`,{
                method: 'POST'
            });
            const json = await response.json();

            if (!response.ok) {
                setError(json.error || 'Logout failed');
                setLoading(false);
                return null;    
            }
            
            dispatch(logoutUser());

            AsyncStorage.removeItem('user');
            AsyncStorage.removeItem('token');

            
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return {logout,error,loading,setError};
}

export default useLogout