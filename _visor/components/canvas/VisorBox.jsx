import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PluginPlaceholderVisor from './VisorPluginPlaceholder';
import { isSortableBox, isAncestorOrSibling } from '../../../common/utils';

export default class VisorBox extends Component {
    constructor(props) {
        super(props);
        this.borderSize = 2;
    }
    componentDidUpdate(prevProps, prevState) {
        let toolbar = this.props.toolbars[this.props.id];
        let pluginAPI = Ediphy.Visor.Plugins[toolbar.pluginId];
        let config = pluginAPI.getConfig(toolbar.pluginId);
        if(config.needsTextEdition && window.MathJax) {
            window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
        }
    }
    render() {
        let cornerSize = 15;
        let box = this.props.boxes[this.props.id];
        let toolbar = this.props.toolbars[this.props.id];
        let pluginAPI = Ediphy.Visor.Plugins[toolbar.pluginId];
        let config = pluginAPI.getConfig(toolbar.pluginId);
        let style = {};

        let attrs = {};
        let classNames = "";

        let width = toolbar.structure.width;
        let height = toolbar.structure.height;
        let widthUnit = toolbar.structure.widthUnit;
        let heightUnit = toolbar.structure.heightUnit;
        if (toolbar.state.__text) {
            style.textAlign = "left";
        }

        // pass currentState  of component if exists
        if(this.props.richElementsState && this.props.richElementsState[box.id] !== undefined) {
            toolbar.state.currentState = this.props.richElementsState[box.id];
        }

        let rotate = 'rotate(0deg)';
        if (toolbar.structure.rotation && toolbar.structure.rotation) {
            rotate = 'rotate(' + toolbar.structure.rotation + 'deg)';
        }

        style.transform = style.WebkitTransform = style.MsTransform = rotate;
        style = { ...style, ...toolbar.style };

        /* TODO: Reassign object if it's rich to have marks as property box.content.props*/

        let props = { ...this.props, parentBox: this.props.boxes[this.props.id], setAnswer: (correctAnswer) => {
            this.props.setAnswer(this.props.id, correctAnswer, this.props.currentView);
        } };
        let content = config.flavor === "react" ? (
            <div style={style} {...attrs} className={"boxStyle " + classNames} ref={"content"}>
                {pluginAPI.getRenderTemplate(toolbar.state, box.id, props)}
            </div>
        ) : (
            <div style={style} {...attrs} className={"boxStyle " + classNames} ref={"content"}>
                {this.renderChildren(Ediphy.Visor.Plugins.get(toolbar.pluginId).export(toolbar.state, toolbar.pluginId, box.children.length !== 0, this.props.id), 0)}
            </div>
        );

        let classes = "wholeboxvisor";
        if (box.container) {
            classes += " dnd" + box.container;
        }

        if (box.height === 'auto') {
            classes += " automaticallySizedBox";
        }

        let verticalAlign = "top";

        let wholeBoxVisorStyle = {
            position: box.position.type,
            left: box.position.x ? box.position.x : "",
            top: box.position.y ? box.position.y : "",
            width: width !== "auto" ? (width + widthUnit) : "auto",
            height: height !== "auto" ? (height + heightUnit) : "auto",
            verticalAlign: verticalAlign,
        };

        wholeBoxVisorStyle.transform = wholeBoxVisorStyle.WebkitTransform = wholeBoxVisorStyle.MsTransform = rotate;

        return (
            <div className={classes} id={'box-' + this.props.id}
                style={wholeBoxVisorStyle}>
                {content}

            </div>
        );
    }

    __getMarkKeys(marks) {
        let markKeys = {};
        Object.keys(marks).map((mark) =>{
            let inner_mark = marks[mark];
            let value = inner_mark.value.toString();
            markKeys[value] = inner_mark.connection;
        });
        return markKeys;
    }

    renderChildren(markup, key) {
        let component;
        let props = {};
        let children = null;
        switch (markup.node) {
        case 'element':
            if (markup.attr) {
                props = markup.attr;
            }
            props.key = key;
            if (markup.tag === 'plugin') {
                component = PluginPlaceholderVisor;
                let resizable = markup.attr.hasOwnProperty("plugin-data-resizable");
                props = Object.assign({}, props, {
                    pluginContainer: markup.attr["plugin-data-id"],
                    resizable: resizable,
                    parentBox: this.props.boxes[this.props.id],
                    boxes: this.props.boxes,
                    toolbars: this.props.toolbars,
                    richElementsState: this.props.richElementsState,
                    changeCurrentView: this.props.changeCurrentView,
                    currentView: this.props.currentView,
                });
            } else {
                component = markup.tag;
            }
            break;
        case 'text':
            component = "span";
            props = { key: key };
            children = [decodeURI(markup.text)];
            break;
        case 'root':
            component = "div";
            props = { style: { width: '100%', height: '100%' } };
            break;
        }

        Object.keys(props).forEach(prop => {
            if (prop.startsWith("on")) {
                let value = props[prop];
                if (typeof value === "string") {
                    // eslint-disable-next-line
                    props[prop] = new Function(value);
                }
            }
        });

        if (markup.child) {
            if (markup.child.length === 1 && markup.child[0].node === "text") {
                props.dangerouslySetInnerHTML = {
                    __html: decodeURI(markup.child[0].text),
                };
            } else {
                children = [];
                markup.child.forEach((child, index) => {
                    children.push(this.renderChildren(child, index));
                });
            }
        }
        return React.createElement(component, props, children);
    }
}

VisorBox.propTypes = {
    /**
     * Identificador de la caja
     */
    id: PropTypes.string.isRequired,
    /**
     * Diccionario que contiene todas las cajas
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Cambia la vista actual
     */
    changeCurrentView: PropTypes.func.isRequired,
    /**
     * Diccionario que contiene todas las toolbars
     */
    toolbars: PropTypes.object,
    /**
     * Estado del plugin enriquecido en la transición
     */
    richElementsState: PropTypes.object,
    /**
   * Function for submitting a page Quiz
   */
    setAnswer: PropTypes.func,
    /**
   * Vista actual
   */
    currentView: PropTypes.any,
};
