import React from 'react'

class FileUploadButton extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            file:null
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    onFormSubmit(e){
        e.preventDefault();
        console.log(this.state.file);
    }
    onChange(e) {
        this.setState({file:e.target.files[0]})
    }
    render() {
        return (
            <form onSubmit={this.onFormSubmit}>
                <input type="file" onChange={this.onChange} />
                <button type="submit" className="pure-button pure-button-primary" >Upload</button>
            </form>
        )
    }
}

export default FileUploadButton