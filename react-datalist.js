var React = require('react')

/** OPTION **/

var ReactDatalistOption = React.createClass({
    render : function() {
        var classes = this.props.selected ? ['react-datalist-option', 'react-datalist-option-selected'] : ['react-datalist-option']
        return (
            React.DOM.div
            ({
                className : classes.join(' '),
                onClick   : this.handleClick
            }, this.props.option)
        )
    },
    handleClick : function(e) {
        this.props.select(this.props.index)
    }
})

/** DATALIST **/

var ReactDatalist = React.createClass({
    render : function() {
        var options  = this.props.options.map(function(option, index) {
            return this.props.support ? React.DOM.option({ value:option }) : ReactDatalistOption({
                option   : option, 
                index    : index,
                selected : (this.props.selected === index),
                select   : this.props.select
            })
        }.bind(this))
        var containerStyle = {}
        if (!this.props.support) {
            if (this.props.hide) containerStyle.display = 'none'
            else if (this.props.options.length == 0) containerStyle.display = 'none'
            else if (this.props.options.length == 1 && this.props.options[0] == this.props.filter) containerStyle.display = 'none'
            else containerStyle.display = 'block'
        }
        var Node = this.props.support ? React.DOM.datalist : React.DOM.div
        return (
            Node
            ({
                id        : this.props.id,
                className : "react-datalist",
                style     : containerStyle
            }, options)
        )
    }
})

/** STATEHOLDER **/

var box = React.createClass({
    render : function() {
        var options = this.filterOptions(this.props.options, this.state.filter, this.state.support)
        return (
            React.DOM.div
            ({
                className : "react-datalist-container"
            },[
                React.DOM.input
                ({
                    className : "react-datalist-input",
                    list      : this.props.list,
                    value     : this.state.filter,
                    onClick   : this.handleInputClick,
                    onChange  : this.handleInputChange,
                    onKeyDown : this.handleInputKeyDown
                }),
                ReactDatalist
                ({
                    id       : this.props.list,
                    force    : this.props.force,
                    support  : this.props.support,
                    hide     : this.state.hide,
                    filter   : this.state.filter,
                    selected : this.state.selected,
                    select   : this.selectOption,
                    options  : options
                })
            ])
        )
    },
    getInitialState : function() {
        var support = !!('list' in document.createElement('input')) && !!(document.createElement('datalist') && window.HTMLDataListElement)
        if (this.props.force) support = false
        return {
            filter   : this.props.filter,
            hide     : this.props.hideOptions,
            selected : false,
            support  : support
        }
    },
    componentWillReceiveProps : function(_new) {
        this.setState({
            filter   : (typeof _new.filter === 'string')         ? _new.filter      : this.state.filter,
            selected : (typeof _new.selected !== 'undefined')    ? _new.selected    : this.state.selected,
            hide     : (typeof _new.hideOptions !== 'undefined') ? _new.hideOptions : this.state.hideOptions,
        })
    },
    handleInputClick : function(event) {
        this.setState({ hide : false })
    },
    handleInputChange : function(event) {
        this.setState({ filter  : event.target.value })
        if (typeof this.props.onChange === 'function') this.props.onChange(event)
    },
    handleInputKeyDown : function(event) {
        switch(event.which) {
            case 40:
                // DOWN Arrow
                var newSelectedIndex  = this.state.selected === false ? 0 : this.state.selected + 1
                var availableOptions  = this.filterOptions(this.props.options, this.state.filter, this.state.support)
                if (newSelectedIndex >= availableOptions.length) newSelectedIndex = availableOptions.length - 1
                this.setState({
                    selected : newSelectedIndex
                })
                break
            case 38:
                // UP arrow
                var newSelectedIndex = this.state.selected > 0 ? this.state.selected - 1 : 0
                this.setState({selected : newSelectedIndex})
                break
            case 27:
                // ESC
                this.setState({
                    selected : false,
                    hide     : true,
                    filter   : this.state.hide ? "" : this.state.filter
                })
                break
            case 13:
                // ENTER
                if (this.state.selected === false) return
                this.selectOption(this.state.selected)
                break
        }
    },
    filterOptions : function(options, filter, support) {
        if (support)        return options
        if (!filter)        return options
        if (filter === '')  return options
        if (!options)       return []
        return options.filter(function(option) {
            return option.toLowerCase().indexOf(filter.toLowerCase()) >= 0
        })
    },
    selectOption : function(index) {
        var selected_option = this.filterOptions(this.props.options, this.state.filter, this.state.support)[index]
        if (typeof this.props.onOptionSelected === 'function') this.props.onOptionSelected(selected_option)
        this.setState({
            filter : selected_option
        })
    }
})

module.exports = box
