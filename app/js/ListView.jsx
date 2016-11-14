import React from 'react';
import ReactDOM from 'react-dom';
import Collapse from 'react-collapse';
import { observer } from 'mobx-react';
import { observable, action, computed, autorun } from 'mobx';
import 'fa';
import Bookmark from './Bookmark';

class BookmarkListStore {
    @observable bookmarks = [];
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

@observer export default class ListView extends React.Component {
    static propTypes = {
        store: React.PropTypes.any
    }
    constructor(props) {
        super(props);
        this.store = new BookmarkListStore();
        this.store.load();
    }
    render() {
        const bookmarks = this.store.bookmarks;
        const topLevel = [];
        const folders = [];
        bookmarks.forEach((value) => {
            if (!value.children) {
                topLevel.push(value);
            } else {
                folders.push(value);
            }
        });
        this.topLevelLinks = topLevel.map((bookmark, i) => {
            return <Bookmark bookmark={bookmark} key={bookmark.id}/>;
        });
        this.folderLinks = folders.map((folder) => {
            const children = folder.children.map((child, i) => {
                return <Bookmark
                    bookmark={child}
                    key={child.id}
                    store={this.store}
                    id={child.id}
                    data-id={i}
                />;
            });
            return (
                <BookmarkGroup children={children} key={folder.id} folder={folder} store={this.store}/>
            );
        });
        return (
            <div className="bookmarkList">
            {this.topLevelLinks}
            {this.folderLinks}
            </div>
        );
    }
}
@observer class BookmarkGroup extends React.Component {
    constructor(props) {
        super(props);
        const state = JSON.parse(localStorage.getItem(this.props.folder.id));
        this.state = { collapsed: state };
    }
    static propTypes = {
        children: React.PropTypes.any,
        folder: React.PropTypes.any,
        store: React.PropTypes.any
    }
    expand() {
        this.setState({ collapsed: !this.state.collapsed }, () => {
            localStorage.setItem(this.props.folder.id, this.state.collapsed);
        });
    }
    addBookmark() {
        const id = this.props.folder.id;
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            const url = tabs[0].url;
            const bookmark = {
                parentId: id,
                index: 0,
                title: url,
                url: url
            };
            chrome.bookmarks.create(bookmark);
            this.props.store.load();
        });
    }
    render() {
        return (
            <div className="bookmarkGroup">
                <div className="header">
                    <div className="title" onClick={this.expand.bind(this)}>
                    {this.props.folder.title}
                    </div>
                    <i className="fa fa-plus" onClick={this.addBookmark.bind(this)}/>
                </div>
                <Collapse isOpened={this.state.collapsed}>
                    {this.props.children}
                </Collapse>
            </div>
        );
    }
}
