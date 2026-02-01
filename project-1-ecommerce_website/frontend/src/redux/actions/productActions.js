import axios from "axios"
import { setError, setLoading, setProducts } from "../productSlice";
import { base_API } from "../../api/base_api";

export const fetchProducts=()=> async (dispatch)=>{
    try {
        dispatch(setLoading(true))
        let res= await axios.get(`${base_API}/api/products`);
       
      //  console.log('fetch data: ', res)

        dispatch(setProducts(res.data));
        dispatch(setLoading(false))

    } catch (error) {
        dispatch(setError("Error while fetching products!!"));
        dispatch(setLoading(false))
    }
}