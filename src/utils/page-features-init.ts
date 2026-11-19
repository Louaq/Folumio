/** 首载与 Swup 换页共用入口，仅导入当前页面需要的功能。 */
export async function initPageFeatures(): Promise<void> {
	const archive = document.getElementById("archive-list");
	if (archive) {
		void import("./archive-init").then(({ initArchivePage }) => {
			if (archive.isConnected) initArchivePage();
		});
	}

	const card = document.querySelector(".post-card-wrapper[data-url]");
	if (card) {
		void import("./post-list-init").then(({ initPostList }) => {
			if (card.isConnected) initPostList();
		});
	}

	const codeBlock = document.querySelector(".expressive-code");
	if (codeBlock) {
		void import("./code-block-init").then(({ initCodeBlocks }) => {
			if (codeBlock.isConnected) initCodeBlocks();
		});
	}

	const post = document.getElementById("post-container");
	if (post) {
		const { initPostPage } = await import("./post/index");
		if (post.isConnected) initPostPage(post);
	}
}
