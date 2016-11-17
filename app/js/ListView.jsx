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
                    data-id={i}
                />;
            });
            return (
                <BookmarkGroup children={children} key={bookmark.id} bookmark={bookmark} store={this.props.store} id={bookmark.id} />
            );
        });
        return (
            <div className="bookmarkList">
            {this.folderLinks}
            </div>
        );
    }
}
