---
title: Background Matters A Cross-View Bidirectional Modeling Framework for Semi-Supervised Medical Image Segmentation
published: 2026-01-26 19:34:00
expires: 2026-01-31 23:59:59
description: "半监督医学图像分割(SSMIS)利用"
category: 半监督医学图像分割
tags: [TIP]
---

:::note
本文的角度新颖，特别是首次提出使用背景建模辅助前景建模的思想，以及双向一致性损失
:::


::github{repo="caoluyang0830/CVBM"}



## 摘要

Semi-supervised medical image segmentation (SSMIS) leverages unlabeled data to reduce reliance on manually annotated images. However, current SOTA approaches predominantly focus on foreground-oriented modeling (i.e., segmenting only the foreground region) and have largely overlooked the potential benefits of explicitly modeling the background region. Our study theoretically and empirically demonstrates that highly certain predictions in background modeling enhance the confidence of corresponding foreground modeling. Building on this insight, we propose the Cross-view Bidirectional Modeling (CVBM) framework, which introduces a novel perspective by incorporating background modeling to improve foreground modeling performance. Within CVBM, background modeling serves as an auxiliary perspective, providing complementary supervisory signals to enhance the confidence of the foreground model. Additionally, CVBM introduces an innovative bidirectional consistency mechanism, which ensures mutual alignment between foreground predictions and background-guided predictions. Extensive experiments demonstrate that our approach achieves SOTA performance on the LA, Pancreas, ACDC, and HRF datasets. Notably, on the Pancreas dataset, CVBM outperforms fully supervised methods (i.e., DSC: 84.57% vs. 83.89%) while utilizing only 20% of the labeled data. Our code is publicly available at https://github.com/caoluyang0830/CVBM.git

## 翻译

半监督医学图像分割(SSMIS)利用未标记的数据来减少对手动注释图像的依赖。然而，当前的SOTA方法主要侧重于面向前景的建模(即，仅分割前景区域)，并且在很大程度上忽略了显式建模背景区域的潜在好处。我们的研究从理论和实证两方面表明，背景建模中高度确定的预测增强了相应前景建模的置信度。基于这一见解，我们提出了交叉视图双向建模(CVBM)框架，该框架通过结合背景建模来提高前景建模性能，引入了一种新的视角。在CVBM中，背景建模作为辅助视角，提供互补的监督信号，以增强前景模型的置信度。此外，CVBM引入了一种创新的双向一致性机制，确保前景预测和背景指导预测之间的相互一致性。大量的实验表明，我们的方法在LA，胰腺，ACDC和HRF数据集上实现了SOTA性能。值得注意的是，在胰腺数据集上，CVBM优于完全监督方法(即DSC: 84.57% vs. 83.89%)，而仅利用了20%的标记数据。我们的代码可以在https://github.com/caoluyang0830/CVBM.git

## 研究背景

![Snipaste_2026-01-26_19-48-09](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/G4MW/0X0/0343OUI2idWqOgHwBwheSU.webp)

半监督医学图像分割（SSMIS）旨在利用有限标注数据和大量无标注数据降低标注成本，但现有方法存在显著局限：主流模型过度聚焦**前景区域建模**，普遍忽视**背景区域**的潜在价值，甚至将背景视为干扰因素。研究发现，在某些区域（如前景与背景边界），背景建模预测置信度反而高于前景建模，这种高确定性背景预测可有效提升对应前景区域的分割置信度。传统方法因仅依赖前景建模，常导致边界区域预测不确定性高，伪标签可靠性降低。针对这一问题，本文提出通过显式建模背景区域，构建前景与背景的双向一致性约束，以增强前景分割性能，为解决SSMIS中低标注数据下的分割精度问题提供新思路。

## 研究现状

半监督学习：熵最小化+一致性正则化(数据增强+模型扰动)

1. **半监督医学图像分割（SSMIS）**：主流方法通过熵最小化和一致性正则化利用未标记数据，混合范式（如结合两种策略）表现更优。
2. **技术方向**：扰动建模（如多尺度预测）、多任务学习（如联合分割与重建）、协同训练（多模型互补）等，均聚焦于前景区域建模。
3. **现有局限**：普遍忽视背景区域显式建模，视其为干扰因素，导致边界区域预测置信度低，尤其在低标注数据场景下伪标签可靠性不足。

#### 研究瓶颈

1. **背景信息利用不足**：现有方法未挖掘背景建模对前景分割的辅助价值，导致相似像素区域（如器官边缘）预测不确定性高。
2. **伪标签质量局限**：依赖高置信度前景伪标签过滤低置信区域，易引入偏差，尤其在复杂背景（如胰腺CT）中性能受限。
3. **模型泛化性挑战**：在多类别、低对比度或小目标分割任务中，单一前景视角难以捕捉全局特征关系，导致边界模糊或类别混淆。

## 提出的模型

![Snipaste_2026-01-26_19-50-12](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/NGLw/818X520/037PAsS5jbvPS8urZtgWM1.png)



### **1. 核心动机**

现有半监督分割方法多聚焦于**前景区域建模**，忽视了背景区域的潜在价值。本文通过理论和实证分析表明：**背景区域的高置信度预测能增强对应前景区域的建模信心**。例如，在器官边缘等模糊区域，背景模型往往比前景模型具有更高的预测确定性，可辅助修正前景分割的不确定性。

![Snipaste_2026-01-26_19-50-51](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/wxnn/1334X353/0Ipv8Bhu55S6a5rkUBYQFO.png)



![Snipaste_2026-01-26_19-51-07](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/WxkB/1074X495/5uHIN7NSx3g3gt9E35EtOz.png)

### **2. 模型架构**

CVBM 框架通过**跨视角双向建模**整合前景与背景信息，具体包括以下组件：

- **双视角建模**：
  - **前景建模**（主任务）：直接分割目标器官/病灶区域。
  - **背景建模**（辅助任务）：将背景视为“互补标签”（通过反转前景标签获得），显式建模背景区域。
- **混合层（Mixing Layer）**：融合前景与背景预测，生成背景引导的前景预测（Q_M），作为双向一致性约束的桥梁。
- **教师-学生模型**：
  - **教师模型**：使用少量标记数据预训练，生成高质量前景/背景伪标签。
  - **学生模型**：结合标记数据和伪标签训练，通过双向一致性优化提升分割性能。

![Snipaste_2026-01-26_19-52-55](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/3uxu/693X423/3IF08jaeNTxNTMktHw8UyU.png)

### **3. 双向一致性优化机制**

为确保前景与背景预测的互洽性，CVBM 提出两种损失函数：

- **区域损失（L_rw）**：同时优化前景和背景分支在标记/未标记数据上的分割损失，实现全区域像素级监督。
- **双向一致性损失（L_bcl）**：
  - **直接一致性**：约束前景预测（Q_fg）与背景引导的前景预测（Q_M）一致，减少前景类内差异。
  - **反向一致性**：约束前景预测（Q_fg）与背景预测（Q_bg）互补（Q_fg ≈ 1 - Q_bg），增大前景-背景类间差异。

## 实验（Compared with SOTA）

> 数据集：
>
> 1. **LA数据集**：100例3D钆增强MRI心脏扫描图像，用于左心房分割。按80/20划分训练/测试集，评估半监督设置（4/76和8/72标签比例）。
> 2. **Pancreas-CT数据集**：82例3D腹部增强CT扫描，按62/20划分训练/测试集，评估6/56和12/50标签比例。
> 3. **ACDC数据集**：100例心脏MRI，含心肌、左心室、右心室多类别标注，按70/10/20划分训练/验证/测试集，评估3/67和7/63标签比例。
> 4. **HRF数据集**：45张彩色眼底图像（含健康、糖尿病视网膜病变、青光眼），用于血管分割，按27/18划分训练/测试集，评估1/26和3/24标签比例。

1. **与SOTA方法对比**
   - **LA数据集**：在8/72标签设置下，CVBM的DSC达91.19%，超过MC-Net（83.59%）和UA-MT（82.26%），甚至优于全监督VNet（91.47%）。
   - **Pancreas数据集**：仅用12/50标签数据，DSC达84.57%，超过全监督基线（83.89%）及SASSNet（68.79%）、URPC（72.89%）。
   - **ACDC数据集**：3/67标签设置下，DSC达89.98%，优于BCP（87.59%）和SS-Net（65.83%），且在95HD和ASD指标上超越全监督模型。
   - **HRF数据集**：1/26标签设置下，95HD较BCP降低3.26，小血管分割精度显著提升。

![Snipaste_2026-01-26_19-54-51](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/wdx0/1211X673/7AJaSgeEa1UY0VFMckEDVL.png)

![Snipaste_2026-01-26_19-55-08](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/zOxZ/1199X648/00axhF5uMMS52BGUZXq8Qv.png)

![Snipaste_2026-01-26_19-55-19](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/rw8e/1196X653/5ly9z7VvHhFckub1vln2lg.png)

## 实验（Ablation Experiments）​​



1. - **组件有效性**：背景建模分支使LA数据集DSC提升8.45%（82.74%→91.19%），混合层和双向一致性损失进一步提升性能。
   - **双向一致性机制**：直接一致性损失（前景预测对齐）和反向一致性损失（背景预测约束）协同优化，DSC较基线提升2.95%。
   - **跨视角建模优势**：CVBM较双前景建模（DFM）和双背景建模（DBM）在DSC上提升3.12%和4.57%，验证背景辅助的必要性。
2. **鲁棒性分析**
   - **标签比例影响**：低标签比例（10%）下性能提升最显著（DSC+0.62%），高标签比例（60%-100%）性能趋于稳定。
   - **超参数敏感性**：权重因子α=0.5时模型性能最优，平衡标注与未标注数据的贡献。

![Snipaste_2026-01-26_19-59-16](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/LTSF/534X354/7DTpgg47guQDIQOsDLGsOM.png)

## 结论

本文提出了一种新颖的交叉视角双向建模框架（CVBM），突破了现有半监督医学图像分割方法过度关注前景建模的局限。该框架通过显式引入背景建模作为辅助视角，利用背景预测的高确定性提升前景分割的置信度，并设计了双向一致性优化机制确保前景预测与背景引导预测的相互对齐。

在LA、Pancreas、ACDC和HRF四个数据集上的实验表明，CVBM取得了当前最佳性能。特别是在Pancreas数据集上，仅使用20%标记数据（12例）就实现了84.57%的Dice相似系数（DSC），超过了使用62例全标记数据的全监督基线（83.89%）。此外，该方法在推理阶段不增加额外计算开销。

研究证实，背景建模能够有效减少前景预测中的不确定区域，双向一致性约束进一步提升了特征辨别能力。未来工作将探索该框架在无监督学习和主动学习中的应用，利用前景-背景互补关系构建自监督信号或指导样本选择。





