import axios from "axios";

export async function getBrokers() {
    const {data: brokers} = await axios.get(`/api/brokers/all`);

    return brokers;
}
