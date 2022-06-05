/**
 * Constants and helper functions used in all pages.
 */

import {useEffect} from "react";
import axios from "axios";

export const useSimpleDataFetch = (setState, url, key) => {
    useEffect(() => {
        axios.get(url)
            .then(res => {
                let fetched_data = new Set();
                res.data.forEach((data) => {
                    fetched_data.add(data[key]);
                })
                setState([...fetched_data]);
            })
            .catch(err => console.log(err));
    },[setState, url, key]);
}