import React from 'react';
import ReactDOM from 'react-dom';
import Collapse from 'react-collapse';
import { observer } from 'mobx-react';
import { observable, action, computed, autorun } from 'mobx';
import 'fa';
import BookmarkRow from './BookmarkRow';
import Bookmark from './Bookmark';
import ColorPicker from './ColorPicker';

@observer export default class BookmarkGroup extends Bookmark {
    constructor(props) {
        super(props);
        let state = JSON.parse(localStorage.getItem(this.props.bookmark.id));
        if (!state) {
            state = false;
        }
        this.state = { collapsed: state, showColors: false };

        chrome.storage.sync.get(props.id, (obj) => {
            const bookmark = obj[props.id];
            if (bookmark && bookmark.color) {
                this.setState({ style: `fa fa-folder ${ bookmark.color }` });
            } else {
                this.setState({ style: 'fa fa-folder white' });
            }
        });
    }
    static propTypes = {
        children: React.PropTypes.any,
        bookmark: React.PropTypes.any,
        store: React.PropTypes.any,
        id: React.PropTypes.any,
        index: React.PropTypes.any
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
    showColors() {
        this.setState({ showColors: !this.state.showColors });
    }
    setColor(color) {
        this.setState({ style: `fa fa-folder ${ color }` });
        const updateBookmark = { };
        updateBookmark[this.props.id] = { 'color': color };
        chrome.storage.sync.set(updateBookmark);
        this.showColors();
    }
    dragStart(e) {
        this.props.dragStart(e, this.props.index, this.props.id);
    }
    dragOver(e) {
        this.props.dragOver(e, this.props.index);
    }
    render() {
        return (
            <div className="bookmarkGroup white"
                draggable="true"
                onDragStart={this.dragStart.bind(this)}
                onDragEnd={this.props.dragEnd}
                onDragOver={this.dragOver.bind(this)}>
                <div className={this.props.store.pointerState}>
                    <div className="header">
                        <i className={this.state.style}/>
                        <div onClick={this.expand.bind(this)}>
                        {this.store.content}
                        </div>
                        <div className="wrap">
                            <i className="fa fa-plus" onClick={this.addBookmark.bind(this)}/>
                            <i className="fa fa-pencil" onClick={this.rename.bind(this)}/>
                            <i className="fa fa-remove" onClick={this.removeFolder.bind(this)}/>
                            <i className="fa fa-paint-brush" onClick={this.showColors.bind(this)}/>
                        </div>
                    </div>
                    <ColorPicker collapsed={this.state.showColors} setColor={this.setColor.bind(this)}/>
                    <Collapse isOpened={this.state.collapsed}>
                        {this.props.children}
                    </Collapse>
                </div>
            </div>
        );
    }
}
