---
title: Enhancing semi-supervised medical image segmentation via semantic transfer
published: 2026-01-27 16:17:00
expires: 2026-01-31 23:59:59
description: "半监督学习由于能够减轻"
category: 半监督医学图像分割
tags: [Pattern Recognition, 中科院1区TOP]
---

:::note
语义迁移的思想值得参考
:::

::github{repo="Shiyuan-H/STLU-Net"}


## 摘要

Semi-supervised learning has gained increasing attention in medical image segmentation due to its ability to alleviate the reliance on large-scale expert annotations. However, many existing SSL approaches focus on generic consistency constraints while lacking explicit mechanisms for semantic transfer between labeled and unlabeled data, limiting their effectiveness in regions with ambiguous or low-confidence predictions. To address this challenge, we propose STLU-Net, a dual-stream semi-supervised framework enhancing semantic interaction between labeled and unlabeled data via a fine-grained feature mixing module. This module performs channel-wise cross-sample fusion guided by feature similarity, encouraging the learning of transferable deep semantics while introducing controlled perturbations. Dual-stream supervision with structured feature perturbation penalizes predictions lacking consistent semantic support, mitigating confirmation bias on unlabeled data. Extensive experiments on multiple 3D medical image segmentation benchmarks demonstrate that STLU-Net achieves superior performance under limited supervision. Further analysis confirms that our method effectively extracts rich and generalizable semantic representations from limited annotations through hierarchical feature coordination, leading to notable performance gains in semi-supervised segmentation. Code is available at: https://github.com/Shiyuan-H/STLU-Net.

## 翻译

半监督学习由于能够减轻对大规模专家标签的依赖而在医学图像分割中得到越来越多的关注。然而，许多现有的SSL方法侧重于通用的一致性约束，而缺乏标记和未标记数据之间语义转移的显式机制，限制了它们在具有模糊或低置信度预测的区域中的有效性。为了解决这一挑战，我们提出了STLU-Net，这是一个双流半监督框架，通过细粒度特征混合模块增强标记和未标记数据之间的语义交互。该模块在特征相似度的指导下进行通道交叉样本融合，在引入受控扰动的同时鼓励可转移深度语义的学习。具有结构化特征扰动的双流监督惩罚缺乏一致语义支持的预测，减轻对未标记数据的确认偏差。在多个三维医学图像分割基准上的大量实验表明，STLU-Net在有限监督下取得了优异的性能。进一步的分析证实，我们的方法通过分层特征协调从有限的标签中有效地提取了丰富的、可泛化的语义表示，从而在半监督分割中获得了显著的性能提升。代码可从https://github.com/Shiyuan-H/STLU-Net

## 研究背景

![Snipaste_2026-01-27_19-33-48](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/1sX3/0X0/0343OUqbunoPXnaExCecUU.webp)

在医学影像分割领域，全自动分割为临床诊断提供关键支持，但3D医学影像的体素级标注高度依赖专家，耗时费力。半监督学习（SSL）通过少量标注数据引导大量未标注数据学习，有效缓解标注依赖。现有SSL方法多依赖通用一致性约束或伪标签策略，但缺乏标注与未标注数据间显式语义交互机制，在模糊区域或低置信度预测中性能受限。

医学影像具有稳定的解剖学规律（如一致空间结构和语义关系），为跨样本语义迁移提供基础。然而主流方法将标注与未标注数据视为独立训练实体，忽视数据域间共享语义的挖掘。为此，本文提出STLU-Net双流半监督框架，通过细粒度特征混合模块实现标注与未标注数据的语义交互，增强语义传递能力，提升有限监督下的分割性能。

## 研究现状

1. **主流方法**：半监督医学图像分割主要采用伪标签和一致性正则化策略。伪标签方法通过生成可靠伪标签指导学习（如MCF、PPC）；一致性正则化通过扰动下的预测一致性学习（如Mean Teacher、DTC）。
2. **技术趋势**：特征级增强逐渐替代输入级增强，如Manifold Mixup在特征空间插值，DropBlock引入结构化扰动，但现有方法多缺乏显式语义交互设计。
3. **应用场景**：在LA、胰腺、BraTS等3D医学影像数据集上验证，需处理标注稀缺、解剖结构复杂及噪声干扰问题。

## 提出的模型

![Snipaste_2026-01-27_19-35-53](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/Yd9Y/891X886/7ci2xJfnj8NSmml17Jj4hc.png)

### **1. 核心架构**

- **双分支共享编码器-解码器**：基于V-Net骨干网络，包含两个互补流：
  - **特征混合流**：通过通道级相似度引导的跨样本特征融合，促进语义知识从标记数据向未标记数据迁移。
  - **语义增强流**：应用通道级dropout减少空间偏差，强化模型对语义特征的依赖。
- **对称监督机制**：两个分支均接受标记数据的监督，并通过伪标签对未标记数据进行双向一致性约束，缓解确认偏误。

### **2. 关键创新模块**

#### **(1) 细粒度特征混合模块**

- **通道级相似度计算**：对标记特征和未标记特征计算通道级余弦相似度，作为融合权重：
  $$w=\mathrm{clamp}\Big(\frac{x_{f}^{u}\cdot x_{f}^{l}}{\|x_{f}^{u}\|\|x_{f}^{l}\|},0,1\Big),\quad w\in[0,1],$$
- **特征融合与扰动**：根据相似度权重融合特征，高相似度通道促进语义对齐，低相似度通道引入结构化扰动：
  $$x_{m}^{u}=w\cdot x^{u}+(1-w)\cdot x^{l},\\x_{m}^{l}=w\cdot x^{l}+(1-w)\cdot x^{u}.$$

#### **(2) 对称双监督策略**

- **标记数据监督**：两个流均使用Dice损失对标记数据进行监督：
  $$\mathcal{L}_{\mathrm{sup}}=\mathrm{Dice}(p_{d}^{l},GT)+\mathrm{Dice}(p_{m}^{l},GT).$$
- **未标记数据监督**：两个流通过伪标签（argmax输出）进行互监督：
  $$\mathbf{P}_{d}^{u}=\arg\max(p_{d}^{u}),\quad\mathbf{P}_{m}^{u}=\arg\max(p_{m}^{u}),\\\mathcal{L}_{\mathrm{unsup}}=\mathrm{Dice}(p_{d}^{u},\mathbf{P}_{m}^{u})+\mathrm{Dice}(p_{m}^{u},\mathbf{P}_{d}^{u}).$$
  总损失为$\mathcal{L}_{\mathrm{total}}=\mathcal{L}_{\mathrm{sup}}+\gamma\cdot\mathcal{L}_{\mathrm{unsup}},$，其中$\gamma$为随时间递增的权重因子。

## 实验（Compared with SOTA）



> 数据集：
>
> 1. **LA数据集**：包含100个钆增强MR体积数据及手动标注，图像各向同性分辨率为0.625×0.625×0.625mm。按标准划分，80个用于训练，20个用于验证。训练时输入体积随机裁剪为112×112×80，测试时滑动窗口推理步长为18×18×4。
> 2. **Pancreas数据集**：由82个对比增强腹部CT扫描组成，附带胰腺手动标注。使用62个进行训练，20个用于测试。训练体积随机裁剪为96×96×96，推理步长设为16×16×16。
> 3. **BraTS-2019数据集**：包括335名胶质瘤患者的术前多模态MRI扫描，含76例低级别胶质瘤和259例高级别胶质瘤。每个病例有T1、T1Gd、T2和T2-FLAIR四种模态，评估使用T2-FLAIR模态。数据集分为250个样本用于训练，25个用于验证，60个用于测试。训练时对体积进行随机翻转、旋转并裁剪为96×96×96，验证时使用步长为64×64×64的滑动窗口进行推理。



将STLU-Net与七种最先进的半监督医学图像分割方法进行了比较，包括DTC、MC-Net+、MCF、TAC、ML、PPC和TraCoCo。在LA数据集、Pancreas数据集和BraTS-2019数据集上的实验结果均表明，STLU-Net在不同标记数据比例下均表现出优越性能，尤其在有限标注情况下，能实现接近全监督V-Net的性能，且在多个评估指标上优于其他对比方法。

![Snipaste_2026-01-27_19-42-45](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/PyKl/827X552/6ykVPokORWEGgQ8QO41TCb.png)

![Snipaste_2026-01-27_19-42-50](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/8RZk/838X557/41w2ZTx9jSp7VhYVIFYmdB.png)

![Snipaste_2026-01-27_19-43-00](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/jxnx/823X552/7XXI7iFKWVDwhsTNnnz6m0.png)

## 实验（Ablation Experiments）​​

1. **特征混合位置的消融研究**：探究了在不同编码器深度插入特征混合模块的效果。结果表明，跨多个组应用特征混合比在单个组中使用能产生更显著的性能提升，其中I+B组合（中间组和瓶颈组）效果最为显著，所有组组合（S+I+B）能实现最佳整体性能。
2. **混合策略的比较**：将所提方法与固定标量插值、Manifold Mixup等替代混合策略进行比较。结果显示，基于相似度引导的特征混合结合保留标签的方式在半监督分割中实现了稳定的语义转移和对齐，性能优于其他混合策略。
3. **对称监督的消融实验**：比较了对称监督设计与两种不对称替代方案（仅特征混合流接收监督、仅语义增强流接收监督）。结果表明，对称策略在所有指标上显著优于不对称替代方案，证明双向一致性有助于减少未标记数据上的确认偏差。
4. **通道dropout概率的敏感性分析**：分析了语义增强流中不同dropout概率p的影响。当p≤0.5时，模型性能对p的确切值不敏感，最终选择p=0.5作为通道dropout概率，其整体性能最佳。

![Snipaste_2026-01-27_19-46-17](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/Vt8x/494X427/5qCqignyJ4NK67435MM79r.png)

### 其他实验

1. **不同标记比例下的性能**：评估了STLU-Net随着标记数据量增加的性能演变。在LA数据集上，约40%的标记数据足以达到与全监督V-Net相当的分割性能；Pancreas数据集则需要60%的标记数据。当使用所有标注时，STLU-Net在两个数据集上均取得略好的成绩。
2. **对噪声输入的鲁棒性**：通过向测试图像注入标准差范围为0.1至0.5的高斯噪声进行实验。结果表明，STLU-Net在所有噪声水平下均实现了最高的Dice分数和最低的95HD值，展示出强大的鲁棒性和噪声容忍度。
3. **计算成本分析**：比较了STLU-Net与其他最先进方法的计算效率，包括模型大小、推理成本和训练时间。结果显示，STLU-Net在保持竞争性能的同时，训练时间更短，在模型大小和推理成本方面也具有竞争力。
4. **置信度门控伪标签去噪的性能**：评估了标准置信度掩蔽伪标签损失变体的效果。结果表明，默认的argmax方案实现了最佳整体性能，所有置信度掩蔽变体均降低了Dice并显著恶化了95HD和ASD，因此在最终模型中保留了更简单的argmax伪标签。

## 结论

现有半监督学习（SSL）方法普遍缺乏标记与未标记数据间显式的语义交互设计，导致在伪标签不稳定或语义模糊区域存在性能瓶颈。为此，本文提出STLU-Net网络架构，通过以下创新实现标记与未标记数据间的语义信息传递：

1. **动态细粒度跨样本特征混合策略**：基于通道相似度计算引导样本间语义传播，实现更有效的语义线索迁移。
2. **对称双监督机制**：在纯语义路径与混合特征路径间维持平衡监督，减少浅层噪声影响，增强语义传播可靠性并引入结构化扰动以强化一致性正则化。

实验表明，与依赖通用一致性或不确定性建模的现有方法相比，STLU-Net通过更直接可解释的语义对齐机制，在稀疏标注下提升了监督稳定性和有效性。在多个医学图像分割任务中均达到SOTA性能，尤其在低标注比例下表现出优异的泛化性和稳定性，验证了其作为半监督医学图像分割框架的潜力。

未来工作将聚焦：

- 扩展至空间自适应特征融合（如体素/区域感知混合）
- 开发更强的语义扰动策略以优化伪标签
- 拓展至多器官、跨模态和多中心医学影像场景
