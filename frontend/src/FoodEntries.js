import React, {useEffect, useState} from "react";
import axios from "axios";
import {useTable} from "react-table";
import Cookies from "js-cookie";
import {Modal} from "antd";
import FoodResults from "./FoodResults";


const API_ENDPOINT = 'https://platform.fatsecret.com/rest/server.api';
const EXTERNAL_API_URL = 'http://127.0.0.1:8001/external-api/';


const FoodEntries = () => {
        const [inputValues, setInputValues] = useState("")
        const [food, setFood] = useState("");
        const [content, setContent] = useState(<div></div>);
        const [userInfo, setUserInfo] = useState("");
        const [open, setOpen] = useState(false);
        const [confirmLoading, setConfirmLoading] = useState(false);
        const [modalText, setModalText] = useState('Content of the modal');
        const [results, setResults] = useState("");
        const [modal, setModal] = useState(<div></div>);
        const [data, setData] = useState([])

        // Initialize ID counter
        const [idCounter, setIdCounter] = useState(0);

    React.useEffect(() => {
        setData([
            {
                col1: 1,
                col2: '',
                id: 1,
            },
            {
                col1: 2,
                col2: '',
                id: 2,
            },
            {
                col1: 3,
                col2: '',
                id: 3,
            },
        ]);
        setIdCounter(3)
        setInputValues(Array(3).fill(''));
    }, []);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };


        // Create a new row with an incremented ID


    function createNewRow() {
        setIdCounter(idCounter + 1); // Increment the counter first
        const newRow = {
            col1: idCounter+1, // Use the updated counter
            col2: '',
            id: idCounter+1,
        };
        setData([...data, newRow]);
    }



    const columns = React.useMemo(
        () => [
            {
                Header: '',
                accessor: 'col1',
                headerStyle: {
                    borderRight: '1px solid #000', // Adjust the line style as needed
                },
            },
            {
                Header: 'Calories',
                accessor: 'col2',
                // Add a border-right style to create a vertical line
                headerStyle: {
                    borderRight: '1px solid #000', // Adjust the line style as needed
                },
            },
            {
                Header: 'Carbs',
                accessor: 'col3',
                // Add a border-right style to create a vertical line
                headerStyle: {
                    borderRight: '1px solid #000', // Adjust the line style as needed
                },
            },
            {
                Header: 'Protein',
                accessor: 'col4',
                // Add a border-right style to create a vertical line
                headerStyle: {
                    borderRight: '1px solid #000', // Adjust the line style as needed
                },
            },
            {
                Header: 'Sodium',
                accessor: 'col5',
                // Add a border-right style to create a vertical line
                headerStyle: {
                    borderRight: '1px solid #000', // Adjust the line style as needed
                },
            },
            {
                Header: 'Fiber',
                accessor: 'col6',
                // Add a border-right style to create a vertical line
                headerStyle: {
                    borderRight: '1px solid #000', // Adjust the line style as needed
                },
            },
            {
                Header: 'Sat Fat',
                accessor: 'col7',
                // Add a border-right style to create a vertical line
                headerStyle: {
                    borderRight: '1px solid #000', // Adjust the line style as needed
                },
            },
            {
                Header: 'Trans Fat',
                accessor: 'col8',
                // Add a border-right style to create a vertical line
                headerStyle: {
                    borderRight: '1px solid #000', // Adjust the line style as needed
                },
            },
            {
                Header: 'Total Fat',
                accessor: 'col9',
                // Add a border-right style to create a vertical line
                headerStyle: {
                    borderRight: '1px solid #000', // Adjust the line style as needed
                },
            },
        ],
        []
    );




    // Function to handle input change
    function handleInputChange(e, rowIndex) {
        const newInputValues = [...inputValues];
        newInputValues[rowIndex] = e.target.value;
        setInputValues(newInputValues);
    }

    // Create the table instance
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    });

    function handleKeyPress(event, row, rowIndex) {
        const food = inputValues[rowIndex];
        if (event.key === "Enter") {
            event.preventDefault();
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
                    setContent(response.data.foods_search.results.food[0].servings.serving[0]);

                    // Render the FoodResults component here, inside the if block
                    const foodResultsComponent = (
                        <FoodResults
                            id={row.original.id}
                            foodChoice={food}
                            foodArray={content}
                        />
                    );
                    setModal(foodResultsComponent);

                    processFoodChoice(row.original.id);
                    showModal();
                })
                .catch((error) => {
                    console.error('API Error:', error);
                    setContent(<h1>Error</h1>); // Set content to error message in case of an error
                });
        }
    }


    function processFoodChoice(mealNum){
        if(content){
            const currentDate = new Date();

            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add 1 to the month because months are 0-based.
            const day = String(currentDate.getDate()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}`;
            console.log(content)
            const username = Cookies.get('username')
            console.log(username)
            try{
                axios.get("http://127.0.0.1:8001/" + username + "/").then(
                    (response)=>{
                        setUserInfo(response.data)
                        console.log(response.data)
                    }
                )

            }catch (error){
                console.log("Error: " + error)
            }
            axios.post("http://localhost:8001/add-meal/",
                {
                    user: userInfo.user.id,
                    meal_number: mealNum,
                    date: formattedDate
                }
            ).then((response) => {
                console.log(content)

            }).catch((error) => {
                console.log(error)
            })
        }
    }


    return (
        <div className="inner-table">
            <table {...getTableProps()} style={{ borderCollapse: 'collapse' }}>
                <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column, columnIndex) => (
                            <th
                                {...column.getHeaderProps()}
                                style={{
                                    borderBottom: '2px solid black',
                                    background: 'lightgray',
                                    padding: '8px',
                                    textAlign: 'left',
                                    borderRight: columnIndex < headerGroup.headers.length - 1 ? '1px solid black' : 'none',
                                }}
                            >
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row, rowIndex) => {
                    prepareRow(row);
                    return (
                        <tr
                            {...row.getRowProps()}
                            className={rowIndex % 2 === 1 ? 'alternate-row' : ''}
                        >
                            {row.cells.map((cell, cellIndex) => (
                                <td
                                    {...cell.getCellProps()}
                                    style={{
                                        padding: '8px',
                                        borderRight: cellIndex < row.cells.length - 1 ? '1px solid black' : 'none',
                                    }}
                                >
                                    {cellIndex === 0 ? (
                                        <div>
                                            Meal {cell.row.original.col1}
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Enter food name..."
                                                    value={inputValues[row.original.id - 1]} // Use inputValues based on the rowIndex
                                                    onChange={(e) => handleInputChange(e, row.original.id - 1)} // Pass the rowIndex to handleInputChange
                                                    onKeyDown={(e) => handleKeyPress(e, row, row.original.id - 1)}
                                                />

                                                <Modal
                                                    title="Title"
                                                    open={open}
                                                    onOk={handleOk}
                                                    confirmLoading={confirmLoading}
                                                    onCancel={handleCancel}
                                                >
                                                    {modal}

                                                </Modal>
                                            </div>

                                            <div>
                                                <button>Enter a Custom Meal:</button>
                                            </div>
                                        </div>
                                    ) : (
                                        cell.render('Cell')
                                    )}
                                </td>
                            ))}
                        </tr>
                    );
                })}
                </tbody>

            </table>
            <div>
                <button onClick={createNewRow}>Add Another Meal</button>
            </div>
        </div>
    );
};

export default FoodEntries