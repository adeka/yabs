import React from 'react';
import ReactDOM from 'react-dom';
import ListView from './ListView';
import Toolbar from './Toolbar';
import { observer } from 'mobx-react';
import { observable, action, computed, autorun } from 'mobx';

const placeholder = document.createElement('li');
placeholder.className = 'placeholder';

class BookmarkListStore {
    @observable bookmarks = [];
    @observable pointerState = 'interior';
    @action setPointerState(state) {
        this.pointerState = state;
    }
    load() {
        chrome.bookmarks.getTree(this.assignBookmarks.bind(this));
    }
    assignBookmarks(bookmarks) {
        //retarded way of accessing "Bookmarks Bar" array of children
        const bookmarkTree = bookmarks[0].children[0].children;
        this.bookmarks = bookmarkTree;
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }
}

export default class YabsApp extends React.Component {
    constructor() {
        super();
        this.store = new BookmarkListStore();
        this.store.load();
    }
    render() {
        return (
            <div>
                <Toolbar store={this.store}/>
                <ListView store={this.store}/>
            </div>
        );
    }
}
