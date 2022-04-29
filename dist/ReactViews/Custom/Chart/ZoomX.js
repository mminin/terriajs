var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observer } from "mobx-react";
import { zoom as d3Zoom } from "d3-zoom";
import { select as d3Select, event as d3Event } from "d3-selection";
import PropTypes from "prop-types";
import React from "react";
let ZoomX = class ZoomX extends React.Component {
    constructor(props) {
        super(props);
        this.zoom = d3Zoom()
            .scaleExtent(props.scaleExtent)
            .translateExtent(props.translateExtent)
            .on("zoom", () => props.onZoom(d3Event.transform.rescaleX(this.props.initialScale)));
    }
    componentDidMount() {
        d3Select(this.props.surface).call(this.zoom);
    }
    render() {
        return this.props.children;
    }
};
ZoomX.propTypes = {
    initialScale: PropTypes.func.isRequired,
    scaleExtent: PropTypes.array.isRequired,
    translateExtent: PropTypes.array.isRequired,
    children: PropTypes.node,
    onZoom: PropTypes.func.isRequired,
    surface: PropTypes.string.isRequired // selector for querying the zoom surface
};
ZoomX = __decorate([
    observer
], ZoomX);
export default ZoomX;
//# sourceMappingURL=ZoomX.js.map