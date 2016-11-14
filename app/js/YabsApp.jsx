import React from 'react';
import ReactDOM from 'react-dom';
import Collapse from 'react-collapse';
import { observer } from 'mobx-react';
import { observable, action, computed, autorun } from 'mobx';
import 'fa';

class BookmarkListStore {
    @observable bookmarks = [];
    load() {
        chrome.bookmarks.getTree(this.assignBookmarks.bind(this));
    }
    assignBookmarks(bookmarks) {
        //retarded way of accessing "Bookmarks Bar" array of children
        const bookmarkTree = bookmarks[0].children[0].children;
        //this.bookmarks.length = 0;
        this.bookmarks = bookmarkTree;
        //console.log(bookmarkTree);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }
}


/*
Bookmark chrome api schema
-children (if it is a folder)
-dateAdded
-dateGroupModified
-id
-index
-parentID
-title
-url (if it isn not a folder)
*/

export default class YabsApp extends React.Component {
    constructor() {
        super();
        this.store = new BookmarkListStore();
        this.store.load();
        //console.log(chrome.bookmarks);
    }
    render() {
        // console.log(this.bookmarkTree);
        return (
            <div>
            <ListView store={this.store} />
            </div>
        );
    }
}

@observer class ListView extends React.Component {
    static propTypes = {
        store: React.PropTypes.any
    }
    dragStart(e) {
        this.dragged = e.currentTarget;
        e.dataTransfer.effectAllowed = 'move';

        // Firefox requires calling dataTransfer.setData
        // for the drag to properly work
        e.dataTransfer.setData('text/html', e.currentTarget);
        console.log('asdf');
    }
    dragEnd() {

    }
    render() {
        const bookmarks = this.props.store.bookmarks;
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
                    store={this.props.store}
                    id={child.id}
                    data-id={i}
                    draggable="true"
                    onDragEnd={this.dragEnd}
                    onDragStart={this.dragStart.bind(this)}
                />;
            });
            return (
                <BookmarkGroup children={children} key={folder.id} folder={folder} store={this.props.store}/>
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

class BookmarkStore {
    @observable content = <div></div>;
    @action setContent(content) {
        this.content = content;
    }
}


@observer class Bookmark extends React.Component {
    static propTypes = {
        bookmark: React.PropTypes.any,
        id: React.PropTypes.any,
        store: React.PropTypes.any
    }
    constructor(props) {
        super(props);
        const bookmark = this.props.bookmark;

        //title and URL
        this.imageURL = `chrome://favicon/${ bookmark.url }`;
        this.title = bookmark.title;
        if (bookmark.title === bookmark.url) {
            this.title = bookmark.title.replace(/.*?:\/\//g, '').replace('www.', '');
        }

        //dates
        this.monthNames = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.date = new Date(bookmark.dateAdded);
        this.day = this.date.getDate();
        this.month = this.monthNames[this.date.getMonth()];
        this.year = this.date.getFullYear();

        this.store = new BookmarkStore();

        this.renaming = false;
        this.setDefaultContent();
    }
    removeBookmark() {
        chrome.bookmarks.remove(this.props.id, () => {
            this.props.store.load();
        });
    }
    handleKeyPress(event) {
        if (event.key === 'Enter') {
            const val = this.nameField.value;
            const changes = {
                title: val
            };
            if (val.length > 0) {
                chrome.bookmarks.update(this.props.id, changes, () => {
                    this.title = val;
                    this.renaming = false;
                    this.setDefaultContent();
                });
            }
        }
    }
    setInputField(field) {
        this.nameField = field;
    }
    setDefaultContent() {
        const content =
        <a href={this.props.bookmark.url} target="_blank">
            <div className="title">{this.title}</div>
            <div className="date">{`${ this.day }, ${ this.month }`}</div>
        </a>;
        this.store.setContent(content);
    }
    setInputContent() {
        const content =
        <input
            className="title"
            placeholder={this.props.bookmark.title}
            onChange={this.onChange.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
            ref={this.setInputField.bind(this)}
            autoFocus
        ></input>;
        this.store.setContent(content);
    }
    renameBookmark() {
        this.renaming = !this.renaming;
        if (this.renaming) {
            this.setInputContent();
        } else {
            this.setDefaultContent();
        }
    }
    onChange() {

    }
    render() {
        const bookmark = this.props.bookmark;
        let editStyle = 'fa fa-pencil';
        if (this.renaming) {
            editStyle = 'fa fa-pencil dark';
        } else {
            editStyle = 'fa fa-pencil';
        }
        return (
            <div className="bookmark">
                <img src={this.imageURL} />
                {this.store.content}
                <i className="fa fa-remove" onClick={this.removeBookmark.bind(this)}/>
                <i className={editStyle} onClick={this.renameBookmark.bind(this)}/>
            </div>
        );
    }
}
