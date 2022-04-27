import './customers.sass';
import {useEffect, useState} from "react";

function Customers(){
    const [customers, setCustomers] = useState([]);
    const [blub, setBlub] = useState(0);

    useEffect(() => {
        fetch("/api/customers")
            .then(res => res.json())
            .then(customers => {setCustomers(customers); console.log(customers);})
    }, [blub])

    return (
        <div >
            <h2>Customers</h2>
            <button onClick={() => setBlub( 1)}></button>
            <ul>
                {customers.map(customer =>
                <li key={ customer.id }>{ customer.firstName } { customer.lastName }</li>
                )}
            </ul>
        </div>
    );
}

export default Customers;
