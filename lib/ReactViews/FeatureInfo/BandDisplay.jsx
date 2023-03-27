"use strict";

import React, { useState, useEffect } from "react";
import Plot from 'react-plotly.js';
import PropTypes from "prop-types";

import { observer } from "mobx-react";
import { action } from "mobx";

import DragWrapper from "../DragWrapper";
import "./spectral-display.scss";

let rgbObj = {
	r: 0,
	g: 0,
	b: 0
}

let wavelengths = [540.8400, 580.7600, 620.6900, 660.6100, 700.5400, 730.4800, 750.4400, 770.4000, 790.3700, 810.3300, 830.2900, 850.2500, 870.2100, 890.1700, 910.1400, 930.1000, 950.0600, 970.0200, 989.9800, 1009.950, 1029.910, 1049.870, 1069.830, 1089.790, 1109.760, 1129.720, 1149.680, 1169.640, 1189.600, 1209.570, 1229.530, 1249.490, 1269.450, 1289.410, 1309.380, 1329.340, 1349.300, 1369.260, 1389.220, 1409.190, 1429.150, 1449.110, 1469.070, 1489.030, 1508.990, 1528.960, 1548.920, 1578.860, 1618.790, 1658.710, 1698.630, 1738.560, 1778.480, 1818.400, 1858.330, 1898.250, 1938.180, 1978.100, 2018.020, 2057.950, 2097.870, 2137.800, 2177.720, 2217.640, 2257.570, 2297.490, 2337.420, 2377.340, 2417.260, 2457.190, 2497.110, 2537.030, 2576.960, 2616.880, 2656.810, 2696.730, 2736.650, 2776.580, 2816.500, 2856.430, 2896.350, 2936.270, 2976.200];

let converages = ["M3_Archytas","M3_Valentine"];

function downloadJSON(obj){
	let link = document.createElement("a");
	link.href = 'data:attachment/json,' + encodeURIComponent(JSON.stringify(obj));
	link.target = '_blank';
	link.download = 'band.json';
	document.body.appendChild(link);
	link.click();
}

function bandApiRequest(obj){
		//let link = "http://10.72.254.130:5000/band-comp/?";
		let link = "https://explore.jacobs-university.de/explore-api/band-comp/?";
		let params = {
			//image_id: "M3_Valentine",
			//image_id: "M3_Archytas",
			image_id: obj.image_id,
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
		// ERROR ON NEXT LINES: 
		// call to downloadJSON(res) fails with
		// Each child in a list should have a unique "key" prop
		fetch(link)
		.then((res) => res.json())
		.then((res) => {
			console.log("fetching data", res);
			downloadJSON(res);
		});
	}

@observer
export default class BandDisplay extends React.Component {
	handleSubmit(e){
		e.preventDefault();
		bandApiRequest(rgbObj);
	}

	imageIdHandleChange(image_id){
		rgbObj.image_id = image_id.target.value;
		console.log(image_id); 
	}

	redHandleChange(band){
		rgbObj.r = band.target.value;
		console.log(rgbObj); 
	}

	greenHandleChange(band){
		rgbObj.g = band.target.value;
		console.log(rgbObj); 
	}

	blueHandleChange(band){
		rgbObj.b = band.target.value;
		console.log(rgbObj); 
	}


	render(){
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
		}

		const labelStyle = {
			marginBottom: "10px",
		}

		const submitBtn = {
			marginTop: "40px",
		}

		const values = wavelengths.map(num => (
			<option value={Math.floor(num)}>{Math.floor(num)}</option>
		));

		const cov_values = converages.map(cov => (
			<option value={cov}>{cov}</option>
		));

		if (this.props.viewState.bandProfileActive){
			return (
				<DragWrapper>
						<div>
							<form action="" style={style} onSubmit={this.handleSubmit}>

								<label style={labelStyle} htmlFor="">Coverage</label>
								<select name="image_id" onChange={this.imageIdHandleChange} >
									<option value="0" style={{display: "none"}} defaultValue></option>
									{cov_values}
								</select>

								<label style={labelStyle} htmlFor="">Red band</label>
								<select name="R" onChange={this.redHandleChange} >
									<option value="0" style={{display: "none"}} defaultValue></option>
									{values}
								</select>

								<label style={labelStyle} htmlFor="">Green band:</label>
								<select name="G" onChange={this.greenHandleChange}>
									<option value="0" style={{display: "none"}} defaultValue></option>
									{values}
								</select>

								<label style={labelStyle} htmlFor="">Blue band:</label>
								<select name="B" onChange={this.blueHandleChange}>
									<option value="0" style={{display: "none"}} defaultValue></option>
									{values}
								</select>

								<button style={submitBtn} type="submit">
									Submit
								</button>
							</form>
						</div>
				</DragWrapper>
			);
		} else {
			return(
				<div></div>
			);
		}
	}
} 
