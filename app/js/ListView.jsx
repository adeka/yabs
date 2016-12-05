import React from 'react';
import ReactDOM from 'react-dom';
import Collapse from 'react-collapse';
import { observer } from 'mobx-react';
import { observable, action, computed, autorun } from 'mobx';
import 'fa';
import BookmarkGroup from './BookmarkGroup';
import BookmarkRow from './BookmarkRow';

@observer export default class ListView extends React.Component {
    static propTypes = {
        store: React.PropTypes.any
    }
    constructor() {
        super();
        this.placeholder = document.createElement('div');
        this.placeholder.className = 'placeholder';
    }
    dragStart(e, index, id) {
        this.fromIndex = index;
        this.fromID = id;

        this.placeholder.style.display = 'inline-block';

        this.dragged = e.currentTarget;
        e.dataTransfer.effectAllowed = 'move';

        this.props.store.setPointerState('interior disabled');

    }
    dragEnd(e) {
        const from = Number(this.fromIndex);
        let to = Number(this.overID);
        if (this.nodePlacement === 'after') {
            to++;
        }

        const data = this.props.store.bookmarks;
        data.splice(to, 0, data.splice(from, 1)[0]);
        this.props.store.bookmarks = data;

        chrome.bookmarks.move(this.fromID, { index: to }, () => {
            this.props.store.load();
            this.over.parentNode.removeChild(this.placeholder);
            this.dragged.style.display = 'block';
        });

        this.props.store.setPointerState('interior');

    }
    dragOver(e, id) {
        e.preventDefault();
        if (e.target.className !== 'placeholder') {
            this.over = e.target;
            const relY = e.clientY - this.over.offsetTop;
            const height = this.over.offsetHeight / 2;
            const parent = e.target.parentNode;

            this.dragged.style.display = 'none';
            this.overID = id;

            if (relY > height) {
                this.nodePlacement = 'after';
                parent.insertBefore(this.placeholder, e.target.nextElementSibling);
            } else if (relY < height) {
                this.nodePlacement = 'before';
                parent.insertBefore(this.placeholder, e.target);
            }
        }
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
            return <BookmarkRow bookmark={bookmark} key={bookmark.id}/>;
        });
        this.folderLinks = folders.map((bookmark) => {
            const children = bookmark.children.map((child, i) => {
                return <BookmarkRow
                    bookmark={child}
                    key={child.id}
                    store={this.props.store}
                    id={child.id}
                />;
            });
            return (
                <BookmarkGroup
                    children={children}
                    key={bookmark.id}
                    bookmark={bookmark}
                    store={this.props.store}
                    id={bookmark.id}
                    dragStart={this.dragStart.bind(this)}
                    dragEnd={this.dragEnd.bind(this)}
                    dragOver={this.dragOver.bind(this)}
                    index={bookmark.index}
                />
            );
        });
        return (
            <div className="bookmarkList">
            {this.folderLinks}
            </div>
        );
    }
}
