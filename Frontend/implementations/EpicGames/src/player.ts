// Copyright Epic Games, Inc. All Rights Reserved.

import { Config, Flags, Logger, PixelStreaming } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.2';
import { Application, PixelStreamingApplicationStyle, UIElementCreationMode } from '@epicgames-ps/lib-pixelstreamingfrontend-ui-ue5.2';
const PixelStreamingApplicationStyles =
    new PixelStreamingApplicationStyle();
PixelStreamingApplicationStyles.applyStyleSheet();

document.body.onload = function() {
	// Example of how to set the logger level
	Logger.SetLoggerVerbosity(5);

	const initialSettings = {
		MinQP: 25,
		MaxQP: 45,
		WebRTCFPS: 30,
		HoveringMouse: !('ontouchend' in document),
		Resolution: '1080P',
	};

	// Create a config object
	const config = new Config({ initialSettings, useUrlParams: false });

	// Create a Native DOM delegate instance that implements the Delegate interface class
	const stream = new PixelStreaming(config);
	stream.addEventListener('initialSettings', () => {
		stream.webRtcController.sendEncoderMinQP(initialSettings.MinQP);
		stream.webRtcController.sendEncoderMaxQP(initialSettings.MaxQP);
		stream.webRtcController.sendWebRTCFps(initialSettings.WebRTCFPS);
		stream.webRtcController.setMouseInputEnabled(config.isFlagEnabled(Flags.MouseInput));
		stream.webRtcController.setKeyboardInputEnabled(config.isFlagEnabled(Flags.KeyboardInput));
		const resMap: Record<string, [number, number]> = {
			'1080P': [1920, 1080],
			'2K': [2560, 1440]
		};
		const [width, height] = resMap[initialSettings.Resolution];
		stream.webRtcController.sendResolution(width, height);
		(window as any).stream = stream;
		if (location.search) {
			const url = new URLSearchParams(location.search);
			if (url.has('userToken')) {
				const token = url.get('userToken');
				stream.webRtcController.sendDescriptorController.emitUIInteraction({'setToken': decodeURIComponent(token)});
			}
		}
	});
	const application = new Application({
		stream,
		// statsPanelConfig: {
		// 	isEnabled: false,
		// 	visibilityButtonConfig: {
		// 		creationMode: UIElementCreationMode.Disable
		// 	}
		// },
		onColorModeChanged: (isLightMode) => PixelStreamingApplicationStyles.setColorMode(isLightMode)
	});
	// document.getElementById("centrebox").appendChild(application.rootElement);
	document.body.appendChild(application.rootElement);
}
