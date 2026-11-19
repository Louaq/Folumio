---
title: A Novel 3D Unsupervised Domain Adaptation Framework for Cross-Modality Medical Image Segmentation
published: 2025-07-27 16:21:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "我们考虑了跨模态医学图像分割中的体积（3D）无监督域适应（UDA）问题"
categories: 多模态医学图像分割
tags: [Unsupervised Domain Adaptation]
---

## 摘要

We consider the problem of volumetric (3D) unsupervised domain adaptation (UDA) in cross-modality medical image segmentation, aiming to perform segmentation on the unannotated target domain (e.g. MRI) with the help of labeled source domain (e.g. CT). Previous UDA methods in medical image analysis usually suffer from two challenges: 1) they focus on processing and analyzing data at 2D level only, thus missing semantic information from the depth level; 2) one-to-one mapping is adopted during the style-transfer process, leading to insufficient alignment in the target domain. Different from the existing methods, in our work, we conduct a first of its kind investigation on multi-style image translation for complete image alignment to alleviate the domain shift problem, and also introduce 3D segmentation in domain adaptation tasks to maintain semantic consistency at the depth level. In particular, we develop an unsupervised domain adaptation framework incorporating a novel quartet self-attention module to efficiently enhance relationships between widely separated features in spatial regions on a higher dimension, leading to a substantial improvement in segmentation accuracy in the unlabeled target domain. In two challenging cross-modality tasks, specifically brain structures and multi-organ abdominal segmentation, our model is shown to outperform current state-of-the-art methods by a significant margin, demonstrating its potential as a benchmark resource for the biomedical and health informatics research community.

## 翻译

我们考虑了**跨模态医学图像分割**中的体积（3D）无监督域适应（UDA）问题，旨在利用有标注的源域（例如CT）对未标注的目标域（例如MRI）进行分割。先前在医学图像分析中的UDA方法通常面临两个挑战：1）它们仅关注于2D层面的数据处理和分析，从而忽略了深度层面的语义信息；2）在风格转换过程中采用一对一映射，导致目标域对齐不足。有别于现有方法，我们在研究中首次探讨了多风格图像翻译，以实现完整的图像对齐，从而缓解域偏移问题，并在域适应任务中引入3D分割以维持深度层面的语义一致性。特别地，我们开发了一种无监督域适应框架，结合了一种新颖的四重自注意力模块，以高效增强高维空间区域中远距离特征之间的关系，从而显著提高未标注目标域的分割准确性。在两个具有挑战性的跨模态任务中，具体是大脑结构和多器官腹部分割，我们的模型表现出色，明显超越了当前的最先进方法，展示了其作为生物医学和健康信息学研究社区基准资源的潜力。

## 研究背景

- **CNN在医学图像应用的局限**：近年来，深度卷积神经网络（CNNs）在医学图像处理中蓬勃发展，但由于不同成像模态、扫描协议和人口统计特性，训练集和测试集的数据分布差异严重，导致训练良好的深度模型在实际场景中表现不佳。
- **传统方法的困境**：为减少不同模态间的性能下降，使用标注的目标数据微调预训练模型的方法，因标注过程繁琐和隐私问题，在医学图像中并不适用。无监督域适应（UDA）无需目标域的真实标签，更具吸引力和可行性。
- **现有UDA方法的不足**：当前基于UDA的医学图像分析方法存在缺陷。一是倾向于在2D层面处理数据，忽略医学图像中的3D信息，导致深度层面的语义信息缺失；二是风格迁移过程采用一对一映射，仅考虑各域的平均风格，导致部分图像对齐，削弱模型在目标域边缘样本上的泛化能力。

基于以上背景，作者提出了一种新颖的**3D无监督域适应框架**，以解决现有方法的问题。

![Snipaste_2025-07-27_16-25-53](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/ZYAt/0X0/0343OU4jG70A9q1fXkF9eQ.webp)

## 研究现状

- **深度学习应用**：近年来，深度卷积神经网络（CNNs）在医学图像处理领域发展迅速，但因成像方式、扫描协议和人口统计学特性等因素，导致训练集和测试集数据分布差异大，模型泛化能力受限。
- **无监督域适应（UDA）方法**：当前医学图像分析中的UDA方法主要包括图像对齐和特征对齐。图像对齐通过非配对图像到图像的转换，将源域图像风格转换为目标域；特征对齐则通过对抗训练提取域不变特征。

## 提出的模型

![Snipaste_2025-07-27_16-29-17](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-27_16-29-17.png)



![Snipaste_2025-07-27_16-27-52](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-27_16-27-52.png)

### 2D转换网络

用于内容 - 风格解缠，旨在最小化源域和目标域之间的域差距。

- **网络组件**：由一个共享内容编码器`Genc_c`、两个特定于域的风格编码器`Genc_sa`和`Genc_sb`、一个共享解码器`Gdec`、一个内容判别器`Dc`以及两个图像判别器`Da`和`Db`构成。
- **工作过程**：编码器将输入图像分解为内容表示和风格表示，解码器通过自适应实例归一化（AdaIN）层注入风格表示，从内容表示中重建图像。
- **损失函数：**
  - **重建损失**：在像素级、内容级和风格级分别采用三种重建损失，以确保图像与内容和风格表示之间的双射映射，并保留两个域的内容和风格信息。
  - **对抗损失**：包括像素级对抗训练和内容级对抗训练，通过生成对抗网络（GAN）使翻译图像的分布与目标数据分布相匹配，进一步对齐两个域的内容表示。

### 3D分割网络（DAR - UNet）

利用翻译后的图像（体积）进行训练，以实现3D医学图像的分割。

- **Voxel - Wise Attention Module（VAM）**：在U - Net架构的解码器部分添加体素级注意力模块，使解码器专注于特征图的关键区域，增强特征质量。
- **Quartet Attention Module（QAM）**：在每个残差块中采用四重注意力模块，捕获输入张量不同维度之间的相邻语义信息，有效保持深度级别的语义一致性。
- **Anisotropic Resolution Network**：采用各向异性设计，减少内存成本。网络的前两层和后三层在深度、宽度和高度上分别使用不同的步幅，能够处理平面外分辨率是平面内分辨率4倍的图像，在不降低性能的情况下显著减少内存占用。
- **分割损失**：使用深度监督策略，结合软Dice损失和Focal损失，缓解训练过程中的梯度消失问题，克服前景和背景之间的不平衡问题。





## 实验设置

- 数据集
  - **前庭神经鞘瘤分割数据集**：包含来自不同临床站点的105个对比增强T1（ceT1）和105个高分辨率T2（hrT2）磁共振成像（MRI）体积。仅在“ceT1到hrT2”方向上完成适应实验，分割标签包含耳蜗和前庭神经鞘瘤两个心脏结构。
  - **腹部多器官数据集**：包括从[34]收集的30个体积的CT数据和从ISBI 2019 CHAOS挑战赛[35]收集的20个体积的T2 - SPIR MRI训练数据。在“CT到MRI”和“MRI到CT”两个方向进行实验，要分割的腹部器官有肝脏、右肾、左肾和脾脏。对数据集进行了空间归一化、填充、最小 - 最大归一化等预处理操作。
- 实现细节
  - 使用一个RTX 3090 GPU（24G内存）进行实验。
  - 对于风格迁移训练，使用LSGANs稳定训练，使用AdaBelief优化解缠GAN的参数，训练50个epoch，判别器和生成器学习率分别为2e - 4和1e - 4。
  - 对于分割训练，使用AdaBelief优化参数，训练100个epoch，初始学习率为5e - 4，采用余弦学习率衰减策略。以2的批量大小训练DAR - UNet，训练时随机裁剪32 × 256 × 256体素的子体积，并进行数据增强。
  - 推理时采用滑动窗口策略。
- 评估指标
  - **Dice相似系数（Dice）**：衡量预测掩码和真实掩码之间的体素级重叠率。
  - **平均对称表面距离（ASD）**：计算三维中两个表面之间的平均距离。Dice值越高、ASD值越低表示分割性能越好。

## 实验（Compared with SOTA）

将提出的方法与**前庭神经鞘瘤和腹部多器官分割**任务中的现有技术方法进行比较，包括SynSeg - Net、AdaOutput、CycleGAN等经典2D UDA方法。结果表明，本文方法在大多数情况下显著优于其他方法，尤其是在前庭神经鞘瘤数据集上。经典2D UDA方法由于背景占比大、类不平衡问题而表现不佳，利用图像和特征对齐的方法比单一对齐方法效果更好，本文方法即使不使用特征对齐，也能通过完整的图像对齐取得良好结果。不过，在腹部多器官数据集的MRI - CT方向上，ASD结果比其他方法差，可能是由于MRI和CT图像的注释标准不同。

![Snipaste_2025-07-27_16-32-43](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-27_16-32-43.png)

![Snipaste_2025-07-27_16-32-48](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-27_16-32-48.png)

![Snipaste_2025-07-27_16-33-47](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-27_16-33-47.png)

## 3. 完整图像对齐的效果

在腹部多器官数据上进行不同风格迁移设置的实验，分别使用纠缠GAN、平均风格生成的解缠GAN和多风格生成的解缠GAN生成的转移图像来训练DAR - UNet。结果显示，纠缠GAN的Dice值最低，多风格转换在减少域差距方面最有效，证明了多风格转换策略在减少域差距方面的有效性

![Snipaste_2025-07-27_16-34-10](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-27_16-34-10.png)

## 实验（Ablation Experiments）​​

在腹部数据集的CT到MRI适应任务上，对提出的DAR - UNet的五个变体进行消融实验。结果表明： - 加入各向异性架构可显著降低内存成本并提高性能。 - QAM和VAM注意力模块能显著提升3D分割任务性能，两者结合比单独使用效果更好。 - 深度监督策略可通过缓解梯度消失问题进一步提升性能，且额外内存成本较小。

![Snipaste_2025-07-27_16-34-33](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-27_16-34-33.png)

## 结论

作者提出了一种用于**跨模态医学图像分割**的新型**3D无监督域适应**框架，经研究得出以下结论：

1. **方法性能出色**：结合多风格转换和双注意力模块，该框架在减轻域偏移问题上表现出色。在两个跨模态任务（前庭神经鞘瘤和腹部多器官分割）中，显著超越了现有最先进的方法。
2. **模块互补有效**：精心设计的VAM和QAM两个注意力模块相互补充，适用于3D UNet架构，能使DAR - UNet在类目标源数据集上训练，并在目标域良好泛化。
3. **存在一定局限**：采用**2D图像到图像的转换**可能导致轴向样式不一致，且作为两步框架，特征对齐和语义分割无法同时优化，未来需探索全端到端的3D无监督域适应框架。
