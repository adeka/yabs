import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { observable, action, computed, autorun } from 'mobx';
import 'fa';
import Bookmark from './Bookmark';
import Collapse from 'react-collapse';
import Metascraper from 'metascraper';

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

@observer export default class BookmarkRow extends Bookmark {
    static propTypes = {
        bookmark: React.PropTypes.any,
        id: React.PropTypes.any,
        store: React.PropTypes.any
    }
    constructor(props) {
        super(props);
        const bookmark = this.props.bookmark;

        this.state = { collapsed: false };

        //title and URL
        this.imageURL = `chrome://favicon/${ bookmark.url }`;
        if (bookmark.title === bookmark.url) {
            this.title = bookmark.title.replace(/.*?:\/\//g, '').replace('www.', '');
        }

        //dates
        this.monthNames = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.date = new Date(bookmark.dateAdded);
        this.day = this.date.getDate();
        this.month = this.monthNames[this.date.getMonth()];
        this.year = this.date.getFullYear();
    }
    removeBookmark() {
        chrome.bookmarks.remove(this.props.id, () => {
            this.props.store.load();
        });
    }
    showInfo() {
        this.setState({ collapsed: !this.state.collapsed });
        /*
        chrome.storage.sync.get(this.props.id, (obj) => {
            const saved = obj[this.props.id];
            if (saved && saved.info) {
                console.log(saved.info);
                this.store.setInfo(<div className="info" >{saved.info}</div>);
            } else {
                const scrape = Metascraper.scrapeUrl(`${ window.location.href }/?url=${ this.props.bookmark.url }`);
                scrape.then((metadata) => {
                    const newBookmark = { };
                    newBookmark[this.props.id] = { info: metadata.description };
                    chrome.storage.sync.set(newBookmark);
                    this.store.setInfo(<div className="info" >{metadata.description}</div>);
                });
            }
        });
        */
    }
    render() {
        const bookmark = this.props.bookmark;
        let editStyle = 'fa fa-pencil edit';
        if (this.renaming) {
            editStyle = 'fa fa-pencil dark edit';
        } else {
            editStyle = 'fa fa-pencil edit';
        }
        return (
            <div className="bookmark">
                <div className="star">
                    <i className="fa fa-star star-back" />
                    <i className="fa fa-star star-front" />
                </div>
                <img src={this.imageURL} />
                {this.store.content}
                <i className="fa fa-remove delete" onDoubleClick={this.removeBookmark.bind(this)}/>
                <i className="fa fa-question-circle question" onClick={this.showInfo.bind(this)}/>
                <i className={editStyle} onClick={this.rename.bind(this)}/>
                <Collapse isOpened={this.state.collapsed}>
                    {this.store.info}
                </Collapse>
            </div>
        );
    }
}
