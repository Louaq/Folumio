import { sidebarLayoutConfig } from "../config";
import type { WidgetComponentConfig } from "../types/config";

/** 侧边栏全部组件，未过滤 enable */
export const sidebarComponents = sidebarLayoutConfig.components;

/** 移动端是否走侧边栏布局；MainGridLayout 据此决定单列 */
export const showSidebarOnMobile =
	(sidebarLayoutConfig.responsive?.layout?.mobile ?? "sidebar") === "sidebar";

/** 按位置和页面取启用的组件，order 未设置时按 0 排 */
export function getComponentsByPosition(
	position: "top" | "sticky",
	isPostPage = false,
): WidgetComponentConfig[] {
	return sidebarComponents
		.filter(
			(component) =>
				component.enable &&
				component.position === position &&
				(!isPostPage || component.showOnPostPage !== false),
		)
		.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** 组件内联样式：自定义样式 + 入场动画延迟 */
export function getComponentStyle(
	component: WidgetComponentConfig,
	index: number,
): string {
	const styles: string[] = [];
	if (component.style) {
		styles.push(component.style);
	}

	const defaultAnim = sidebarLayoutConfig.defaultAnimation;
	const delay =
		component.animationDelay ??
		(defaultAnim?.enable
			? defaultAnim.baseDelay + index * defaultAnim.increment
			: 0);
	if (delay > 0) {
		styles.push(`animation-delay: ${delay}ms`);
	}

	return styles.join("; ");
}

/** 内容项数量达到阈值时折叠；未配阈值即不折叠 */
export function isCollapsed(
	component: WidgetComponentConfig,
	itemCount: number,
): boolean {
	const threshold = component.responsive?.collapseThreshold;
	return threshold ? itemCount >= threshold : false;
}
