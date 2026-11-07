// Remix Icon assets used by the upstream player; bundled locally to avoid Iconify API requests.
import { addCollection } from "@iconify/react";
addCollection({
	prefix: "ri",
	width: 24,
	height: 24,
	icons: {
		"music-2-line": {
			body: '<path fill="currentColor" d="M20 3v14a4 4 0 1 1-2-3.465V5H9v12a4 4 0 1 1-2-3.465V3zM5 19a2 2 0 1 0 0-4a2 2 0 0 0 0 4m11 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4"/>',
		},
		"close-line": {
			body: '<path fill="currentColor" d="m12 10.587l4.95-4.95l1.414 1.414l-4.95 4.95l4.95 4.95l-1.415 1.414l-4.95-4.95l-4.949 4.95l-1.414-1.415l4.95-4.95l-4.95-4.95L7.05 5.638z"/>',
		},
		"play-fill": {
			body: '<path fill="currentColor" d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832"/>',
		},
		"order-play-line": {
			body: '<path fill="currentColor" d="M17 4V2.068a.5.5 0 0 1 .82-.385l4.12 3.433a.5.5 0 0 1-.321.884H2V4zM2 18h20v2H2zm0-7h20v2H2z"/>',
		},
		"shuffle-line": {
			body: '<path fill="currentColor" d="M18 17.883V16l5 3l-5 3v-2.09a9 9 0 0 1-6.997-5.365L11 14.54l-.003.006A9 9 0 0 1 2.725 20H2v-2h.725a7 7 0 0 0 6.434-4.243L9.912 12l-.753-1.757A7 7 0 0 0 2.725 6H2V4h.725a9 9 0 0 1 8.272 5.455L11 9.46l.003-.006A9 9 0 0 1 18 4.09V2l5 3l-5 3V6.117a7 7 0 0 0-5.159 4.126L12.088 12l.753 1.757A7 7 0 0 0 18 17.883"/>',
		},
		"repeat-one-line": {
			body: '<path fill="currentColor" d="M8 20v1.933a.5.5 0 0 1-.82.384l-4.12-3.433A.5.5 0 0 1 3.382 18H18a2 2 0 0 0 2-2V8h2v8a4 4 0 0 1-4 4zm8-17.932a.5.5 0 0 1 .82-.385l4.12 3.433a.5.5 0 0 1-.321.884H6a2 2 0 0 0-2 2v8H2V8a4 4 0 0 1 4-4h10zM11 8h2v8h-2v-6H9V9z"/>',
		},
		"volume-mute-line": {
			body: '<path fill="currentColor" d="M10 7.22L6.603 10H3v4h3.603L10 16.78zM5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387zm14.525-4l3.536 3.536l-1.415 1.414L19 13.414l-3.536 3.536l-1.414-1.414L17.586 12L14.05 8.465l1.414-1.415L19 10.586l3.535-3.536l1.415 1.415z"/>',
		},
		"volume-down-line": {
			body: '<path fill="currentColor" d="M13 7.22L9.603 10H6v4h3.603L13 16.78zM8.889 16H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387zm9.974.591l-1.422-1.422A4 4 0 0 0 19 12c0-1.43-.75-2.685-1.88-3.392l1.439-1.439A5.99 5.99 0 0 1 21 12c0 1.842-.83 3.49-2.137 4.591"/>',
		},
		"volume-up-line": {
			body: '<path fill="currentColor" d="M6.603 10L10 7.22v9.56L6.603 14H3v-4zM2 16h3.889l5.294 4.332a.5.5 0 0 0 .817-.387V4.055a.5.5 0 0 0-.817-.387L5.89 8H2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1m21-4c0 3.292-1.446 6.246-3.738 8.262l-1.418-1.418A8.98 8.98 0 0 0 21 12a8.98 8.98 0 0 0-3.155-6.844l1.417-1.418A10.97 10.97 0 0 1 23 12m-5 0a5.99 5.99 0 0 0-2.287-4.713l-1.429 1.429A4 4 0 0 1 16 12c0 1.36-.679 2.561-1.716 3.284l1.43 1.43A5.99 5.99 0 0 0 18 12"/>',
		},
		"skip-back-line": {
			body: '<path fill="currentColor" d="M7 4a1 1 0 0 1 1 1v6.333l10.223-6.815a.5.5 0 0 1 .777.416v14.132a.5.5 0 0 1-.777.416L8 12.667V19a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1m10 3.737L10.606 12L17 16.263z"/>',
		},
		"loader-4-line": {
			body: '<path fill="currentColor" d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364"/>',
		},
		"pause-large-line": {
			body: '<path fill="currentColor" d="M6 3h2v18H6zm10 0h2v18h-2z"/>',
		},
		"play-large-fill": {
			body: '<path fill="currentColor" d="M6 20.196V3.804a1 1 0 0 1 1.53-.848l13.113 8.196a1 1 0 0 1 0 1.696L7.53 21.044A1 1 0 0 1 6 20.196"/>',
		},
		"skip-forward-line": {
			body: '<path fill="currentColor" d="M16 12.667L5.777 19.482A.5.5 0 0 1 5 19.066V4.934a.5.5 0 0 1 .777-.416L16 11.333V5a1 1 0 1 1 2 0v14a1 1 0 1 1-2 0zm-9-4.93v8.526L13.394 12z"/>',
		},
	},
});
