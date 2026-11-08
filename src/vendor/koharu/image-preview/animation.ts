export const animation = {
	// Duration in milliseconds
	duration: {
		fast: 150,
		tween: 200, // Between fast and normal
		normal: 250,
		ui: 300, // Common UI interaction
		slow: 350,
		slower: 500,
		flipCard: 600, // Card flip animation
	},

	// Easing functions (the kebab-case curves mirror the --ease-* CSS variables in styles/global/motion.css)
	easing: {
		linear: "linear",
		easeIn: "cubic-bezier(0.4, 0, 1, 1)",
		easeOut: "cubic-bezier(0, 0, 0.2, 1)",
		easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
		spring: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Spring-like easing
		"out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
		"out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
		"in-quart": "cubic-bezier(0.5, 0, 0.75, 0)",
		"in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",
	},

	// The same curves as Motion `ease` arrays
	bezier: {
		outQuart: [0.25, 1, 0.5, 1] as const,
		outExpo: [0.16, 1, 0.3, 1] as const,
		inQuart: [0.5, 0, 0.75, 0] as const,
		inOutQuart: [0.76, 0, 0.24, 1] as const,
	},

	// Spring configurations for Motion library
	spring: {
		// Default spring (balanced)
		default: {
			type: "spring" as const,
			stiffness: 300,
			damping: 30,
		},

		// Gentle spring (smooth)
		gentle: {
			type: "spring" as const,
			stiffness: 200,
			damping: 25,
		},

		// Wobbly spring (bouncy)
		wobbly: {
			type: "spring" as const,
			stiffness: 400,
			damping: 20,
		},

		// Stiff spring (snappy)
		stiff: {
			type: "spring" as const,
			stiffness: 500,
			damping: 35,
		},

		// Slow spring (relaxed)
		slow: {
			type: "spring" as const,
			stiffness: 150,
			damping: 20,
		},

		// Micro animations (existing in project)
		microDamping: {
			type: "spring" as const,
			stiffness: 200,
			damping: 13,
		},

		microRebound: {
			type: "spring" as const,
			stiffness: 200,
			damping: 9,
		},

		// Component-specific springs
		menu: {
			type: "spring" as const,
			stiffness: 300,
			damping: 25,
		},

		popoverContent: {
			type: "spring" as const,
			stiffness: 300,
			damping: 20,
		},

		// Press/release feedback: settles fast with a barely visible rebound
		press: {
			type: "spring" as const,
			stiffness: 560,
			damping: 30,
		},

		// Menus and popovers: quick, settled entrance
		popover: {
			type: "spring" as const,
			stiffness: 460,
			damping: 32,
		},

		// Lightbox zoom out of / back into the page
		lightbox: {
			type: "spring" as const,
			stiffness: 300,
			damping: 32,
			mass: 0.9,
		},

		// Navigation pill: glides between items without overshoot
		nav: {
			type: "spring" as const,
			stiffness: 480,
			damping: 38,
			mass: 0.9,
		},

		// Playful pop for lively-level entrances (floating buttons, badges)
		pop: {
			type: "spring" as const,
			stiffness: 420,
			damping: 22,
		},
	},

	// Transition objects for CSS transitions
	transition: {
		fast: `all ${150}ms cubic-bezier(0.4, 0, 0.2, 1)`,
		normal: `all ${250}ms cubic-bezier(0.4, 0, 0.2, 1)`,
		slow: `all ${350}ms cubic-bezier(0.4, 0, 0.2, 1)`,
	},
} as const;
