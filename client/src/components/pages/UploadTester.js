import {useState} from "react";
import axios from 'axios';

export const UploadTester = () => {
        const [selectedFile, setSelectedFile] = useState(null);
        const onChangeHandler=event=>{
            setSelectedFile(event.target.files[0]);
        }
        const onClickHandler = () => {
            const data = new FormData()
            data.append('file', selectedFile)
            axios.post("/users/upload", data, {}).then(res => console.log(res));
        }
        return (
            <div>
                <input type="file" name="file" onChange={onChangeHandler}/>
                <button type="button" className="btn btn-success btn-block" onClick={onClickHandler}>Upload
                </button>
            </div>
        );
}