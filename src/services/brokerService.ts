import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function getBrokers() {
    const {data: brokers} = await axios.get(`${BASE_URL}/api/brokers/all`);

    return brokers;
}
