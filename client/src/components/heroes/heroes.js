import './heroes.sass';
import {useEffect, useState} from "react";

function Heroes(){
    const [heroes, setHeroes] = useState([]);

    useEffect(() => {
        fetch("/api/heroes")
            .then(res => res.json())
            .then(heroes => {setHeroes(heroes); console.log(heroes);})
    }, [])

    return (
        <div >
            <h2>Heroes</h2>
            <ul>
                {heroes.map(hero =>
                <li key={ hero._id }>{ hero.name } </li>
                )}
            </ul>
        </div>
    );
}

export default Heroes;
