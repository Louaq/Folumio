// Bundled Remix icons used by the upstream viewer.
import {
	Icon as Iconify,
	type IconProps,
	type IconifyIcon,
} from "@iconify/react";
const icons: Record<string, IconifyIcon> = {
	"ri:arrow-left-s-line": {
		body: '<path fill="currentColor" d="m10.828 12l4.95 4.95l-1.414 1.415L8 12l6.364-6.364l1.414 1.414z"/>',
		width: 24,
		height: 24,
	},
	"ri:arrow-right-s-line": {
		body: '<path fill="currentColor" d="m13.172 12l-4.95-4.95l1.414-1.413L16 12l-6.364 6.364l-1.414-1.415z"/>',
		width: 24,
		height: 24,
	},
	"ri:clockwise-line": {
		body: '<path fill="currentColor" d="m20 10.586l1.828-1.829l1.415 1.415L19 14.414l-4.243-4.242l1.415-1.415L18 10.586V8a3 3 0 0 0-3-3h-4V3h4a5 5 0 0 1 5 5zM13 9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1zm-1 2H4v8h8z"/>',
		width: 24,
		height: 24,
	},
	"ri:close-line": {
		body: '<path fill="currentColor" d="m12 10.587l4.95-4.95l1.414 1.414l-4.95 4.95l4.95 4.95l-1.415 1.414l-4.95-4.95l-4.949 4.95l-1.414-1.415l4.95-4.95l-4.95-4.95L7.05 5.638z"/>',
		width: 24,
		height: 24,
	},
	"ri:image-2-line": {
		body: '<path fill="currentColor" d="m5 11.1l2-2l5.5 5.5l3.5-3.5l3 3V5H5zm0 2.829V19h3.1l2.986-2.985L7 11.929zM10.929 19H19v-2.071l-3-3zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m11.5 7a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3"/>',
		width: 24,
		height: 24,
	},
	"ri:image-line": {
		body: '<path fill="currentColor" d="M2.992 21A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993zM20 15V5H4v14L14 9zm0 2.828l-6-6L6.828 19H20zM8 11a2 2 0 1 1 0-4a2 2 0 0 1 0 4"/>',
		width: 24,
		height: 24,
	},
	"ri:zoom-in-line": {
		body: '<path fill="currentColor" d="m18.031 16.617l4.283 4.282l-1.415 1.415l-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9s9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617m-2.006-.742A6.98 6.98 0 0 0 18 11c0-3.867-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7a6.98 6.98 0 0 0 4.875-1.975zM10 10V7h2v3h3v2h-3v3h-2v-3H7v-2z"/>',
		width: 24,
		height: 24,
	},
	"ri:zoom-out-line": {
		body: '<path fill="currentColor" d="m18.031 16.617l4.283 4.282l-1.415 1.415l-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9s9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617m-2.006-.742A6.98 6.98 0 0 0 18 11c0-3.867-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7a6.98 6.98 0 0 0 4.875-1.975zM7 10h8v2H7z"/>',
		width: 24,
		height: 24,
	},
};
export function Icon({ icon, ...props }: IconProps) {
	return (
		<Iconify {...props} icon={typeof icon === "string" ? icons[icon] : icon} />
	);
}
