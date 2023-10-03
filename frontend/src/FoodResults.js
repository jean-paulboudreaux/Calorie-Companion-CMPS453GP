import React, {useState} from "react";
import axios from "axios";


const FoodResults = (props)=> {
    console.log(props)
    const [state, setState] = useState(
        {
            meal: props.id,
            name: props.foodChoice,
            calories: props.foodArray.calories,
            carbohydrates: props.foodArray.carbohydrate,
            protein: props.foodArray.protein,
            sodium: props.foodArray.sodium,
            fiber: props.foodArray.fiber,
            sat_fat: props.foodArray.saturated_fat,
            trans_fat: props.foodArray.polyunsaturated_fat,
            total_fat: props.foodArray.fat,
        }
    )

    function handleSubmit ()  {
        console.log(props.foodArray)
        try{
            axios.post("http://localhost:8001/add-meal/add-food/",
                {
                    meal: 3,
                    name: props.foodChoice,
                    calories:props.foodArray.calories,
                    carbohydrates: props.foodArray.carbohydrate,
                    protein: props.foodArray.protein,
                    sodium: props.foodArray.sodium,
                    fiber: props.foodArray.fiber,
                    sat_fat: props.foodArray.saturated_fat,
                    trans_fat: props.foodArray.polyunsaturated_fat,
                    total_fat: props.foodArray.fat,

                }).then((response)=> {
                    console.log(response)
            })
        }catch (error){
            setState(error)
        }

    }

    function handleClick() {
        console.log(props)
        try{
            axios.post("http://localhost:8001/add-meal/add-food/",
                {
                    meal: props.id,
                    name: props.foodChoice,
                    calories:props.foodArray.calories,
                    carbohydrates: props.foodArray.carbohydrate,
                    protein: props.foodArray.protein,
                    sodium: props.foodArray.sodium,
                    fiber: props.foodArray.fiber,
                    sat_fat: parseFloat(props.foodArray.saturated_fat).toFixed(2),
                    trans_fat: parseFloat(props.foodArray.polyunsaturated_fat).toFixed(2),
                    total_fat: props.foodArray.fat,

                }).then((response)=> {
                console.log(response)
            })
        }catch (error){
            setState(error)
        }

    }

    return(
            <div>
                {state.id}
                <button onClick={handleClick}>Add Meal</button>
            </div>

    )
}
export default FoodResults