import React from "react";
import { action, computed } from "mobx";
import CesiumCartographic from "terriajs-cesium/Source/Core/Cartographic";
import Terria from "../../../../Models/Terria";
import ViewerMode from "../../../../Models/ViewerMode";
import ViewState from "../../../../ReactViewModels/ViewState";
import { GLYPHS } from "../../../../Styled/Icon";
import StyleTraits from "../../../../Traits/TraitsClasses/StyleTraits";
import MapNavigationItemController from "../../../../ViewModels/MapNavigation/MapNavigationItemController";

export let spectralActive = false;

export function setSpectralActive(val: boolean){
	spectralActive = val;
}

export function spectralApiRequest(imageName: string, latitude: string, longitude: string, that: any){
	let link = "http://10.72.254.130:5000/get-spectra/?";
	let params = {
		image_id: imageName,
		lat: latitude,
		lon: longitude,
	}
		
	Object.entries(params).forEach(([key, value]) => {
		console.log(key, value);
		link = link.concat(key, "=", value, "&");
	});

	link = link.slice(0, -1);
	console.log(link);

	fetch(link)
	.then(response => response.json())
	.then(data => {
		console.log("api req:", data);
		that.props.viewState.setSpectralX(data.X);
		that.props.viewState.setSpectralY(data.Y);
		console.log("api x:", that.props.viewState.spectralX);
		console.log("api y:", that.props.viewState.spectralY);
		return data;
	});
}

class SpectralProfile extends MapNavigationItemController {
	static id = "spectral-profile";
	static displayName = "SpectralProfile";
	itemRef: React.RefObject<HTMLDivElement> = React.createRef();

	constructor(private viewState: ViewState){
		super();
		setSpectralActive(this.active);
	}

	get glyph(): any {
		if (spectralActive) {
			return GLYPHS.spectralOn;
		}
   		return GLYPHS.spectral;
	}

	get viewerMode(): ViewerMode | undefined {
		return undefined;
	}

	@action
	activate() {
		setSpectralActive(true);
		this.viewState.spectralProfileActive = true;
		console.log("activating");
	  super.activate();
	}

	@action
	deactivate() {
		setSpectralActive(false);
		this.viewState.spectralProfileActive = false;
		console.log("deactivating");
		super.deactivate();
	}

	isActive(){
		return this.active;
	}

	handleClick(){
		if (this.active){
			this.deactivate();
		} else {
			this.activate();
		}
	}

}

export default SpectralProfile;