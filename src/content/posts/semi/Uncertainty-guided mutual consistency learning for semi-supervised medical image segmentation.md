---
title: Uncertainty-guided mutual consistency learning for semi-supervised medical image segmentation
published: 2026-01-04 17:01:00
expires: 2026-01-31 23:59:59
description: "医学图像分割是许多临床方法的基础和关键步骤"
category: 半监督医学图像分割
tags: [不确定性评估,Artificial Intelligence In Medicine]
---

:::tip
本文的实验部分值得参考，同时本文也出现了配对t检验，需要重点关注
:::

::github{repo="YichiZhang98/UG-MCL"}

## 摘要

Medical image segmentation is a fundamental and critical step in many clinical approaches. Semi-supervised learning has been widely applied to medical image segmentation tasks since it alleviates the heavy burden of acquiring expert-examined annotations and takes the advantage of unlabeled data which is much easier to acquire. Although consistency learning has been proven to be an effective approach by enforcing an invariance of predictions under different distributions, existing approaches cannot make full use of region-level shape constraint and boundary-level distance information from unlabeled data. In this paper, we propose a novel uncertainty-guided mutual consistency learning framework to effectively exploit unlabeled data by integrating intra-task consistency learning from up-to-date predictions for self-ensembling and cross-task consistency learning from task-level regularization to exploit geometric shape information. The framework is guided by the estimated segmentation uncertainty of models to select out relatively certain predictions for consistency learning, so as to effectively exploit more reliable information from unlabeled data. Experiments on two publicly available benchmark datasets showed that: (1) Our proposed method can achieve significant performance improvement by leveraging unlabeled data, with up to 4.13% and 9.82% in Dice coefficient compared to supervised baseline on left atrium segmentation and brain tumor segmentation, respectively. (2) Compared with other semi-supervised segmentation methods, our proposed method achieve better segmentation performance under the same backbone network and task settings on both datasets, demonstrating the effectiveness and robustness of our method and potential transferability for other medical image segmentation tasks.

## 翻译

医学图像分割是许多临床方法的基础和关键步骤。由于半监督学习减轻了获取专家检验标签的繁重负担，并且利用了更容易获取的未标记数据，因此被广泛应用于医学图像分割任务。尽管一致性学习已被证明是一种有效的方法，可以在不同的分布下增强预测的不变性，但现有的方法不能充分利用来自未标记数据的区域级形状约束和边界级距离信息。在本文中，我们提出了一种新的不确定性指导下的相互一致性学习框架，通过集成来自最新自集成预测的任务内一致性学习和来自任务级正则化的跨任务一致性学习来利用几何形状信息，从而有效地利用未标记数据。该框架以模型估计的分割不确定性为指导，选择相对确定的预测进行一致性学习，从而有效地从未标记的数据中挖掘出更可靠的信息。在两个公开的基准数据集上的实验表明:(1)利用未标记数据，我们提出的方法在左心房分割和脑肿瘤分割上的Dice分别比监督基线提高了4.13%和9.82%。(2)与其他半监督分割方法相比，在相同主干网和任务设置的情况下，我们提出的方法在两个数据集上获得了更好的分割性能，证明了我们的方法的有效性和鲁棒性，以及潜在的可转移性。

## 研究背景

医学图像分割是许多临床方法中的基础且关键步骤。现有深度学习方法虽取得成功，但受限于需要大量专家检查的标注数据。半监督学习通过利用更容易获取的未标记数据，减轻标注负担，已广泛应用于医学图像分割任务。尽管一致性学习通过强制不同分布下预测的不变性被证明有效，但现有方法无法充分利用未标记数据中的区域级形状约束和边界级距离信息。本文提出**不确定性引导的互一致性学习框架**，旨在有效利用未标记数据提升半监督医学图像分割性能。

## 研究现状

#### 1. 全监督学习的局限性

- **依赖标注数据**：现有深度学习方法（如U-Net、3D U-Net、V-Net）需大量专家标注数据，而医学影像标注成本极高（如CT肺部感染分割需400±45分钟/例）。
- **3D数据挑战**：CT/MRI等3D影像的标注负担更重，限制了模型泛化能力。

#### 2. 半监督学习的主流方向

- **伪标签方法**：为无标注数据生成伪标签并用于训练，但伪标签噪声可能导致性能下降。
- **一致性学习**：通过强制模型对扰动输入的预测一致性利用无标注数据，如Mean Teacher框架通过学生-教师模型的EMA权重更新实现自集成。
- **多任务正则化**：引入辅助任务（如边界距离映射）约束几何形状信息，提升分割精度。

#### 3. 不确定性估计的应用

- **可靠性筛选**：通过Monte Carlo Dropout等方法估计预测不确定性，筛选高置信度区域用于一致性学习，减少噪声干扰。

#### 4. 现有方法的不足

- **区域与边界信息利用不足**：传统一致性学习未充分结合区域形状约束与边界距离信息。
- **单任务局限**：依赖单一分割任务输出，缺乏跨任务信息互补。

## 提出的模型

![Snipaste_2026-01-04_19-08-58](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/KTt0/0X0/0343OW9NBIWO037B6Txj0J.webp)



本文提出了一种名为**不确定性引导的互相一致性学习（Uncertainty-guided mutual consistency learning, UG-MCL）** 的半监督医学图像分割框架，核心设计包括以下四个部分：

### 1. **双任务骨干网络**

- **输出分支**：同时生成两种互补的输出
  - **分割概率图**：传统像素级分类任务，输出每个像素属于目标类别的概率
  - **符号距离图**：通过符号距离函数（SDF）将二值掩码转换为距离图，编码目标边界的几何形状信息（内部为负距离，边界为0，外部为正距离）
- **网络结构**：基于V-Net架构，包含编码器-解码器结构，融合多尺度特征

### 2. **互相一致性学习机制**

#### （1）**任务内一致性正则化（Intra-task consistency）**

- **师生模型框架**：
  - 学生模型通过反向传播更新权重，教师模型权重为学生模型的指数移动平均（EMA）
  - 对未标记数据施加输入扰动（如高斯噪声、旋转），要求学生模型输出与教师模型输出一致
- **不确定性引导筛选**：
  - 采用蒙特卡洛 dropout 估计分割不确定性（预测熵）
  - 仅保留低不确定性区域（高置信度预测）用于一致性约束，减少噪声干扰

#### （2）**任务间一致性正则化（Cross-task consistency）**

- **跨任务约束**：强制分割概率图与符号距离图在同一空间中保持一致
  - 将符号距离图通过SDF逆变换转换为伪概率图
  - 最小化分割概率图与伪概率图的L2损失，利用几何形状信息优化分割边界

### 3. **总损失函数**

$L=L_{\mathrm{sup}}+\lambda_{i}L_{\mathrm{itc}}+\lambda_{c}L_{\mathrm{ctc}}$

- $L_{\mathrm{sup}}$：监督损失（Dice损失+交叉熵损失+距离图MSE损失）
- $L_{\mathrm{itc}}$：任务内一致性损失（学生与教师模型输出的MSE）
- $L_{\mathrm{ctc}}$：任务间一致性损失（分割概率图与距离图逆变换的MSE）
- $\lambda_{i}$,$\lambda_{c}$：动态权重（采用高斯 ramp-up 策略，避免早期训练不稳定）

## 实验（Compared with SOTA）

> 数据集：
>
> - **左心房分割（LA）**：100例3D增强MRI扫描，80例训练（20%/16例标记数据+80%/64例未标记数据），20例测试。
> - **脑肿瘤分割（BraTS 2019）**：335例多模态MRI，250例训练（10%/25例或20%/50例标记数据），25例验证，60例测试（使用T2-FLAIR模态）。



> 评估指标：
>
> - **区域匹配指标**：Dice相似系数（Dice）、Jaccard指数（Jaccard）(**交并比**)
> - **边界匹配指标**：平均表面距离（ASD）、95% Hausdorff距离（95HD）


### 1 消融实验（LA数据集）

验证框架各组件有效性，结果见表1：

- **基础模型（仅监督损失）**：Dice=86.03%
- **添加距离图监督**：Dice提升至87.88%
- **添加任务内一致性损失**：Dice提升至89.15%
- **添加任务间一致性损失**：Dice提升至89.42%
- **完整框架（双任务+不确定性引导）**：Dice=90.16%（最佳性能）

### 2 超参数敏感性分析

- **平衡权重β**：控制分割任务与回归任务的自集成权重，β=0.75时性能最优（表2）。
- **不确定性阈值**：采用从3/4 U_max到U_max的线性递增策略（图3）。



![Snipaste_2026-01-04_19-19-56](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/nnNF/693X277/126tdgnDQsHX95TStnD1Xw.png)



### 3 不同标记数据比例的性能

在LA数据集上测试5%~50%标记数据比例，结果见图4：

- 提出方法在所有比例下均优于全监督基线和其他半监督方法。
- 20%标记数据时，Dice较基线提升4.13%；5%标记数据时提升9.82%。

![Snipaste_2026-01-04_19-20-54](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/BcZN/1147X831/62o54Y7k3GorAjYwaBDNRz.png)



### 4 与现有方法对比

- **LA数据集（表3）**：提出方法Dice=90.16%，显著优于UA-MT（88.88%）、DTC（89.42%）等SOTA方法。
- **BraTS数据集（表4）**：10%标记数据时Dice=82.82%（基线73.00%）；20%标记数据时Dice=83.61%（基线76.14%）。

![Snipaste_2026-01-04_19-21-13](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/I9II/1140X480/1VDeurjhDPNDWsXDefYOyf.png)

![Snipaste_2026-01-04_19-21-26](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/ZVxE/1135X542/37MmdMuVuDIoHGaZCZxQlq.png)



### 5 可视化结果

- **左心房分割**：提出方法边界更清晰，区域更完整（图5）。
- **脑肿瘤分割**：对不规则肿瘤区域分割更准确（图6）。

![Snipaste_2026-01-04_19-21-44](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/PSLf/1253X472/5eh0xohkBz7a6i9u7elwkF.png)

![Snipaste_2026-01-04_19-21-54](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/E3o8/1206X443/7TaYzrWS7WZKRIqgT10cmW.png)

## 结论

1. **提出不确定性引导的互一致性学习框架**：结合任务内一致性学习（自集成最新预测）和任务间一致性学习（利用几何形状信息的任务级正则化），通过模型分割不确定性估计筛选可靠预测，有效利用无标记数据。
2. **双任务骨干网络设计**：同时生成分割概率图和符号距离图，从不同角度学习目标表示，任务差异带来内在预测扰动，提升特征学习能力。
3. **显著性能提升**：在左心房分割（LA）和脑肿瘤分割（BraTS）数据集上，较监督基线Dice系数分别提升4.13%和9.82%，接近全监督上限（LA数据集Dice达90.16%，全监督上限为91.14%）。
4. **方法有效性与鲁棒性**：相同骨干网络下，在LA和BraTS数据集上均优于现有半监督分割方法（如UA-MT、DTC），不同标记数据比例（5%-50%）设置下表现稳定，验证了方法的泛化能力。
5. **消融实验验证**：互一致性学习（任务内+任务间）、不确定性引导、双任务监督均为性能提升的关键因素，统计分析显示改进具有显著性（p<0.05）。





