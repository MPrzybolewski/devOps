import React, {Component} from 'react';
import axios from "axios";

class ArithmeticSumForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstNumber: '',
            lastNumber: '',
            numberOfElements: '',
            isValid: true,
            value: ''
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    };

    handleSubmit = event => {
        event.preventDefault();
        const params = {
            firstNumber: this.state.firstNumber,
            lastNumber: this.state.lastNumber,
            numberOfElements: this.state.numberOfElements
        };

        axios.get('/api/arithmeticSum', { params }).then(res => {
            this.setState({ value: res.data})
        });
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <div>
                            <label>Pierwszy wyraz: </label>
                            <input type="text" name={"firstNumber"} value={this.state.firstNumber} onChange={this.onChange}/>
                        </div>
                        <div>
                            <label>Ostatni wyraz: </label>
                            <input type="text" name={"lastNumber"} value={this.state.lastNumber} onChange={this.onChange}/>
                        </div>
                        <div>
                            <label>Ilość wyrazów: </label>
                            <input type="text" name={"numberOfElements"} value={this.state.numberOfElements} onChange={this.onChange}/>
                        </div>
                    </div>
                    <button type="submit" disabled={!this.state.isValid}>Oblicz</button>
                </form>
                <div>
                    <p>{this.state.value}</p>
                </div>
            </div>
        );
    }
}


export default ArithmeticSumForm;
