'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReactDataList = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _DataList = require('./components/DataList');

var _DataList2 = _interopRequireDefault(_DataList);

var _DataListOption = require('./components/DataListOption');

var _DataListOption2 = _interopRequireDefault(_DataListOption);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var layout = '.react-datalist {   margin: 0 !important;   border: 1px solid #a1c1e7;   max-height: 500px;   overflow-x: scroll;   z-index: 1;   background-color: #fff; } .react-datalist .react-datalist-option {   display: block;   margin: 0 !important;   width: 94%;   padding: 3%;   cursor: pointer; } .react-datalist .react-datalist-option:hover {   background-color: #bad4fe; } .react-datalist .react-datalist-option.react-datalist-option-selected {   background-color: #bad4fe; } ';


var native = !!('list' in document.createElement('input')) && !!(document.createElement('datalist') && window.HTMLDataListElement);

var ReactDataList = exports.ReactDataList = function (_React$Component) {
    _inherits(ReactDataList, _React$Component);

    function ReactDataList() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, ReactDataList);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ReactDataList.__proto__ || Object.getPrototypeOf(ReactDataList)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            filter: _this.props.defaultValue || '',
            hide: true,
            selected: false,
            support: native
        }, _this.handleInputBlur = function (event) {
            if (!native) {
                setTimeout(function () {
                    return _this.setState({ hide: true });
                }, _this.props.blurTimeout);
            }
            if (typeof _this.props.onBlur === 'function') _this.props.onBlur(event);
        }, _this.handleInputClick = function (event) {
            if (!native) {
                _this.setState({ hide: false });
            }
            if (typeof _this.props.onClick === 'function') _this.props.onClick(event);
        }, _this.handleInputChange = function (event) {

            var newState = { filter: event.target.value };

            if (!native) {
                newState.selected = false;
                newState.hide = false;
            }

            _this.setState(newState);
            if (typeof _this.props.onChange === 'function') _this.props.onChange(event);
        }, _this.handleInputKeyDown = function (event) {
            if (!native) {
                switch (event.which) {
                    case 40:
                        // DOWN Arrow
                        var newSelectedIndex = _this.state.selected === false ? 0 : _this.state.selected + 1;
                        var availableOptions = _this.filterOptions(_this.props.options, _this.state.filter, native);
                        if (newSelectedIndex >= availableOptions.length) newSelectedIndex = availableOptions.length - 1;
                        _this.setState({
                            selected: newSelectedIndex,
                            hide: false
                        });
                        return;
                    case 38:
                        // UP arrow
                        var newSelectedIndex = _this.state.selected > 0 ? _this.state.selected - 1 : 0;
                        _this.setState({ selected: newSelectedIndex });
                        return;
                    case 13:
                        // ENTER
                        if (!_this.state.hide) {
                            if (typeof _this.state.selected === 'number') {
                                _this.selectFilteredOption(_this.state.selected);
                            } else {
                                _this.selectOption(event.target.value);
                            }
                            return;
                        }
                }
                if (typeof _this.props.onKeyDown === 'function') _this.props.onKeyDown(event);
            }
        }, _this.handleInputKeyUp = function (event) {
            if (!native && _this.state.hide && event.which == 27) {
                // ESC
                _this.setState({
                    selected: false,
                    hide: true,
                    filter: _this.state.hide ? "" : _this.state.filter
                });
            }
            if (typeof _this.props.onKeyUp === 'function') _this.props.onKeyUp(event);
        }, _this.filterOptions = function (options, filter, support) {
            if (support) return options;
            if (!filter) return options;
            if (filter === '') return options;
            if (!options) return [];
            return options.filter(function (option) {
                var normalised_option = typeof option === 'string' ? option.toLowerCase() : '';
                return normalised_option.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
            });
        }, _this.selectFilteredOption = function (index) {
            _this.selectOption(_this.filterOptions(_this.props.options, _this.state.filter, native)[index]);
        }, _this.selectOption = function (value) {
            var selected_option;
            var lowercase_value = typeof value === 'string' ? value.toLowerCase() : '';
            _this.props.options.forEach(function (option) {
                if (typeof option === 'string') {
                    if (option.toLowerCase() === lowercase_value) {
                        selected_option = option;
                    }
                } else if (option === null && lowercase_value === '') {
                    selected_option = '';
                }
            });
            if (typeof selected_option === 'undefined') return;
            if (typeof _this.props.onOptionSelected === 'function') _this.props.onOptionSelected(selected_option);
            _this.setState({
                filter: selected_option,
                selected: false,
                hide: true
            });
        }, _this.findPos = function (element) {
            if (element) {
                var parentPos = _this.findPos(element.offsetParent);
                return [parentPos[0] + element.offsetTop, parentPos[1] + element.offsetLeft];
            } else {
                return [0, 0];
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ReactDataList, [{
        key: 'render',
        value: function render() {
            var options = this.filterOptions(this.props.options, this.state.filter, native);
            var extraClasses = this.props.className ? ' ' + this.props.className : '';
            var layoutstyle = !native ? _react2.default.createElement(
                'style',
                null,
                layout
            ) : null;

            return _react2.default.createElement(
                'div',
                { className: 'react-datalist-container' },
                layoutstyle,
                _react2.default.createElement('input', { ref: 'theInput',
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
                _react2.default.createElement(_DataList2.default, { ref: 'theDatalist',
                    id: this.props.list,
                    hide: this.state.hide,
                    filter: this.state.filter,
                    select: this.selectFilteredOption,
                    options: options,
                    selected: this.state.selected,
                    useNative: native
                })
            );
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {

            if (!native && prevState.filter !== this.state.filter) {

                var event = new Event('change', { bubbles: true });
                this.refs.theInput.dispatchEvent(event);

                if (typeof this.props.onChange === 'function') {
                    this.props.onChange(event);
                }
            }

            if (this.props.defaultValue !== prevState.defaultValue) {
                this.setState({ filter: this.props.defaultValue || '' });
            }
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            if (typeof this.props.getController === 'function') {
                this.props.getController({
                    setFilter: function (value, callback) {
                        this.setState({ filter: value }, callback);
                    }.bind(this),
                    toggleOptions: function (callback) {
                        var hide = !this.state.hide;this.setState({ filter: '', hide: hide }, function () {
                            if (typeof callback === 'function') callback(!hide);
                        });
                    }.bind(this),
                    getState: function () {
                        return {
                            hide: this.state.hide,
                            filter: this.state.filter,
                            selected: this.state.selected,
                            options: this.filterOptions(this.props.options, this.state.filter, native)
                        };
                    }.bind(this),
                    setState: function (state, callback) {
                        this.setState(state, callback);
                    }.bind(this)
                });
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (native) return;
            if (this.props.autoPosition === false) return;

            /** POSITION **/

            setTimeout(function () {
                if (this.refs.theInput == undefined) return; // <- Tests are too fast!
                if (this.refs.theDatalist == undefined) return; // <- Tests are too fast!
                var _input = _reactDom2.default.findDOMNode(this.refs.theInput);
                var _datalist = _reactDom2.default.findDOMNode(this.refs.theDatalist);
                var pos = this.findPos(_input);

                _datalist.style.position = 'absolute';
                _datalist.style.top = pos[0] + _input.offsetHeight;
                _datalist.style.left = pos[1];
                _datalist.style.minWidth = _input.offsetWidth - 2 + 'px';
            }.bind(this), 50);
        }
    }]);

    return ReactDataList;
}(_react2.default.Component);

ReactDataList.defaultProps = {
    options: [],
    type: 'text',
    blurTimeout: 200
};