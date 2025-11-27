//import axios
import axios from "axios";

//define be API endpoint
const backendUrl = 'https://comp1842-5lka.onrender.com/api/moods';

//declare function to call API
export const viewAllMoods = async (page = 1, limit = 10) => {
    try{
        const response = await axios.get(`${backendUrl}?page=${page}&limit=${limit}`);
        return response.data;
    }catch(err) {
        console.log(err);
        return null;
    }
};

export const addNewMood = async (newMood) => {
    try{
        const response = await axios.post(backendUrl, newMood);
        return response.data;
    }catch(err) {
        console.log(err);
        //throw err;
        return null;
    }
};

export const viewMoodById = async (id) => {
    try{
        const response = await axios.get(`${backendUrl}/${id}`);
        return response.data;
    }catch(err) {
        console.log(err);
        return null;
    }
};

export const editMood = async (id, updateMood) => {
    try {
        await axios.put(`${backendUrl}/${id}`, updateMood);
        return true; // thành công
    } catch(err) {
        console.log(err);
        return false;
    }
};

export const deleteMoodById = async (id) => {
    try{
        const response = await axios.delete(`${backendUrl}/${id}`);
        return response.data;
    }catch(err) {
        console.log(err);
        return null;
    }
};

export const deleteAllMoods = async () => {
    try{
        const response = await axios.delete(backendUrl);
        return response.data;
    }catch(err) {
        console.log(err);
        return null;
    }
};

export const getLineChartData = async (days = 7) => {
    try{
        const response = await axios.get(`${backendUrl}/statistics/linechart?days=${days}`);
        return response.data;
    }catch(err) {
        console.log(err);
        return null;
    }
};

export const getPieChartData = async (day = 7) => {
    try{
        const response = await axios.get(`${backendUrl}/statistics/piechart`);
        return response.data;
    }catch(err) {
        console.log(err);
        return null;
    }
};

export const getKPIData = async () => {
    try{
        const response = await axios.get(`${backendUrl}/statistics/kpi`);
        return response.data;
    }catch(err) {
        console.log(err);
        return null;
    }
};

