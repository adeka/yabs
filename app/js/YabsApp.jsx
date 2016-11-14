import React from 'react';
import ReactDOM from 'react-dom';
import ListView from './ListView';

const placeholder = document.createElement('li');
placeholder.className = 'placeholder';

export default class YabsApp extends React.Component {
    render() {
        return (
            <div>
            <ListView />
            </div>
        );
    }
}
