import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { observable, action, computed, autorun } from 'mobx';
import 'fa';

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

class BookmarkStore {
    @observable content = <div></div>;
    @action setContent(content) {
        this.content = content;
    }
}

@observer export default class Bookmark extends React.Component {
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
