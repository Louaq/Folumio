---
title: CrossMatch Enhance Semi-Supervised Medical Image Segmentation With Perturbation Strategies and Knowledge Distillation
published: 2026-01-22 12:00:00
expires: 2026-08-21 23:59:59
description: "半监督学习医学图像分割提出了一个独特的挑战"
category: 半监督医学图像分割
tags: [JBHI]
---

::github{repo="AiEson/CrossMatch"}


:::note
理论很新
:::



## 摘要

Semi-supervised learning for medical image segmentation presents a unique challenge of efficiently using limited labeled data while leveraging abundant unlabeled data. Despite advancements, existing methods often do not fully exploit the potential of the unlabeled data for enhancing model robustness and accuracy. In this paper, we introduce CrossMatch, a novel framework that integrates knowledge distillation with dual perturbation strategies, image-level and feature-level, to improve the model’s learning from both labeled and unlabeled data. CrossMatch employs multiple encoders and decoders to generate diverse data streams, which undergo self-knowledge distillation to enhance the consistency and reliability of predictions across varied perturbations. Our method significantly surpasses other state-of-the-art techniques in standard benchmarks by effectively minimizing the gap between training on labeled and unlabeled data and improving edge accuracy and generalization in medical image segmentation. The efficacy of CrossMatch is demonstrated through extensive experimental validations, showing remarkable performance improvements without increasing computational costs.

## 翻译

半监督学习医学图像分割提出了一个独特的挑战，有效地利用有限的标记数据，同时利用大量的未标记数据。尽管取得了进步，但现有的方法往往不能充分利用未标记数据的潜力来增强模型的鲁棒性和准确性。在本文中，我们引入了一种新的框架CrossMatch，它将**知识蒸馏与图像级和特征级双扰动策略**相结合，以提高模型对标记和未标记数据的学习能力。CrossMatch采用多个编码器和解码器来生成不同的数据流，这些数据流经过自我知识蒸馏，以提高预测在不同扰动下的一致性和可靠性。我们的方法通过有效地减少标记和未标记数据训练之间的差距，提高医学图像分割的边缘准确性和泛化程度，在标准基准上显著优于其他最先进的技术。通过大量的实验验证证明了CrossMatch的有效性，在不增加计算成本的情况下显示出显着的性能改进。

## 研究背景

医学图像分割中，全监督学习需大量标注数据，但医学数据标注成本高、操作复杂，限制其应用。半监督学习结合少量标注数据与大量未标注数据，可降低标注成本并实现精准分割，成为研究热点。当前半监督方法存在未充分挖掘未标注数据潜力以提升模型鲁棒性和准确性的问题。

现有研究多依赖对抗训练、一致性正则化、自训练等策略，知识蒸馏也用于优化模型结构。图像级和特征级扰动能增强模型对输入变化的鲁棒性及泛化能力，但特征级扰动在编码器提取特征上的应用未充分探索。知识蒸馏中，自蒸馏方法通过模型自身生成的软标签引导训练，可减少对标注数据依赖，提升模型在未标注数据上的适应性和准确性。

基于此，本文提出CrossMatch框架，整合知识蒸馏与图像级、特征级双重扰动策略，以改进模型从标注和未标注数据中的学习效果。

## 研究现状

1. **半监督医学图像分割主流方法**
   - **一致性正则化**：通过对同一输入施加不同扰动（如图像旋转、裁剪、噪声添加），要求模型输出一致预测，代表方法如FixMatch、UniMatch。
   - **自训练与伪标签**：利用少量标注数据训练模型，对无标注数据生成伪标签并迭代优化，如FreeMatch通过动态阈值筛选高置信度伪标签。
   - **知识蒸馏与协作学习**：采用教师-学生模型架构，通过知识迁移提升性能，如DMD利用Dice损失优化医学图像分割的类别不平衡问题。
2. **技术融合趋势**
   - 结合图像级与特征级扰动：图像级扰动（如CutMix、MixUp）扩展数据分布，特征级扰动（如Dropout、噪声注入）增强模型对深层特征的鲁棒性。
   - 多编码器/解码器结构：通过多分支网络生成多样化输出，提升预测一致性，如MC-Net采用共享编码器与多解码器结构。

## 提出的模型

rossMatch是一种用于半监督医学图像分割的创新框架，核心思想是通过**双重扰动策略**（图像级和特征级）与**自知识蒸馏**（Self-Knowledge Distillation）结合，充分利用有限标注数据和大量无标注数据，提升模型的鲁棒性和分割精度。

![Snipaste_2026-01-22_09-11-08](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/UGr3/0X0/0343OUg41BFQlvGqyIPtcS.webp)

![Snipaste_2026-01-22_09-11-34](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/I8kN/602X442/7H2NeE0ehnuOkQpwhpfTA7.png)

![Snipaste_2026-01-22_09-11-40](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/HcgP/578X534/2iIqI70ThYxG3646uYlWGm.png)

### **核心设计**

1. **多编码器-解码器架构**
   - **图像级扰动**：对输入图像施加弱扰动（如随机旋转、翻转）和强扰动（如CutMix、MixUp），生成不同编码器（弱扰动编码器`ew`和强扰动编码器`es`）。
   - **特征级扰动**：在解码器输入的高维特征中引入扰动（如Dropout），生成3种解码器（无扰动`dn`、弱扰动`dw`、强扰动`ds`）。
2. **自知识蒸馏机制**
   - **教师-学生模型**：将无扰动的前向流（`ew→dn`）作为“教师”，指导其他扰动流（如`ew→dw`、`es→ds`等）的学习，通过最小化预测分布差异实现知识传递。
   - **解码器蒸馏**：同一解码器在不同扰动下的输出（如`ew→dw`与`es→dw`）进行互蒸馏，平衡教师与学生模型的能力差距。
3. **损失函数设计**
   - **监督损失（Lsup）**：结合Dice损失和交叉熵损失，优化标注数据的分割精度。
   - **图像级扰动损失（Lip）**：监督强扰动图像的预测一致性。
   - **教师蒸馏损失（Ltkd）**：教师模型指导所有学生模型的学习。
   - **解码器蒸馏损失（Ldkd）**：同一解码器的不同扰动输出互蒸馏。
   - **总损失**：`Ltotal = Lsup + Lip + (1-η)Ltkd + ηLdkd`，其中η平衡两种蒸馏损失。

### **创新点**

1. **双重扰动空间扩展**：通过图像级和特征级扰动的组合，构建更丰富的扰动空间，增强模型对数据变化的鲁棒性。
2. **自知识蒸馏优化**：无需预训练教师模型，通过内部扰动流的互学习实现知识传递，降低对标注数据的依赖。
3. **计算效率**：采用批量特征堆叠和并行处理，在不增加参数的前提下提升性能，单迭代时间仅210ms（低于同类方法如CAML的1057ms）。

![Snipaste_2026-01-22_09-12-19](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/5T7Z/597X576/7WOy6sR7FkMVlMEO8tAFAy.png)

## 实验（Compared with SOTA）



> **数据集：**
>
>  - **LA（Left Atrium）**：3D MRI左心房分割数据集，分辨率0.625×0.625×0.625 mm³，随机裁剪为112×112×80。
> - **ACDC（Automatic Cardiac Diagnosis Challenge）**：心脏MRI数据集，裁剪为256×256。
> - **Pancreas-CT**：腹部CT胰腺分割数据集，重采样至1.0 mm各向同性分辨率，裁剪为96×96×96。
> - **ISIC 2018**：皮肤病变RGB图像数据集， resize为256×256。
>
> **标签设置**：针对每个数据集，分别使用5%、10%、20%的标注数据进行半监督训练，并与全监督模型对比。

![Snipaste_2026-01-22_09-14-20](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/BPdi/691X784/7dBwJIoXXADVGG9wHrdLkS.png)



- **边缘准确性**：在LA和Pancreas-CT数据集上，CrossMatch分割边缘更平滑，误分类体素更少（如图4、图5所示）。
- **复杂结构处理**：对左心房 appendage 和胰腺尾部等小结构的分割更精确，减少了因组织相似性导致的误分割。

## 实验（Ablation Experiments）​​

#### **（1）损失函数组件验证**

- **教师蒸馏损失（Ltkd）**：移除任意监督流（如ps_w或pw_s）会导致Dice下降0.5-1.2%，证明多流扰动的必要性。
- **解码器蒸馏损失（Ldkd）**：同时使用弱/强扰动解码器（Lw_dkd+Ls_dkd）比单一扰动提升Dice 0.63-5.14%。

#### **（2）扰动策略分析**

- **特征扰动类型**：标准Dropout3D性能优于AlphaDropout和FeatureAlphaDropout，强扰动（75% Dropout）可增强模型鲁棒性。
- **图像级扰动**：双强扰动（xs1、xs2）比单一扰动提升Dice 1.8%，符合对比学习原理。

#### **（3）超参数影响**

- **阈值τ**：τ=0.85时性能最优，过低导致伪标签噪声，过高限制知识传递。
- **平衡系数η**：η=0.3时Dice最高，平衡教师与解码器蒸馏损失的权重。

![Snipaste_2026-01-22_09-15-20](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/wPf1/572X371/0c1mag6KBiZ1kWPWqAu4Au.png)

![Snipaste_2026-01-22_09-15-25](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/leEy/574X318/3QG2TuZQPMVIJXWjTWUxMv.png)

![Snipaste_2026-01-22_09-15-33](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/LQ3A/558X401/1gDoz1zuO2DsZkFZPJkCyu.png)



## 结论

研究重新评估了自知识在半监督医学图像分割中的作用，提出了一种名为CrossMatch的自训练分割方法。该方法巧妙整合了特征扰动、一致性正则化和知识蒸馏技术，通过从图像级扰动中衍生两个编码器，从特征级扰动中衍生三个解码器，将无扰动前馈流指定为教师模型，对编码器和解码器组合产生的四组结果进行知识蒸馏。同时利用小批量特性优化方法性能，并提供了定量的迭代时间对比表。

实验结果表明，CrossMatch在四个基准数据集（LA、ACDC、Pancreas-CT和ISIC-2018）上表现出稳健性能，显著优于现有最先进方法。大量消融研究进一步验证了该方法的假设和设计有效性。





