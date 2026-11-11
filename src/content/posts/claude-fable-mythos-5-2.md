---
title: Claude Fable 5.2 与 Mythos 5.2
published: 2026-11-11
description: 梳理 Claude Fable 5.2 与 Mythos 5.2 的模型定位、开放范围、官方评测和 API 参数，以及接入前需要确认的问题。
tags: [Claude, Anthropic, 大语言模型]
category: 人工智能
image: /assets/coverImage/4.webp
---

>截至 **2026 年 11 月 11 日**，Anthropic 官方模型发布列表中最新的一次更新，是 11 月 9 日公布的 **Claude Fable 5.2 与 Claude Mythos 5.2**。本文按这一时间点整理，后续型号、价格与开放范围可能变化。

![Anthropic 官方发布页：Claude Fable 5.2 与 Mythos 5.2，发布日期为 2026 年 11 月 9 日](https://pic1.imgdb.cn/i/034vZw6YoufZWjKfXvQzuo.webp)

*图 1：Anthropic 官方发布页截图，显示模型名称与发布日期。截图日期：2026 年 11 月 11 日；来源见文末「发布公告」。*

## Fable和Mythos的区别

两者使用同一个底层模型，主要差异在安全防护和访问范围：Fable 面向广泛使用，针对网络安全与生物领域设置较强防护；Mythos 面向通过验证计划的机构，相关专业用途需要申请访问。不能把 Mythos 理解成所有用户都能直接切换使用的另一个版本。

## 官方评测

下面选取两项编程评测，数据来自 Anthropic 的发布公告：

| 评测 | Fable 5.1 | Fable 5.2 |
| --- | --- | --- |
| FrontierCode 2.0 | 32.4% | 49.1% |
| FrontierSWE v2 | 56.3% | 69.9% |

![Anthropic 官方评测表局部：FrontierCode 2.0 与 FrontierSWE v2 的成绩及 effort 标注](https://pic1.imgdb.cn/i/034vZw6oc0safbHBrYzChP.webp)

*图 2：官方发布公告中的评测表局部，保留模型列名和两项编程评测的原始数值。截图日期：2026 年 11 月 11 日；来源见文末「发布公告」。*

FrontierCode 2.0 的两项结果均标注为 Xhigh effort；官方表格对其他未特别注明的结果使用各模型最高可用 effort。这些是官方测试条件下的成绩，不能直接当作自己项目的成功率。

对开发者而言，更值得记录的是：面对同一个任务，模型是否减少返工，能否通过现有测试，以及最终修改能否被审查接受。单次演示和排行榜都不能代替这一层验证。这是本文的使用建议，并非独立实测结论。

## API参数与价格

按官方模型文档，Fable 5.2 的基本规格如下：

| 项目 | 规格 |
| --- | --- |
| Claude API 模型 ID | `claude-fable-5-2` |
| 上下文窗口 | 1M tokens |
| 最大输出 | 128K tokens |
| 输入与输出 | 文字、图片输入；文字输出 |
| 标准输入价格 | 每百万 tokens 8 美元 |
| 标准输出价格 | 每百万 tokens 40 美元 |

![Claude 官方文档：Fable 5.2 的模型 ID、1M 上下文、128K 最大输出及每百万 tokens 8 美元输入和 40 美元输出价格](https://pic1.imgdb.cn/i/034vZw72k6qwkAD3gbPpaE.webp)

*图 3：Claude Platform Docs 模型概览页截图，包含 API 模型 ID、上下文窗口、最大输出、价格，以及 Mythos 的访问说明。截图日期：2026 年 11 月 11 日；来源见文末「模型规格与价格」。*

以上为标准 token 单价，不是订阅费用，也不是一次任务的固定成本。

接入时还需注意，模型的自适应思考始终开启；旧代码里的 `temperature`、`top_p`、`top_k` 等参数不宜原样照搬，应按新模型文档检查。官方还列出了数据保留要求，处理敏感资料前应核对自身账户适用的条款。

## 建议

官方当前的选型建议仍是：多数任务先从 Opus 5.5 开始；遇到更困难的推理和长时间代理任务，再考虑 Fable 5.2。Sonnet 5.5 与 Haiku 5.5 则分别侧重速度与智能的平衡，以及高吞吐、低延迟任务。

实际评估时，可以选一组自己熟悉的任务，例如跨文件修复、长文档问答和图表理解，固定输入材料与验收标准，同时记录完成质量、耗时和实际费用。对于代码修改，要检查最终 diff 和测试结果；对于资料整理，要回到原始来源核对事实。

如果原有模型已经能稳定完成任务，升级的价值应体现在更少的返工或更好的结果上。若这些收益还没有出现，就先保留现有方案，让新模型承担少量可对照的任务，再决定是否扩大使用。

---

本文依据官方公告与文档整理，未包含作者的模型实测。文中性能数据属于厂商报告，规格与价格以实际使用时的官方说明为准。

## 官方来源

- [发布公告](https://www.anthropic.com/claude-fable-and-mythos-5-2)
- [模型规格与价格](https://platform.claude.com/docs/en/models/fable-5-2/overview)
