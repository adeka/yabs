import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { observable, action, computed, autorun } from 'mobx';
import 'fa';

export default class Toolbar extends React.Component {
    static propTypes = {
        store: React.PropTypes.any
    }
    addFolder() {
        const id = '1';
        const url = null;
        const bookmark = {
            parentId: id,
            index: 0,
            title: 'Folder',
            url: url
        };
        chrome.bookmarks.create(bookmark);
        this.props.store.load();
        console.log('added folder');
    }
    onChange() {

    }
    render() {
        return (
            <div className="toolbar">
                <div className="addFolder" onClick={this.addFolder.bind(this)}>
                  <i className="fa fa-plus"></i>
                  <i className="fa fa-folder-open"></i>
                </div>
                <input onChange={this.onChange.bind(this)} className="searchBar" autoFocus></input>
                <i className="fa fa-search search"></i>
            </div>
        );
    }
}
