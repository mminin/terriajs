"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from "react";
import { observer } from "mobx-react";
import DragWrapper from "../DragWrapper";
import "./spectral-display.scss";
let rgbObj = {
    r: 0,
    g: 0,
    b: 0
};
let wavelengths = [540.8400, 580.7600, 620.6900, 660.6100, 700.5400, 730.4800, 750.4400, 770.4000, 790.3700, 810.3300, 830.2900, 850.2500, 870.2100, 890.1700, 910.1400, 930.1000, 950.0600, 970.0200, 989.9800, 1009.950, 1029.910, 1049.870, 1069.830, 1089.790, 1109.760, 1129.720, 1149.680, 1169.640, 1189.600, 1209.570, 1229.530, 1249.490, 1269.450, 1289.410, 1309.380, 1329.340, 1349.300, 1369.260, 1389.220, 1409.190, 1429.150, 1449.110, 1469.070, 1489.030, 1508.990, 1528.960, 1548.920, 1578.860, 1618.790, 1658.710, 1698.630, 1738.560, 1778.480, 1818.400, 1858.330, 1898.250, 1938.180, 1978.100, 2018.020, 2057.950, 2097.870, 2137.800, 2177.720, 2217.640, 2257.570, 2297.490, 2337.420, 2377.340, 2417.260, 2457.190, 2497.110, 2537.030, 2576.960, 2616.880, 2656.810, 2696.730, 2736.650, 2776.580, 2816.500, 2856.430, 2896.350, 2936.270, 2976.200];
function downloadJSON(obj) {
    let link = document.createElement("a");
    link.href = 'data:attachment/json,' + encodeURIComponent(JSON.stringify(obj));
    link.target = '_blank';
    link.download = 'band.json';
    document.body.appendChild(link);
    link.click();
}
function bandApiRequest(obj) {
    let link = "http://10.72.254.130:5000/band-comp/?";
    let params = {
        image_id: "M3_Valentine",
        R: obj.r,
        G: obj.g,
        B: obj.b,
    };
    Object.entries(params).forEach(([key, value]) => {
        // console.log(key, value);
        link = link.concat(key, "=", value, "&");
    });
    link = link.slice(0, -1);
    // console.log("link", link);
    fetch(link)
        .then((res) => res.json())
        .then((res) => {
        console.log("fetching data", res);
        downloadJSON(res);
    });
}
let BandDisplay = class BandDisplay extends React.Component {
    handleSubmit(e) {
        e.preventDefault();
        bandApiRequest(rgbObj);
    }
    redHandleChange(band) {
        rgbObj.r = band.target.value;
        console.log(rgbObj);
    }
    greenHandleChange(band) {
        rgbObj.g = band.target.value;
        console.log(rgbObj);
    }
    blueHandleChange(band) {
        rgbObj.b = band.target.value;
        console.log(rgbObj);
    }
    render() {
        const style = {
            backgroundColor: "#fff",
            width: "400px",
            height: "400px",
            display: "flex",
            flexDirection: "column",
            color: "#000",
            padding: "20px",
            boxSizing: "border-box",
        };
        const inputStyle = {
        // bacogroundColor: "#000",
        // color: "#fff",
        };
        const labelStyle = {
            marginBottom: "10px",
        };
        const submitBtn = {
            marginTop: "40px",
        };
        const values = wavelengths.map(num => (React.createElement("option", { value: Math.floor(num) }, Math.floor(num))));
        if (this.props.viewState.bandProfileActive) {
            return (React.createElement(DragWrapper, null,
                React.createElement("div", null,
                    React.createElement("form", { action: "", style: style, onSubmit: this.handleSubmit },
                        React.createElement("label", { style: labelStyle, htmlFor: "" }, "Red band TEST 20230220_1644:"),
                        React.createElement("select", { name: "R", onChange: this.redHandleChange },
                            React.createElement("option", { value: "0", style: { display: "none" }, defaultValue: true }),
                            values),
                        React.createElement("label", { style: labelStyle, htmlFor: "" }, "Green band:"),
                        React.createElement("select", { name: "G", onChange: this.greenHandleChange },
                            React.createElement("option", { value: "0", style: { display: "none" }, defaultValue: true }),
                            values),
                        React.createElement("label", { style: labelStyle, htmlFor: "" }, "Blue band:"),
                        React.createElement("select", { name: "B", onChange: this.blueHandleChange },
                            React.createElement("option", { value: "0", style: { display: "none" }, defaultValue: true }),
                            values),
                        React.createElement("button", { style: submitBtn, type: "submit" }, "Submit")))));
        }
        else {
            return (React.createElement("div", null));
        }
    }
};
BandDisplay = __decorate([
    observer
], BandDisplay);
export default BandDisplay;
//# sourceMappingURL=BandDisplay.js.map