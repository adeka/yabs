import React from 'react';
import ReactDOM from 'react-dom';
import Collapse from 'react-collapse';
import { observer } from 'mobx-react';
import { observable, action, computed, autorun } from 'mobx';
import 'fa';
import BookmarkRow from './BookmarkRow';
import Bookmark from './Bookmark';

@observer export default class BookmarkGroup extends Bookmark {
    constructor(props) {
        super(props);
        let state = JSON.parse(localStorage.getItem(this.props.bookmark.id));
        if (!state) {
            state = false;
        }
        this.state = { collapsed: state };
    }
    static propTypes = {
        children: React.PropTypes.any,
        bookmark: React.PropTypes.any,
        store: React.PropTypes.any,
        id: React.PropTypes.any
    }
    expand() {
        if (!this.renaming) {
            this.setState({ collapsed: !this.state.collapsed }, () => {
                localStorage.setItem(this.props.bookmark.id, this.state.collapsed);
            });
        }
    }
    addBookmark() {
        const id = this.props.bookmark.id;
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            const url = tabs[0].url;
            const bookmark = {
                parentId: id,
                index: 0,
                title: url,
                url: url
            };
            chrome.bookmarks.create(bookmark);
            if (!this.state.collapsed) {
                this.expand();
            }
            this.props.store.load();
        });
    }
    removeFolder() {
        const id = this.props.bookmark.id;
        if (this.props.bookmark.children.length === 0) {
            chrome.bookmarks.remove(id, () => {
                this.props.store.load();
            });
        }
    }
    render() {
        return (
            <div className="bookmarkGroup">
                <div className="header">
                    <div onClick={this.expand.bind(this)}>
                    {this.store.content}
                    </div>
                    <i className="fa fa-plus" onClick={this.addBookmark.bind(this)}/>
                    <i className="fa fa-pencil" onClick={this.rename.bind(this)}/>
                    <i className="fa fa-remove" onClick={this.removeFolder.bind(this)}/>
                </div>
                <Collapse isOpened={this.state.collapsed}>
                    {this.props.children}
                </Collapse>
            </div>
        );
    }
}
