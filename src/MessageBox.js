import React, {
    Component
} from 'react';

const styles = {
    error: {
        background: '#FFCDD2',
        padding: '12px',
        borderRadius: '12px',
        marginBottom: '12px'
    }
}

class MessageBox extends Component {
    render() {
        if (this.props.message === '') {
            return (
                <span></span>
            );
        }
        else {
            return (
                <div style={styles.error}>
                    {this.props.message}
                </div>
            );
        }
        
    }
}

export default MessageBox