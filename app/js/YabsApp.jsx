import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed, autorun } from 'mobx';

class BookmarkStore {
    @observable bookmarks = [];
    setBookmarks(bookmarks) {
        this.bookmarks = bookmarks;
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
        this.bookmarkStore = new BookmarkStore();
        //DONT FORGET TO DO .bind(this) ITS VERY IMPORTANT IN ES6 LOL :killme:
        chrome.bookmarks.getTree(this.setupBookmarks.bind(this));
        this.bookmarkTree = [];
        //console.log(chrome.bookmarks);
    }
    setupBookmarks(bookmarks) {
        //retarded way of accessing "Bookmarks Bar" array of children
        const bookmarkTree = bookmarks[0].children[0].children;
        this.bookmarkStore.setBookmarks(bookmarkTree);
        // console.log(this.bookmarkStore);
    }
    render() {
        // console.log(this.bookmarkTree);
        return (
            <div>
                <BookmarkList bookmarkStore={this.bookmarkStore} />
            </div>
        );
    }
}

@observer class BookmarkList extends React.Component {
    static propTypes = {
        bookmarkStore: React.PropTypes.any
    }

    render() {
        const bookmarks = this.props.bookmarkStore.bookmarks;
        const topLevel = [];
        const folders = [];
        bookmarks.forEach((value) => {
            if (!value.children) {
                topLevel.push(value);
            } else {
                folders.push(value);
            }
        });
        console.log(topLevel);
        this.topLevelLinks = topLevel.map((bookmark, i) => {
            return <Bookmark bookmark={bookmark} key={bookmark.id}/>;
        });
        this.folderLinks = folders.map((folder) => {
            const children = folder.children.map((child) => {
                return <Bookmark bookmark={child} key={child.id}/>;
            });
            return (
                <div className="bookmarkGroup" key={folder.id}>
                    <div className="header">{folder.title}</div>
                    {children}
                </div>
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

class Bookmark extends React.Component {
    static propTypes = {
        bookmark: React.PropTypes.any
    }
    render() {
        const bookmark = this.props.bookmark;
        const imageURL = `chrome://favicon/${ bookmark.url }`;
        let title = bookmark.title;
        if (bookmark.title === bookmark.url) {
            title = bookmark.title.replace(/.*?:\/\//g, '').replace('www.', '');
        }
        const monthNames = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const date = new Date(bookmark.dateAdded);
        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        return (
            <a className="bookmark" href={title}>
                <img src={imageURL} />
                <div className="title">{title}</div>
                <div className="date">{`${ day }, ${ month }`}</div>
            </a>
        );
    }
}
