import React, { Component } from 'react';
import DropzoneComponent from 'react-dropzone-component';
import masterAssetBigchain from './masterAssetBigchain';
require('./dropzone.css')
require('./filepicker.css')
require('./dropzone.min.css')


export class FileUpload extends Component {
   constructor(props) {
   super(props);
   this.componentConfig = {
    iconFiletypes: ['.stl'],
    showFiletypeIcon: true,
    postUrl: 'no-url'
};
this.djsConfig = { autoProcessQueue: false };
this.eventHandlers = { addedfile: (file) => masterAssetBigchain(file)}; //Posts the file to BCDB
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
