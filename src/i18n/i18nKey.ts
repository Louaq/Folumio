enum I18nKey {
	home = "home",
	about = "about",
	archive = "archive",
	articles = "articles",
	search = "search",
	searchKbdSelect = "searchKbdSelect",
	searchKbdSwitch = "searchKbdSwitch",
	searchNoResults = "searchNoResults",
	searchLoading = "searchLoading",

	tags = "tags",
	categories = "categories",
	tableOfContents = "tableOfContents",
	tocEmpty = "tocEmpty",

	// 公告栏
	announcement = "announcement",
	announcementClose = "announcementClose",

	commentSection = "commentSection",
	commentSubtitle = "commentSubtitle",

	uncategorized = "uncategorized",
	noTags = "noTags",

	wordCount = "wordCount",
	wordsCount = "wordsCount",
	minuteCount = "minuteCount",
	minutesCount = "minutesCount",
	postCount = "postCount",
	postsCount = "postsCount",

	more = "more",
	collapse = "collapse",

	author = "author",
	publishedAt = "publishedAt",
	license = "license",
	postShare = "postShare",
	postQrCode = "postQrCode",
	postScanToVisit = "postScanToVisit",
	postLinkCopied = "postLinkCopied",
	postLinkCopyFailed = "postLinkCopyFailed",
	friends = "friends",
	essays = "essays",
	friendsDescription = "friendsDescription",
	watchlist = "watchlist",
	watchlistTitle = "watchlistTitle",
	watchlistSubtitle = "watchlistSubtitle",
	watchlistEmpty = "watchlistEmpty",
	watchlistEmptyReason = "watchlistEmptyReason",
	watchlistCategoryAnime = "watchlistCategoryAnime",
	watchlistCategoryMovie = "watchlistCategoryMovie",
	watchlistCategoryTV = "watchlistCategoryTV",
	watchlistCategoryDocumentary = "watchlistCategoryDocumentary",
	watchlistCategoryOther = "watchlistCategoryOther",

	// 分页
	paginationPrev = "paginationPrev",
	paginationNext = "paginationNext",
	paginationPage = "paginationPage",
	/** 中间页码文案，含 {current}、{total}，如：第 {current} / 共 {total} */
	/** 跳转行：前缀，如「跳转到」 */
	paginationJumpTo = "paginationJumpTo",
	/** 跳转行：页码后单位，如「页」；部分语言可置空 */
	paginationJumpPageUnit = "paginationJumpPageUnit",
	/** 跳转提交按钮 */
	paginationGo = "paginationGo",
	/** 跳转页码非数字或无效输入时的提示 */
	paginationJumpInvalid = "paginationJumpInvalid",

	// 404页面
	notFound = "notFound",
	notFoundTitle = "notFoundTitle",
	notFoundDescription = "notFoundDescription",
	backToHome = "backToHome",

	// RSS页面
	rss = "rss",
	rssDescription = "rssDescription",
	rssSubtitle = "rssSubtitle",
	rssLink = "rssLink",
	rssCopyLink = "rssCopyLink",
	rssLatestPosts = "rssLatestPosts",
	rssWhatIsRSS = "rssWhatIsRSS",
	rssWhatIsRSSDescription = "rssWhatIsRSSDescription",
	rssBenefit1 = "rssBenefit1",
	rssBenefit2 = "rssBenefit2",
	rssBenefit3 = "rssBenefit3",
	rssBenefit4 = "rssBenefit4",
	rssHowToUse = "rssHowToUse",

	//最后编辑时间卡片
	lastModifiedPrefix = "lastModifiedPrefix",
	lastModifiedOutdated = "lastModifiedOutdated",
	lastModifiedDaysAgo = "lastModifiedDaysAgo",
	/** 与首页通告条一致：加粗前缀 + 正文一行 */
	lastModifiedNoticeTitle = "lastModifiedNoticeTitle",
	/** 连接「更新日期」与「过时说明」的标点（如中文。「」，英文 ". "） */
	lastModifiedNoticeJoiner = "lastModifiedNoticeJoiner",

	// 访问量统计
	pageViews = "pageViews",
	pageViewsLoading = "pageViewsLoading",

	// 置顶
	pinned = "pinned",

	// 站点统计
	siteStats = "siteStats",
	siteStatsPostCount = "siteStatsPostCount",
	siteStatsCategoryCount = "siteStatsCategoryCount",
	siteStatsTagCount = "siteStatsTagCount",
	siteStatsTotalWords = "siteStatsTotalWords",
	siteStatsRunningDays = "siteStatsRunningDays",
	siteStatsLastUpdate = "siteStatsLastUpdate",
	siteStatsDaysAgo = "siteStatsDaysAgo",
	siteStatsDays = "siteStatsDays",
	today = "today",

	// 站点运行时间
	siteRuntime = "siteRuntime",
	siteRuntimeUnitDay = "siteRuntimeUnitDay",
	siteRuntimeUnitYear = "siteRuntimeUnitYear",
	siteRuntimeUnitMonth = "siteRuntimeUnitMonth",

	// 音乐播放器
	music = "music",

	// 页脚访客计数
	visitorSitePv = "visitorSitePv",
	visitorSiteUv = "visitorSiteUv",

	// 站点地图
	sitemap = "sitemap",
	sitemapDescription = "sitemapDescription",
	sitemapPages = "sitemapPages",

	// 代码块折叠
	codeCollapsibleExpanded = "codeCollapsibleExpanded",
	codeCollapsibleCollapsed = "codeCollapsibleCollapsed",

}

export default I18nKey;
