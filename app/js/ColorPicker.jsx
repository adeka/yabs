import React from 'react';
import ReactDOM from 'react-dom';
import Collapse from 'react-collapse';

export default class ColorPicker extends React.Component {
    static propTypes = {
        setColor: React.PropTypes.any
    }
    constructor(props) {
        super(props);
        const colors = [
            'grey', 'white', 'red',
            'tan', 'orange', 'skin',
            'gold', 'sun', 'sunflower',
            'yellow', 'spring', 'salad',
            'grass', 'green', 'emerald',
            'teal', 'beach', 'babyblue',
            'blue', 'navy', 'indigo',
            'violet', 'purple', 'plum',
            'magenta', 'pink'
        ];
        this.colorMap = colors.map((color, i) => {
            return <Color color={color} key={i} setColor={this.props.setColor} />;
        });
    }
    static propTypes = {
        collapsed: React.PropTypes.any
    }

    render() {
        return (
            <div className="colorPicker">
                <Collapse isOpened={this.props.collapsed}>
                    <div className="colorMap">
                        {this.colorMap}
                    </div>
                </Collapse>
            </div>
        );
    }
}

export class Color extends React.Component {
    constructor(props) {
        super(props);
        this.style = `color ${ this.props.color }`;
    }

    static propTypes = {
        color: React.PropTypes.any,
        setColor: React.PropTypes.any
    }
    setColor() {
        this.props.setColor(this.props.color);
    }
    render() {
        return (
            <div className={this.style} onClick={this.setColor.bind(this)}>
            </div>
        );
    }
}
