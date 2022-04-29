"use strict";
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import PointParameterEditor from "./PointParameterEditor";
import LineParameterEditor from "./LineParameterEditor";
// import RectangleParameterEditor from "./RectangleParameterEditor";
import PolygonParameterEditor from "./PolygonParameterEditor";
import RegionParameterEditor from "./RegionParameterEditor";
import RegionTypeParameterEditor from "./RegionTypeParameterEditor";
import RegionDataParameterEditor from "./RegionDataParameterEditor";
import BooleanParameterEditor from "./BooleanParameterEditor";
import BooleanParameterGroupEditor from "./BooleanParameterGroupEditor";
import DateTimeParameterEditor from "./DateTimeParameterEditor";
import EnumerationParameterEditor from "./EnumerationParameterEditor";
import GenericParameterEditor from "./GenericParameterEditor";
import GeoJsonParameterEditor from "./GeoJsonParameterEditor";
import defined from "terriajs-cesium/Source/Core/defined";
import Styles from "./parameter-editors.scss";
import InfoParameterEditor from "./InfoParameterEditor";
import parseCustomMarkdownToReact from "../Custom/parseCustomMarkdownToReact";
const ParameterEditor = createReactClass({
    displayName: "ParameterEditor",
    propTypes: {
        parameter: PropTypes.object,
        viewState: PropTypes.object,
        previewed: PropTypes.object,
        parameterViewModel: PropTypes.object
    },
    fieldId: new Date().getTime(),
    renderLabel() {
        return (React.createElement("div", null,
            React.createElement("label", { key: this.props.parameter.id, className: Styles.label, htmlFor: this.fieldId + this.props.parameter.type },
                this.props.parameter.name,
                this.props.parameter.isRequired && React.createElement("span", null, " (required)")),
            typeof this.props.parameter.description === "string" &&
                this.props.parameter.description !== ""
                ? parseCustomMarkdownToReact(this.props.parameter.description, {
                    parameter: this.props.parameter
                })
                : ""));
    },
    renderEditor() {
        for (let i = 0; i < ParameterEditor.parameterTypeConverters.length; ++i) {
            const converter = ParameterEditor.parameterTypeConverters[i];
            const editor = converter.parameterTypeToDiv(this.props.parameter.type, this);
            if (defined(editor)) {
                return (React.createElement("div", { style: {
                        color: this.props.parameter.isValid ? "inherit" : "#ff0000"
                    } }, editor));
            }
        }
        const genericEditor = ParameterEditor.parameterTypeConverters.filter(function (item) {
            return item.id === "generic";
        })[0];
        return genericEditor.parameterTypeToDiv("generic", this);
    },
    render() {
        return (React.createElement("div", { id: this.fieldId + this.props.parameter.type, className: Styles.fieldParameterEditor }, this.renderEditor()));
    }
});
ParameterEditor.parameterTypeConverters = [
    {
        id: "point",
        parameterTypeToDiv: function PointParameterToDiv(type, parameterEditor) {
            if (type === this.id) {
                return (React.createElement("div", null,
                    parameterEditor.renderLabel(),
                    React.createElement(PointParameterEditor, { previewed: parameterEditor.props.previewed, viewState: parameterEditor.props.viewState, parameter: parameterEditor.props.parameter, parameterViewModel: parameterEditor.props.parameterViewModel })));
            }
        }
    },
    {
        id: "line",
        parameterTypeToDiv: function LineParameterToDiv(type, parameterEditor) {
            if (type === this.id) {
                return (React.createElement("div", null,
                    parameterEditor.renderLabel(),
                    React.createElement(LineParameterEditor, { previewed: parameterEditor.props.previewed, viewState: parameterEditor.props.viewState, parameter: parameterEditor.props.parameter, parameterViewModel: parameterEditor.props.parameterViewModel })));
            }
        }
    },
    // {
    //   id: "rectangle",
    //   parameterTypeToDiv: function RectangleParameterToDiv(
    //     type,
    //     parameterEditor
    //   ) {
    //     if (type === this.id) {
    //       return (
    //         <div>
    //           {parameterEditor.renderLabel()}
    //           <RectangleParameterEditor
    //             previewed={parameterEditor.props.previewed}
    //             viewState={parameterEditor.props.viewState}
    //             parameter={parameterEditor.props.parameter}
    //             parameterViewModel={parameterEditor.props.parameterViewModel}
    //           />
    //         </div>
    //       );
    //     }
    //   }
    // },
    {
        id: "polygon",
        parameterTypeToDiv: function PolygonParameterToDiv(type, parameterEditor) {
            if (type === this.id) {
                return (React.createElement("div", null,
                    parameterEditor.renderLabel(),
                    React.createElement(PolygonParameterEditor, { previewed: parameterEditor.props.previewed, viewState: parameterEditor.props.viewState, parameter: parameterEditor.props.parameter, parameterViewModel: parameterEditor.props.parameterViewModel })));
            }
        }
    },
    {
        id: "enumeration",
        parameterTypeToDiv: function EnumerationParameterToDiv(type, parameterEditor) {
            if (type === this.id) {
                return (React.createElement("div", null,
                    parameterEditor.renderLabel(),
                    React.createElement(EnumerationParameterEditor, { previewed: parameterEditor.props.previewed, viewState: parameterEditor.props.viewState, parameter: parameterEditor.props.parameter, parameterViewModel: parameterEditor.props.parameterViewModel })));
            }
        }
    },
    {
        id: "dateTime",
        parameterTypeToDiv: function DateTimeParameterToDiv(type, parameterEditor) {
            if (type === this.id) {
                return (React.createElement("div", null,
                    parameterEditor.renderLabel(),
                    React.createElement(DateTimeParameterEditor, { previewed: parameterEditor.props.previewed, parameter: parameterEditor.props.parameter, parameterViewModel: parameterEditor.props.parameterViewModel })));
            }
        }
    },
    {
        id: "region",
        parameterTypeToDiv: function RegionParameterToDiv(type, parameterEditor) {
            if (type === this.id) {
                return (React.createElement("div", null,
                    parameterEditor.renderLabel(),
                    React.createElement(RegionParameterEditor, { previewed: parameterEditor.props.previewed, viewState: parameterEditor.props.viewState, parameter: parameterEditor.props.parameter, parameterViewModel: parameterEditor.props.parameterViewModel })));
            }
        }
    },
    {
        id: "regionType",
        parameterTypeToDiv: function RegionTypeParameterToDiv(type, parameterEditor) {
            if (type === this.id) {
                const regionParam = parameterEditor.props.previewed.parameters.filter(function (param) {
                    return (defined(param.regionTypeParameter) &&
                        param.regionTypeParameter === parameterEditor.props.parameter);
                })[0];
                return (React.createElement("div", null,
                    React.createElement(If, { condition: regionParam === undefined },
                        parameterEditor.renderLabel(),
                        React.createElement(RegionTypeParameterEditor, { previewed: parameterEditor.props.previewed, parameter: parameterEditor.props.parameter, parameterViewModel: parameterEditor.props.parameterViewModel })),
                    React.createElement(If, { condition: !parameterEditor.props.parameter.showInUi },
                        React.createElement("div", { className: "Placeholder for regionType" }))));
            }
        }
    },
    {
        id: "regionData",
        parameterTypeToDiv: function RegionDataParameterToDiv(type, parameterEditor) {
            if (type === this.id) {
                return (React.createElement("div", null,
                    parameterEditor.renderLabel(),
                    React.createElement(RegionDataParameterEditor, { previewed: parameterEditor.props.previewed, parameter: parameterEditor.props.parameter, parameterViewModel: parameterEditor.props.parameterViewModel })));
            }
        }
    },
    {
        id: "boolean",
        parameterTypeToDiv: function BooleanParameterToDiv(type, parameterEditor) {
            if (type === this.id) {
                return (React.createElement("div", null,
                    parameterEditor.props.parameter.hasNamedStates &&
                        parameterEditor.renderLabel(),
                    React.createElement(BooleanParameterEditor, { previewed: parameterEditor.props.previewed, parameter: parameterEditor.props.parameter, parameterViewModel: parameterEditor.props.parameterViewModel })));
            }
        }
    },
    {
        id: "boolean-group",
        parameterTypeToDiv: function BooleanParameterGroupToDiv(type, parameterEditor) {
            if (type === this.id) {
                return (React.createElement("div", null,
                    parameterEditor.renderLabel(),
                    React.createElement(BooleanParameterGroupEditor, { previewed: parameterEditor.props.previewed, parameter: parameterEditor.props.parameter, parameterViewModel: parameterEditor.props.parameterViewModel })));
            }
        }
    },
    {
        id: "geojson",
        parameterTypeToDiv: function GeoJsonParameterToDiv(type, parameterEditor) {
            if (type === this.id) {
                return (React.createElement("div", null,
                    parameterEditor.renderLabel(),
                    React.createElement(GeoJsonParameterEditor, { previewed: parameterEditor.props.previewed, viewState: parameterEditor.props.viewState, parameter: parameterEditor.props.parameter })));
            }
        }
    },
    {
        id: "info",
        parameterTypeToDiv: function GenericParameterToDiv(type, parameterEditor) {
            if (type === this.id) {
                return (React.createElement("div", null,
                    parameterEditor.renderLabel(),
                    React.createElement(InfoParameterEditor, { previewed: parameterEditor.props.previewed, parameter: parameterEditor.props.parameter, parameterViewModel: parameterEditor.props.parameterViewModel })));
            }
        }
    },
    {
        id: "generic",
        parameterTypeToDiv: function GenericParameterToDiv(type, parameterEditor) {
            if (type === this.id) {
                return (React.createElement("div", null,
                    parameterEditor.renderLabel(),
                    React.createElement(GenericParameterEditor, { previewed: parameterEditor.props.previewed, parameter: parameterEditor.props.parameter, parameterViewModel: parameterEditor.props.parameterViewModel })));
            }
        }
    }
];
module.exports = ParameterEditor;
//# sourceMappingURL=ParameterEditor.js.map