import React from 'react';
import './App.css';
import ArithmeticSumForm from './ArithmeticSumForm'

function App() {

    // const handleClick = async () => {
    //     const helloResponse = await axios.get('/api/arithmeticSum/');
    //     console.log(helloResponse);
    // };

    return (
        <div className="App">
        <ArithmeticSumForm />
        </div>
    );
}

export default App;
