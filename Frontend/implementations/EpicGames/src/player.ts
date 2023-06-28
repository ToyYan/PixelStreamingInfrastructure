// Copyright Epic Games, Inc. All Rights Reserved.

import { Config, PixelStreaming } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.2';
import { Application, PixelStreamingApplicationStyle, UIElementCreationMode } from '@epicgames-ps/lib-pixelstreamingfrontend-ui-ue5.2';
const PixelStreamingApplicationStyles =
    new PixelStreamingApplicationStyle();
PixelStreamingApplicationStyles.applyStyleSheet();

document.body.onload = function() {
	// Example of how to set the logger level
	// Logger.SetLoggerVerbosity(10);

	const initialSettings = {
		MinQP: 10,
		MaxQP: 40,
		HoveringMouse: !('ontouchend' in document),
		Resolution: '2K'
	};

	// Create a config object
	const config = new Config({ initialSettings, useUrlParams: false });

	// Create a Native DOM delegate instance that implements the Delegate interface class
	const stream = new PixelStreaming(config);
	const application = new Application({
		stream,
		statsPanelConfig: {
			isEnabled: false,
			visibilityButtonConfig: {
				creationMode: UIElementCreationMode.Disable
			}
		},
		onColorModeChanged: (isLightMode) => PixelStreamingApplicationStyles.setColorMode(isLightMode)
	});
	// document.getElementById("centrebox").appendChild(application.rootElement);
	document.body.appendChild(application.rootElement);
}
