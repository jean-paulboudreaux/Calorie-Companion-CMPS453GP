import {useEffect, useState} from "react";
import axios from "axios";


const API_ENDPOINT = 'https://platform.fatsecret.com/rest/server.api';
const EXTERNAL_API_URL = 'http://127.0.0.1:8001/external-api/';

const FoodEntries = () => {
    const [data, setData] = useState("");
    const [loading, setLoading] = useState(true); // Set initial loading state to true
    const [food, setFood] = useState("");


    function handleInputChange(e) {
        setFood(e.target.value)
    }

    function handleSubmit() {
        const apiUrl = 'http://localhost:8001/api/search';

        // Request data sent to the server

        const requestData = {
            method: 'foods.search',
            search_expression: food,
            format: 'json',
        };
        axios
            .post(apiUrl, {
                body: {
                    method: 'foods.search',
                    search_expression: food,
                    format: 'json',
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                setData(response.data);
                setLoading(false); // Set loading to false after receiving the response
            })
            .catch((error) => {
                console.error('API Error:', error);
                setLoading(false); // Set loading to false in case of an error
            });

    }


    return (
        <div>
            <h1>Food Search Results</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            )}
            <input name="userFoodInput" type="text" value={food} onChange={handleInputChange}/>
            <button onClick={handleSubmit}> Search</button>
            {data[0]}
        </div>
    );
}
export default FoodEntries