import {AboutDispatch} from "./about/About";
import {useContext, useEffect, useState} from "react";
import Button from "@mui/material/Button";
import {DeeperComponentBleh} from "./DeeperComponentBleh";
import {handlePostResponse} from "../../utils/_globalUtils";
import axios from 'axios';
import {Avatar} from "@mui/material";

export const UploadTester = () => {
        const [selectedFile, setSelectedFile] = useState(null);
        /*const [image, setImage] = useState({data: null})
        useEffect(() => {
            axios.get("/api/getImage/6283f6287c4dc8d4a9de7bcb")
                .then(response => setImage(response.data.image));
        }, [])*/
        const onChangeHandler=event=>{
            setSelectedFile(event.target.files[0]);
        }
        const onClickHandler = () => {
            const data = new FormData()
            data.append('file', selectedFile)
            axios.post("/api/upload", data, {
                // receive two    parameter endpoint url ,form data
            }).then(r => console.log(r));
        }
        return (
            <div>
                <input type="file" name="file" onChange={onChangeHandler}/>
                <button type="button" className="btn btn-success btn-block" onClick={onClickHandler}>Upload
                </button>
            </div>
        );
}