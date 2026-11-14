// Adapted from cosZone/astro-koharu's EmbedHydrator and TweetEmbed.
// Source revision: dc6e51b4ee04d6c26d4aae37b5c7940e30d2f572.
// AGPL-3.0; see ../../vendor/koharu/LICENSE.
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { Tweet } from "react-tweet";

function TweetEmbed({ element }: { element: HTMLElement }) {
	const [visible, setVisible] = useState(false);
	const [dark, setDark] = useState(
		document.documentElement.classList.contains("dark"),
	);
	const tweetId = element.dataset.tweetId!;
	const sourceUrl = element.dataset.url!;

	useEffect(() => {
		const visibility = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setVisible(true);
					visibility.disconnect();
				}
			},
			{ rootMargin: "800px" },
		);
		visibility.observe(element);
		const theme = new MutationObserver(() => {
			setDark(document.documentElement.classList.contains("dark"));
		});
		theme.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});
		return () => {
			visibility.disconnect();
			theme.disconnect();
		};
	}, [element]);

	return (
		<div className="tweet-embed not-prose" data-theme={dark ? "dark" : "light"}>
			{visible ? (
				<Tweet
					id={tweetId}
					components={{
						TweetNotFound: () => (
							<a href={sourceUrl} target="_blank" rel="noopener noreferrer">
								{sourceUrl}
							</a>
						),
					}}
				/>
			) : (
				<a href={sourceUrl} target="_blank" rel="noopener noreferrer">
					{sourceUrl}
				</a>
			)}
		</div>
	);
}

export function mountTweets(elements: HTMLElement[]) {
	const root = createRoot(document.createElement("div"));
	root.render(
		<>
			{elements.map((element, index) =>
				createPortal(<TweetEmbed element={element} />, element, String(index)),
			)}
		</>,
	);
	return () => root.unmount();
}
