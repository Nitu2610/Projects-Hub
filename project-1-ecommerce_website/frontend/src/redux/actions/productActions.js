import axios from "axios"
import { setError, setLoading, setProducts } from "../productSlice";

export const fetchProducts=()=> async (dispatch)=>{
    try {
        dispatch(setLoading(true))
        let res= await axios.get('http://localhost:3050/api/products');
       
      //  console.log('fetch data: ', res)

        dispatch(setProducts(res.data));
        dispatch(setLoading(false))

    } catch (error) {
        dispatch(setError("Error while fetching products!!"));
        dispatch(setLoading(false))
    }
}