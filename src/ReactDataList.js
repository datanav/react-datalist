import React          from 'react'
import ReactDOM       from 'react-dom'
import DataList       from './components/DataList'
import DataListOption from './components/DataListOption'
import layout         from './styles/react-datalist.styl'

const native = !!('list' in document.createElement('input')) && !!(document.createElement('datalist') && window.HTMLDataListElement)

export const ReactDataList = React.createClass({
    getInitialState() {
        return {
            filter   : this.props.defaultValue || '',
            hide     : true,
            selected : false,
            support  : native
        }
    },
    getDefaultProps() {
        return {
            options     : [],
            type        : 'text',
            blurTimeout : 200
        }
    },
    render() {
        var options      = this.filterOptions(this.props.options, this.state.filter, native)
        var extraClasses = this.props.className? ' ' + this.props.className: '';
        var layoutstyle  = (!native) ? <style>{layout}</style> : null

        return (
            <div className="react-datalist-container">
                {layoutstyle}
                <input ref="theInput"
                        id={this.props.id}
                        type={this.props.type}
                        list={this.props.list}
                        value={this.state.filter}
                        className={"react-datalist-input"+extraClasses}
                        placeholder={this.props.placeholder}
                        onBlur={this.handleInputBlur}
                        onKeyUp={this.handleInputKeyUp}
                        onClick={this.handleInputClick}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleInputKeyDown}
                />
                <DataList ref="theDatalist"
                    id={this.props.list}
                    hide={this.state.hide}
                    filter={this.state.filter}
                    select={this.selectFilteredOption}
                    options={options}
                    selected={this.state.selected}
                    useNative={native}
                />
            </div>
        )
    },
    handleInputBlur(event) {
        if (!native) {
            setTimeout(() => this.setState({ hide : true }), this.props.blurTimeout)
        }
        if (typeof this.props.onBlur === 'function') this.props.onBlur(event)
    },
    handleInputClick(event) {
        if (!native) {
            this.setState({ hide : false })
        }
        if (typeof this.props.onClick === 'function') this.props.onClick(event)
    },
    handleInputChange(event) {

        let newState = { filter: event.target.value };

        if (!native) {
            newState.selected = false;
            newState.hide = false;
        }

        this.setState(newState);
        if (typeof this.props.onChange === 'function') this.props.onChange(event)
    },
    handleInputKeyDown(event) {
        if (!native) {
            switch(event.which) {
                case 40:
                    // DOWN Arrow
                    var newSelectedIndex  = this.state.selected === false ? 0 : this.state.selected + 1
                    var availableOptions  = this.filterOptions(this.props.options, this.state.filter, native)
                    if (newSelectedIndex >= availableOptions.length) newSelectedIndex = availableOptions.length - 1
                    this.setState({
                        selected : newSelectedIndex,
                        hide     : false
                    })
                    return
                case 38:
                    // UP arrow
                    var newSelectedIndex = this.state.selected > 0 ? this.state.selected - 1 : 0
                    this.setState({selected : newSelectedIndex})
                    return
                case 13:
                    // ENTER
                    if (!this.state.hide) {
                        if (typeof this.state.selected === 'number') {
                            this.selectFilteredOption(this.state.selected)
                        }
                        else {
                            this.selectOption(event.target.value)
                        }
                        return
                    }
            }
            if (typeof this.props.onKeyDown === 'function') this.props.onKeyDown(event)
        }
    },
    handleInputKeyUp(event) {
        if (!native && this.state.hide && event.which == 27) {
            // ESC
            this.setState({
                selected : false,
                hide     : true,
                filter   : this.state.hide ? "" : this.state.filter
            })
        }
        if (typeof this.props.onKeyUp === 'function') this.props.onKeyUp(event)
    },
    filterOptions(options, filter, support) {
        if (support)        return options
        if (!filter)        return options
        if (filter === '')  return options
        if (!options)       return []
        return options.filter(function(option) {
            var normalised_option = (typeof option === 'string') ? option.toLowerCase() : '';
            return normalised_option.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
        })
    },
    selectFilteredOption(index) {
        this.selectOption(this.filterOptions(this.props.options, this.state.filter, native)[index])
    },
    selectOption(value) {
        var selected_option;
        var lowercase_value = (typeof value === 'string') ? value.toLowerCase() : '';
        this.props.options.forEach(function(option) {
            if (typeof option === 'string') {
                if (option.toLowerCase() === lowercase_value) {
                    selected_option = option;
                }
            }
            else if (option === null && lowercase_value === '') {
                selected_option = '';
            }
        });
        if (typeof selected_option === 'undefined') return;
        if (typeof this.props.onOptionSelected === 'function') this.props.onOptionSelected(selected_option)
        this.setState({
            filter   : selected_option,
            selected : false,
            hide     : true
        })
    },
    componentDidUpdate(prevProps, prevState) {

        if (!native && prevState.filter !== this.state.filter) {

            let event = new Event('change', { bubbles: true });
            this.refs.theInput.dispatchEvent(event);

            if (typeof this.props.onChange === 'function') {
                this.props.onChange(event);
            }
        }
    },
    componentWillMount() {
        if (typeof this.props.getController === 'function') {
            this.props.getController({
                setFilter     : function(value,callback) { this.setState({filter : value}, callback) }.bind(this),
                toggleOptions : function(callback)       { var hide = !this.state.hide; this.setState({filter : '', hide : hide}, function() { if (typeof callback === 'function') callback(!hide) }) }.bind(this),
                getState      : function()               { return {
                    hide     : this.state.hide,
                    filter   : this.state.filter,
                    selected : this.state.selected,
                    options  : this.filterOptions(this.props.options, this.state.filter, native)
                }}.bind(this),
                setState      : function(state,callback) { this.setState(state, callback) }.bind(this)
            })
        }
    },
    componentDidMount() {
        if (native) return
        if (this.props.autoPosition === false) return

        /** POSITION **/

        setTimeout(function() {
            if (this.refs.theInput == undefined) return // <- Tests are too fast!
            if (this.refs.theDatalist == undefined) return // <- Tests are too fast!
            var _input    = ReactDOM.findDOMNode(this.refs.theInput)
            var _datalist = ReactDOM.findDOMNode(this.refs.theDatalist)
            var pos       = this.findPos(_input)

            _datalist.style.position = 'absolute'
            _datalist.style.top      = pos[0] + _input.offsetHeight
            _datalist.style.left     = pos[1]
            _datalist.style.minWidth = (_input.offsetWidth - 2) + 'px'
        }.bind(this),50)
    },
    findPos(element) {
      if (element) {
        var parentPos = this.findPos(element.offsetParent);
        return [ parentPos[0] + element.offsetTop, parentPos[1] + element.offsetLeft]
      } else {
        return [0,0];
      }
    }
});
