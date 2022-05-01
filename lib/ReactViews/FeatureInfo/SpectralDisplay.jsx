"use strict";

import React, { useState, useEffect } from "react";
import Plot from 'react-plotly.js';
import PropTypes from "prop-types";

import { observer } from "mobx-react";
import { action } from "mobx";

import DragWrapper from "../DragWrapper";
import "./spectral-display.scss";

import { spectralActive } from "../Map/Navigation/Items/SpectralProfile";

// First set of colors to appear, then plotly puts its own colors
const colors = [
	"red",
	"yellow",
	"blue",
	"green",
	"brown",
	"orange",
	"purple"
];

let dataObj = {
	Y:[],
	X:[]
};

let graphArray = [
	{
		x: [],
		y: [],
		type: 'scatter',
		mode: 'lines+markers',
        marker: {color: 'red'},
    }
];

let currentImage = "";

function spectralApiRequest(imageName, latitude, longitude){
	let link = "http://10.72.254.130:5000/get-spectra/?";
	let params = {
		image_id: imageName,
		lat: latitude,
		lon: longitude,
	};
		
	Object.entries(params).forEach(([key, value]) => {
		// console.log(key, value);
		link = link.concat(key, "=", value, "&");
	});

	link = link.slice(0, -1);
	// console.log("link", link);



}

@observer
export default class SpectralDisplay extends React.Component {
	static PropTypes = {
		viewState: PropTypes.object.isRequired,
	};

	updateData(obj, newImg){
		const that = this;

		dataObj.X = obj.X;
		dataObj.Y = obj.Y;
		console.log("setting dataObj ", dataObj);

		let entry = that.props.viewState.spectralDataObject.lat + " / " +  that.props.viewState.spectralDataObject.lat;

 		if(newImg){
			// that.props.viewState.nullifyArray();
			// that.props.viewState.addObjectToSpectralArray(obj);
			graphArray.length = 0;
			graphArray.push({
	          	x: dataObj.X,
	          	y: dataObj.Y,
	          	name: entry,
	          	type: 'scatter',
	          	mode: 'lines+markers',
	          	marker: {color: colors[that.props.viewState.spectralCounter]}
	        });
			that.props.viewState.nullifySpectralCounter();	
			that.props.viewState.incrementSpectralCounter();
		} else {
			graphArray.push({
	          	x: dataObj.X,
	          	y: dataObj.Y,
	          	name: entry,
	          	type: 'scatter',
	          	mode: 'lines+markers',
	          	marker: {color: colors[that.props.viewState.spectralCounter]}
	        });
			// that.props.viewState.addObjectToSpectralArray(obj);
			that.props.viewState.incrementSpectralCounter();
		}
	}

	apiRequest(obj, newImg){
		const that = this;
		let link = "http://10.72.254.130:5000/get-spectra/?";
		let params = {
			image_id: obj.image_id,
			lat: obj.lat,
			lon: obj.lon,
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
			this.updateData(res, newImg);
		});
	}

	render(){
		const style = {
			backgroundColor: "#fff",
			width: "500px",
			height: "500px"
		};


		/* when we allow changes, to avoid repeating the calls, 
		   for some reason the render is invoked multiple times */
		if (this.props.viewState.spectralAtomic){
			/*if currentImage and newImage are different*/
			if(currentImage != this.props.viewState.spectralDataObject.image_id){
				console.log("Nullifying the array");

				this.apiRequest(
		        	this.props.viewState.spectralDataObject,
		        	true
		        );

				currentImage = this.props.viewState.spectralDataObject.image_id;

				this.props.viewState.setSpectralAtomic(false);
			} else {
				console.log("Adding to array")

				this.apiRequest(
		        	this.props.viewState.spectralDataObject,
		        	false
		        );
				
				this.props.viewState.setSpectralAtomic(false);
			}
		}


		console.log(graphArray);
		

		if (this.props.viewState.spectralProfileActive){
			return(
				<DragWrapper>
					<div style={style}>
						<Plot
					        data={graphArray}
					        layout={{
					        	width: 500, 
					        	height: 500, 
					        	title: "Image: " + currentImage + ", Traces: " + this.props.viewState.spectralCounter + " (latitude/longitude)",
					        	showlegend: true,
					        	xaxis: {autorange: true},
					        	yaxis: {autorange: true},
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


