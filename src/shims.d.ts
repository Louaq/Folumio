// 此文件刻意不包含任何顶层 import / export，使其保持为「脚本」而非「模块」，
// 这样其中的 `declare module` 才会被视为全局环境声明（ambient），对整个项目生效。

// 主题样式通过 Vite alias 注入（见 astro.config.mjs 中的 @rehype-callouts-theme 别名），
// 仅作副作用导入，没有类型声明。补一个环境模块声明以满足 TS 6 更严格的模块解析检查。
declare module "@rehype-callouts-theme";
