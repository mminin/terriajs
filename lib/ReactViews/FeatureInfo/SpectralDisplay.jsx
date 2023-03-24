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

// Intended format: [[title],[image_id, lat, lon, reflectance:Y], [...], ...];
let csv = [];
let csvTitle = ["ImageID", "LAT", "LON", 540.840,580.760,620.690,660.610,700.540,730.480,750.440,770.400,790.370,810.330,830.290,850.250,870.210,890.170,910.140,930.100,950.060,970.020,989.980,1009.95,1029.91,1049.87,1069.83,1089.79,1109.76,1129.72,1149.68,1169.64,1189.60,1209.57,1229.53,1249.49,1269.45,1289.41,1309.38,1329.34,1349.30,1369.26,1389.22,1409.19,1429.15,1449.11,1469.07,1489.03,1508.99,1528.96,1548.92,1578.86,1618.79,1658.71,1698.63,1738.56,1778.48,1818.40,1858.33,1898.25,1938.18,1978.10,2018.02,2057.95,2097.87,2137.80,2177.72,2217.64,2257.57,2297.49,2337.42,2377.34,2417.26,2457.19,2497.11,2537.03,2576.96,2616.88,2656.81,2696.73,2736.65,2776.58,2816.50,2856.43,2896.35,2936.27,2976.200];


function spectralApiRequest(imageName, latitude, longitude){
	let link = "https://explore.jacobs-university.de/explore-api/get-spectra/?";

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

		const lat = that.props.viewState.spectralDataObject.lat;
		const lon = that.props.viewState.spectralDataObject.lon;

		let entry = lat + " / " +  lon;

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

			csv.length = 0;
			csv.unshift(csvTitle);
			csv.push([currentImage, lat, lon, dataObj.Y]);

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
			csv.push([currentImage, lat, lon, dataObj.Y]);

			that.props.viewState.incrementSpectralCounter();
		}
	}

	apiRequest(obj, newImg){
		const that = this;		
		let link = "https://explore.jacobs-university.de/explore-api/get-spectra/?";
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

	resetPlot(){
		const that = this;

		graphArray.length = 0;
		csv.length = 0;
		currentImage = "";
		that.props.viewState.nullifySpectralCounter();

		console.log("reset");
	}

	downloadCSV(){
		const that = this;

		let csvContent = "";

		csv.forEach(function(csvArray){
			let row = csvArray.join(";");
			csvContent += row + "\r\n";
		});

		csvContent = csvContent.replaceAll(',', ';').replace(/\./g, ',');

		let link = document.createElement("a");
		link.href = 'data:attachment/csv,' + encodeURIComponent(csvContent);
		link.target = '_blank';
		link.download = 'data.csv';
		document.body.appendChild(link);

		link.click();
	}

	render(){
		const style = {
			backgroundColor: "#fff",
			width: "800px",
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
					        	width: 800,
					        	height: 500,
					        	title: "Image: " + currentImage + ", Traces: " + this.props.viewState.spectralCounter + " (latitude/longitude)",
					        	showlegend: true,
					        	xaxis: {autorange: true,
											showgrid: true,
											zeroline: true,
											showline: true,
											mirror: 'ticks',
											gridcolor: '#bdbdbd',
											gridwidth: 2,
											autotick: false,
											ticks: 'outside',
											tick0: 500,
											dtick: 250,
											ticklen: 8,
											tickwidth: 4,
											tickcolor: '#000',
											title:"Wavelength (nm)"
													},
					        	yaxis: {autorange: true,
											showgrid: true,
											zeroline: true,
											showline: true,
											mirror: 'ticks',
											gridcolor: '#bdbdbd',
											gridwidth: 2,
											autotick: true,
											ticks: 'outside',
									    tick0: 0,
									    //dtick: 0.025,
									    ticklen: 8,
									    tickwidth: 4,
									    tickcolor: '#000',
											title: "Normalized Reflectance"
													},
					        }}
					        config={{
					        	scale: 1,
					        }}
					      />

					</div>
					<div className="plot-btn-group">
						<button onClick={()=>this.resetPlot()}><span>Reset</span></button>
						<button onClick={()=>this.downloadCSV()}><span>Download CSV</span></button>
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
