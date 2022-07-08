import React from "react";
import { action, computed } from "mobx";
import CesiumCartographic from "terriajs-cesium/Source/Core/Cartographic";
import Terria from "../../../../Models/Terria";
import ViewerMode from "../../../../Models/ViewerMode";
import ViewState from "../../../../ReactViewModels/ViewState";
import { GLYPHS } from "../../../../Styled/Icon";
import StyleTraits from "../../../../Traits/TraitsClasses/StyleTraits";
import MapNavigationItemController from "../../../../ViewModels/MapNavigation/MapNavigationItemController";


class BandProfile extends MapNavigationItemController {
	static id = "band-profile";
	static displayName = "BandProfile";
	itemRef: React.RefObject<HTMLDivElement> = React.createRef();

	constructor(private viewState: ViewState){
		super();
	}

	get glyph(): any {
		if (this.viewState.bandProfileActive) {
			return GLYPHS.bandOn;
		}
   		return GLYPHS.band;
	}

	get viewerMode(): ViewerMode | undefined {
		return undefined;
	}

	@action
	activate() {
		this.viewState.bandProfileActive = true;
	  super.activate();
	}

	@action
	deactivate() {
		this.viewState.bandProfileActive = false;
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

export default BandProfile;