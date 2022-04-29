"use strict";

import React, { useState, useEffect } from "react";
import Plot from 'react-plotly.js';
import PropTypes from "prop-types";

import { observer } from "mobx-react";
import { action } from "mobx";

import DragWrapper from "../DragWrapper";
import "./spectral-display.scss";

import { spectralActive } from "../Map/Navigation/Items/SpectralProfile";

let currentData = {
	image_id: null,
	lat: null,
	lon: null
};

export function updateCurrentData(imageName, latitude, longitude){
	currentData = {
		image_id: imageName,
		lat: latitude,
		lon: longitude
	};

	console.log("updated data: ", currentData);
}

let dataObj;

function spectralApiRequest(imageName, latitude, longitude){
	let link = "http://10.72.254.130:5000/get-spectra/?";
	let params = {
		image_id: imageName,
		lat: latitude,
		lon: longitude,
	}
		
	Object.entries(params).forEach(([key, value]) => {
		// console.log(key, value);
		link = link.concat(key, "=", value, "&");
	});

	link = link.slice(0, -1);
	// console.log("link", link);

	fetch(link)
	.then(response => response.json())
	.then(data => {
		dataObj = Object.assign({}, data);
		// console.log(data);
		console.log("data object:", dataObj);
	});
	return dataObj;
}

@observer
export default class SpectralDisplay extends React.Component {
	static PropTypes = {
		viewState: PropTypes.object.isRequired,
	};

	constructor(){
		super();
		this.state = {
			spectralData:Object.assign({}, spectralApiRequest("M3_Archytas", "50", "100")),
		};

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(){
		console.log(this.props.viewState.spectralProfileActive);
		this.setState({
			spectralData:Object.assign({}, spectralApiRequest(currentData.image_id, currentData.lat, currentData.lon)),
		});
	}

	render(){
		const style = {
			backgroundColor: "#fff",
			width: "500px",
			height: "500px"
		};

		if (this.props.viewState.spectralProfileActive){
			return(
				<DragWrapper>
					<button onClick={this.handleClick}>reload values</button>
					<div style={style}>
						<Plot
					        data={[
					          {
					            x: this.state.spectralData["X"],
					            y: this.state.spectralData["Y"],
					            type: 'scatter',
					            mode: 'lines+markers',
					            marker: {color: 'red'},
					          }
					        ]}
					        layout={{
					        	width: 500, 
					        	height: 500, 
					        	title: this.state.spectralData["NAME"],
					        	showlegend: false,
					        	xaxis: {autorange: true},
					        	yaxis: {autorange: true}
					        }}
					        config={{
					        	scale: 1,
					        }}
					      />
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