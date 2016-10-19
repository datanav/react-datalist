'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _componentsDataList = require('./components/DataList');

var _componentsDataList2 = _interopRequireDefault(_componentsDataList);

var _componentsDataListOption = require('./components/DataListOption');

var _componentsDataListOption2 = _interopRequireDefault(_componentsDataListOption);

var layout = '.react-datalist {\n  margin: 0 !important;\n  border: 1px solid #a1c1e7;\n  max-height: 500px;\n  overflow-x: scroll;\n  z-index: 1;\n  background-color: #fff;\n}\n.react-datalist .react-datalist-option {\n  display: block;\n  margin: 0 !important;\n  width: 94%;\n  padding: 3%;\n  cursor: pointer;\n}\n.react-datalist .react-datalist-option:hover {\n  background-color: #bad4fe;\n}\n.react-datalist .react-datalist-option.react-datalist-option-selected {\n  background-color: #bad4fe;\n}\n';

var native = !!('list' in document.createElement('input')) && !!(document.createElement('datalist') && window.HTMLDataListElement);

var ReactDataList = _react2['default'].createClass({
    displayName: 'ReactDataList',

    getInitialState: function getInitialState() {
        return {
            filter: this.props.defaultValue || '',
            hide: true,
            selected: false,
            support: native
        };
    },
    getDefaultProps: function getDefaultProps() {
        return {
            options: [],
            type: 'text',
            blurTimeout: 200
        };
    },
    render: function render() {
        var options = this.filterOptions(this.props.options, this.state.filter, native);
        var extraClasses = this.props.className ? ' ' + this.props.className : '';
        var layoutstyle = !native ? _react2['default'].createElement(
            'style',
            null,
            layout
        ) : null;

        return _react2['default'].createElement(
            'div',
            { className: 'react-datalist-container' },
            layoutstyle,
            _react2['default'].createElement('input', { ref: 'theInput',
                id: this.props.id,
                type: this.props.type,
                list: this.props.list,
                value: this.state.filter,
                className: "react-datalist-input" + extraClasses,
                placeholder: this.props.placeholder,
                onBlur: this.handleInputBlur,
                onKeyUp: this.handleInputKeyUp,
                onClick: this.handleInputClick,
                onChange: this.handleInputChange,
                onKeyDown: this.handleInputKeyDown
            }),
            _react2['default'].createElement(_componentsDataList2['default'], { ref: 'theDatalist',
                id: this.props.list,
                hide: this.state.hide,
                filter: this.state.filter,
                select: this.selectFilteredOption,
                options: options,
                selected: this.state.selected,
                useNative: native
            })
        );
    },
    handleInputBlur: function handleInputBlur(event) {
        var _this = this;

        if (!native) {
            setTimeout(function () {
                return _this.setState({ hide: true });
            }, this.props.blurTimeout);
        }
        if (typeof this.props.onBlur === 'function') this.props.onBlur(event);
    },
    handleInputClick: function handleInputClick(event) {
        if (!native) {
            this.setState({ hide: false });
        }
        if (typeof this.props.onClick === 'function') this.props.onClick(event);
    },
    handleInputChange: function handleInputChange(event) {

        var newState = { filter: event.target.value };

        if (!native) {
            newState.selected = false;
            newState.hide = false;
        }

        this.setState(newState);
        if (typeof this.props.onChange === 'function') this.props.onChange(event);
    },
    handleInputKeyDown: function handleInputKeyDown(event) {
        if (!native) {
            switch (event.which) {
                case 40:
                    // DOWN Arrow
                    var newSelectedIndex = this.state.selected === false ? 0 : this.state.selected + 1;
                    var availableOptions = this.filterOptions(this.props.options, this.state.filter, native);
                    if (newSelectedIndex >= availableOptions.length) newSelectedIndex = availableOptions.length - 1;
                    this.setState({
                        selected: newSelectedIndex,
                        hide: false
                    });
                    return;
                case 38:
                    // UP arrow
                    var newSelectedIndex = this.state.selected > 0 ? this.state.selected - 1 : 0;
                    this.setState({ selected: newSelectedIndex });
                    return;
                case 13:
                    // ENTER
                    if (!this.state.hide) {
                        if (typeof this.state.selected === 'number') {
                            this.selectFilteredOption(this.state.selected);
                        } else {
                            this.selectOption(event.target.value);
                        }
                        return;
                    }
            }
            if (typeof this.props.onKeyDown === 'function') this.props.onKeyDown(event);
        }
    },
    handleInputKeyUp: function handleInputKeyUp(event) {
        if (!native && this.state.hide && event.which == 27) {
            // ESC
            this.setState({
                selected: false,
                hide: true,
                filter: this.state.hide ? "" : this.state.filter
            });
        }
        if (typeof this.props.onKeyUp === 'function') this.props.onKeyUp(event);
    },
    filterOptions: function filterOptions(options, filter, support) {
        if (support) return options;
        if (!filter) return options;
        if (filter === '') return options;
        if (!options) return [];
        return options.filter(function (option) {
            return option.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
        });
    },
    selectFilteredOption: function selectFilteredOption(index) {
        this.selectOption(this.filterOptions(this.props.options, this.state.filter, native)[index]);
    },
    selectOption: function selectOption(value) {
        var selected_option;
        this.props.options.forEach(function (option, index) {
            if (option.toLowerCase() === value.toLowerCase()) selected_option = option;
        });
        if (typeof selected_option === 'undefined') return;
        if (typeof this.props.onOptionSelected === 'function') this.props.onOptionSelected(selected_option);
        this.setState({
            filter: selected_option,
            selected: false,
            hide: true
        });
    },
    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {

        if (!native && prevState.filter !== this.state.filter) {

            var _event = new Event('change', { bubbles: true });
            this.refs.theInput.dispatchEvent(_event);

            if (typeof this.props.onChange === 'function') {
                this.props.onChange(_event);
            }
        }
    },
    componentWillMount: function componentWillMount() {
        if (typeof this.props.getController === 'function') {
            this.props.getController({
                setFilter: (function (value, callback) {
                    this.setState({ filter: value }, callback);
                }).bind(this),
                toggleOptions: (function (callback) {
                    var hide = !this.state.hide;this.setState({ filter: '', hide: hide }, function () {
                        if (typeof callback === 'function') callback(!hide);
                    });
                }).bind(this),
                getState: (function () {
                    return {
                        hide: this.state.hide,
                        filter: this.state.filter,
                        selected: this.state.selected,
                        options: this.filterOptions(this.props.options, this.state.filter, native)
                    };
                }).bind(this),
                setState: (function (state, callback) {
                    this.setState(state, callback);
                }).bind(this)
            });
        }
    },
    componentDidMount: function componentDidMount() {
        if (native) return;
        if (this.props.autoPosition === false) return;

        /** POSITION **/

        setTimeout((function () {
            if (this.refs.theInput == undefined) return; // <- Tests are too fast!
            if (this.refs.theDatalist == undefined) return; // <- Tests are too fast!
            var _input = _reactDom2['default'].findDOMNode(this.refs.theInput);
            var _datalist = _reactDom2['default'].findDOMNode(this.refs.theDatalist);
            var pos = this.findPos(_input);

            _datalist.style.position = 'absolute';
            _datalist.style.top = pos[0] + _input.offsetHeight;
            _datalist.style.left = pos[1];
            _datalist.style.minWidth = _input.offsetWidth - 2 + 'px';
        }).bind(this), 50);
    },
    findPos: function findPos(element) {
        if (element) {
            var parentPos = this.findPos(element.offsetParent);
            return [parentPos[0] + element.offsetTop, parentPos[1] + element.offsetLeft];
        } else {
            return [0, 0];
        }
    }
});
exports.ReactDataList = ReactDataList;