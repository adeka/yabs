import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { observable, action, computed, autorun } from 'mobx';

class BookmarkStore extends React.Component  {
    @observable content = <div></div>;
    @action setContent(content) {
        this.content = content;
    }
}

@observer export default class Bookmark extends React.Component {
    static propTypes = {
        bookmark: React.PropTypes.any,
        id: React.PropTypes.any
    }
    constructor(props) {
        super(props);
        this.title = this.props.bookmark.title;
        this.store = new BookmarkStore();
        this.renaming = false;
        this.setDefaultContent();
    }
    setDefaultContent() {
        const content =
        <a href={this.props.bookmark.url} target="_blank">
            <div className="title">{this.title}</div>
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
    onChange() {

    }
    rename() {
        this.renaming = !this.renaming;
        if (this.renaming) {
            this.setInputContent();
        } else {
            this.setDefaultContent();
        }
    }
}
