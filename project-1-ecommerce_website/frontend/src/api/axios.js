import axios from "axios";
import { base_API } from "./base_api";

export const api= axios.create({
    baseURL: `${base_API}/api`,
    headers:{'Content-Type' : 'application/json'}
});