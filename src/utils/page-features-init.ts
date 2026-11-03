/** 首载与 Swup 换页共用入口，仅导入当前页面需要的功能。 */
export function initPageFeatures(): void {
	const archive = document.getElementById("archive-list");
	if (archive) {
		void import("./archive-init").then(({ initArchivePage }) => {
			if (archive.isConnected) initArchivePage();
		});
	}

	const card = document.querySelector(".post-card-wrapper[data-url]");
	if (card) {
		void import("./post-card-init").then(({ initPostCardDelegation }) => {
			if (card.isConnected) initPostCardDelegation();
		});
		void import("./cover-image-init").then(({ initCoverImages }) => {
			if (card.isConnected) initCoverImages();
		});
	}

	const post = document.getElementById("post-container");
	if (post) {
		void import("./post-page-init").then(({ initPostPage }) => {
			if (post.isConnected) initPostPage(post);
		});
	}
}
