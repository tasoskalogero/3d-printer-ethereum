import React, { Component } from 'react';
import DropzoneComponent from 'react-dropzone-component';
require('./dropzone.css');
require('./filepicker.css');
require('./dropzone.min.css');


export class FileUpload extends Component {
   constructor(props) {
   super(props);
   this.componentConfig = {
    iconFiletypes: ['.stl'],
    showFiletypeIcon: true,
    postUrl: 'no-url'
};
this.djsConfig = { autoProcessQueue: false };
this.eventHandlers = { addedfile: (file) => {
        this.props.callbackFromParent(file);        //return value to parent component
    }};
}
  render() {
    const componentConfig = this.componentConfig;
    const djsConfig = this.djsConfig;
    const eventHandlers = this.eventHandlers;
    
    return (
      <DropzoneComponent config={componentConfig}
                       eventHandlers={eventHandlers}
                       djsConfig={djsConfig}
                       />
    );
  }
}

export default FileUpload;
