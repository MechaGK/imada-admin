import React, {
    Component
} from 'react';

const styles = {
    textfield: {
        resize: 'none',
    }
}

class NumberField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(e){
        const re = /^[0-9\b+-]+$/;
        if (e.target.value == '' || re.test(e.target.value)) {
           this.setState({value: e.target.value})
        }

        this.props.onChange(this.props.user, e.target.value);
     }

    render() {
        return (<textarea rows="1" cols="10" onChange={this.onChange} value={this.state.value}>
            {this.state.value}
        </textarea>);
    }
}

export default NumberField