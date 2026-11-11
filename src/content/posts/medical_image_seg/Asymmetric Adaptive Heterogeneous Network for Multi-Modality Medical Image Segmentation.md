---
title: Asymmetric Adaptive Heterogeneous Network for Multi-Modality Medical Image Segmentation
published: 2025-07-05 10:24:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "现有的多模态医学图像分割研究往往在不加区分地聚合所有模态，并采用多个对称编码器或解码器进行特征提取和融合时"
categories: 多模态医学图像分割
tags: [Asymmetric encoding, adaptive heterogeneous graph fusion]
top: true
img: "https://pic1.imgdb.cn/item/6919c43e3203f7be000aeb19.jpg"
---

重庆邮电大学、第三军医大学、重庆医科大学第二附属医院

## 摘要

Existing studies of **multi-modality medical image segmentation** tend to aggregate all modalities without discrimination and employ multiple symmetric encoders or decoders for feature extraction and fusion. They often over-look the different contributions to visual representation and intelligent decisions among multi-modality images. Motivated by this discovery, this paper proposes an asymmetric adaptive heterogeneous network for multi-modality image feature extraction with modality discrimination and adaptive fusion. For feature extraction, it uses a heterogeneous two-stream asymmetric feature-bridging network to extract complementary features from auxiliary multi-modality and leading single-modality images, respectively. For feature adaptive fusion, the proposed Transformer-CNN Feature Alignment and Fusion (T-CFAF) module enhances the leading single-modality information, and the Cross-Modality Heterogeneous Graph Fusion (CMHGF) module further fuses multi-modality features at a high-level semantic layer adaptively. Comparative evaluation with ten segmentation models on six datasets demonstrates significant efficiency gains as well as highly competitive segmentation accuracy. ((Our code is publicly available at https://github.com/joker-527/AAHN)

## 翻译

现有的多模态医学图像分割研究往往在不加区分地聚合所有模态，并采用多个对称编码器或解码器进行特征提取和融合时，忽视了多模态图像在视觉表示和智能决策中的不同贡献。受此发现的启发，本文提出了一种用于多模态图像特征提取的**非对称自适应异构网络**，该网络具有模态区分和自适应融合功能。在特征提取方面，使用异构双流非对称特征桥接网络分别从辅助多模态和主要单模态图像中提取互补特征。对于特征自适应融合，提出的Transformer-CNN特征对齐与融合（T-CFAF）模块增强了主要单模态信息，而跨模态异构图融合（CMHGF）模块进一步在高级语义层自适应地融合多模态特征。与六个数据集上的十个分割模型进行比较评估，结果显示显著的效率提升以及极具竞争力的分割准确性。（我们的代码在https://github.com/joker-527/AAHN公开提供）

## 研究背景

![Snipaste_2025-07-05_16-28-08](https://pic1.imgdb.cn/i/0343OUFaAHZDnmlnGvn0Ox.webp)



多模态医学图像能从多个角度提供互补信息，整合不同成像模态可提升成像数据的敏感性、特异性和空间分辨率。然而，现有多模态医学图像分割研究存在两个关键问题：

1. **特征提取问题**：现有方法倾向于无差别聚合所有模态，采用对称编码器或解码器进行特征提取，忽略了不同模态图像对视觉表示和智能决策的不同贡献，难以有效提取多模态图像中独特且互补的特征。 
2. **特征融合问题**：常见的特征融合方法是在通道维度上进行初始拼接或求和，然后输入特定融合模块，这种方式可能导致性能瓶颈，无法实现多模态特征的自适应融合，还可能造成独特特征的丢失。 

为解决这些问题，本文提出了一种用于多模态医学图像特征提取的非对称自适应异构网络，旨在实现模态区分和自适应融合，以有效管理多模态特征的异质性，显著提高分割结果。 

## 研究现状

- **多模态特征提取**：常见方法有集中提取（如3D AGSE - VNet、MBANet、Swin UNETR）和单独提取（如ME - Net、MAML、NestedFormer、A2FSeg），但大多基于对称特征提取，未考虑模态关系。
- **特征融合**：现有方法常采用初始拼接或求和，再通过特定融合模块处理，如IVD - Net、Wang等人和Zhou等人的方法，但可能导致性能瓶颈，且简单使用CNN或Transformer会损失独特特征。
- **CNN和Transformer结合**：多种方法将两者结合用于医学图像处理，但常忽略不同模态图像特征的异质性。
- **图神经网络应用**：用于分割的图结构模型主要关注单模态，难以处理多模态图像的异质性。

## 提出的模型

![Snipaste_2025-07-05_16-31-41](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-05_16-31-41.png)

### 整体架构

模型的整体架构包括一个非对称双分支特征桥接编码器、Transformer - CNN 特征对齐与融合（T - CFAF）模块、跨模态异质图融合（CMHGF）模块和解码器，主要流程为：

1. **特征提取**：使用非对称双分支特征桥接编码器从辅助多模态和主导单模态图像中分别提取互补特征。
2. **特征融合**：T - CFAF 模块增强主导单模态信息，CMHGF 模块在高层语义层自适应地融合多模态特征。
3. **图像分割**：解码器通过跳跃连接逐步对齐来自 CNN 分支的低层次和高层次特征，实现最终的分割。

### 主要组件

- 非对称双分支特征桥接编码器：
  - **多模态 Transformer 分支**：具有强大的全局上下文信息建模能力，能够更好地捕捉辅助多模态特征。该分支包括嵌入层和骨干结构。嵌入层采用传统卷积结构，可保留位置信息并提取详细特征；骨干结构是 CNN 和 ViT 的混合组合，结合了两者的优势，能够保留 CNN 的准确位置信息和 Transformers 的全局上下文建模能力。
  - **单模态 CNN 分支**：利用 CNN 保留局部细节的能力处理主导单模态图像。主要由多个残差块（RES）和 T - CFAF 模块组成，通过平均池化形成特征金字塔结构，用于提取多尺度特征。
- **Transformer - CNN 特征对齐与融合（T-CFAF）模块**：为了增强 CNN 分支上主导单模态信息，该模块将多模态特征图和单模态特征图在通道维度上拼接，通过计算通道注意力和跨模态注意力，调整通道权重，补充多模态信息，增强主导 CNN 特征。
- **跨模态异构图融合（CMHGF）模块**：用于缓解不同模态之间的特征异质性，实现跨模态特征的自适应融合。该模块将特征图空间投影到图空间，通过图卷积操作更新节点特征，构建异质图，计算节点间的相似度，更新节点特征向量，最终实现多模态特征的融合。

## 实验（Compared with SOTA）

- 数据集：在六个数据集上进行实验，涵盖不同医学场景，为模型性能评估提供多样数据支持。
  - **Hecktor21**：来自2021年Aicrowd在MICCAI发布的HECKTOR挑战，包含325名患者的18F - FDG PET和CT扫描，其中224例有标注。
  - **Prostate158**：包含158个前列腺MRI，专家标注，有T2加权和扩散加权图像及表观扩散系数图，目标区域为前列腺周围区（PZ）和过渡区（TZ）。
  - **BraTS2019和BraTS2023**：来自2019年和2023年脑肿瘤分割挑战，分别有335和1251个标注的MRI图像，每个病例有四种模态，标注区域包括肿瘤的三个子区域。
  - **CHAOS**：来自联合（CT - MR）健康腹部器官分割挑战的任务5，旨在从20个不同序列的MRI数据集中分割腹部器官。
  - **BraTS2024**：专注于治疗后神经胶质瘤的自动多区域脑肿瘤分割，使用治疗后的MRI，评估子区域包括非增强肿瘤核心等。
- **实现细节**：使用Pytorch - 1.7.1实现，在单张24GB NVIDIA GeForce RTX 3090 GPU上从零开始训练300个epoch，批量大小为16，输入图像调整为128×128。采用SGD优化器，初始学习率0.001并使用动态学习率策略，结合交叉熵损失和Dice损失训练网络。根据器官和病变可见性直观选择单模态分支作为CNN分支的输入。



![Snipaste_2025-07-05_16-35-31](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-05_16-35-31.png)

- **头颈部肿瘤分割（Hecktor21数据集）**：该方法在HD95指标上取得最低分2.0793，Dice系数达到最高0.8242。箱线图显示其在Dice和HD95得分上表现更优且稳定，可视化结果表明该方法分割结果接近真实情况，对小目标体积也有良好处理能力。
- **前列腺分割（Prostate158数据集）**：在PZ和TZ区域的Dice得分表现更好，PZ区域Dice得分为0.7833，TZ区域为0.8921，相比其他方法有显著提升。在HD95指标上虽未都达到最佳，但与最佳方法差距小，整体表现最优，且具有稳定性。可视化结果显示该方法在PZ区域过分割和欠分割问题较少，3D视角结果更接近真实情况。
- **脑肿瘤分割（BraTS2019数据集）**：在WT和TC区域Dice得分最高，分别为0.9280和0.8764，ET区域Dice得分仅次于MAML模型。HD95指标上，ET区域得分最低，WT和TC区域与最佳方法差距不显著，整体平均HD95得分最低。箱线图显示Dice和HD95得分分布更集中，异常值少。可视化结果表明该方法在脑肿瘤和水肿区域分割更准确。
- **腹部器官分割（CHAOS数据集）**：在所有评估器官上均优于其他方法，肝脏、右肾、左肾和脾脏的Dice系数分别为0.9206、0.9350、0.9077和0.9208，HD95也表现良好。箱线图显示该方法在两个指标下箱体高度最短，变异性最低，异常值最少，稳定性高。可视化结果表明该方法在不同形状和大小的腹部器官分割上表现更好。
- **脑肿瘤分割（BraTS2023数据集）**：在WT、TC和ET区域的Dice和HD95指标上均表现优异，Dice得分分别为0.9371、0.9054和0.8629，HD95值分别为2.7786mm、3.3692mm和2.3758mm。箱线图显示WT区域Dice得分和三个区域HD95得分分布更集中，TC和ET区域Dice得分异常值少。可视化结果表明该方法在脑肿瘤和水肿区域分割更准确，具有良好的泛化能力。
- **脑肿瘤分割（BraTS2024数据集）**：除NETC区域的HD95外，在所有评估肿瘤区域表现显著提升，在TC、WT、SNFH和RC区域Dice得分最高，HD95得分较低。可视化结果表明该方法在不同子区域分割更准确。
- **在线评估结果（BraTS2023验证集）**：与竞争方法相比，该方法在TC区域取得有竞争力的结果，Dice为0.860，HD95为15.110。该方法属于研究导向方法，注重探索不同模态的异构表示和融合，虽一些竞争方法计算能力和后处理技术强，但该方法在整体分割性能和泛化能力上表现出色。



![Snipaste_2025-07-05_16-36-26](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-05_16-36-26.png)

## 实验（Ablation Experiments）​​

- **各模块有效性**

  - **T - CFAF模块**：移除该模块会导致Dice得分和HD95距离显著下降，添加CA和CMA可提高平均Dice得分，降低HD95距离。可视化结果表明添加T - CFAF后模型分割更接近真实情况。该模块有效补充多模态信息，促进特征提取，提高整体分割性能。
  - **CMHGF模块**：用通道连接结构替代该模块会使平均Dice得分下降，HD95距离增加。在BraTS2019数据集上的详细实验表明，CMHGF模块比CMA模块更能有效整合跨模态特征，增强分割准确性，跳跃连接和GNN结构对模型性能提升起关键作用。

- **不同单模态分支比较**：不同主要模态输入会导致不同结果，但该模型在大多数情况下与无模态区分的方法相比，能产生最高分割准确率。不同模态贡献不同，如头颈部肿瘤分割中高分辨率CT图像局部信息可提高准确性，脑肿瘤分割中T2图像因能清晰描绘病变而表现更好，前列腺和腹部器官分割中不同主要模态结果无明显规律。

  ![Snipaste_2025-07-05_16-37-31](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-05_16-37-31.png)



![Snipaste_2025-07-05_16-38-07](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-05_16-38-07.png)

## 结论

作者提出了一种用于多模态医学图像分割的非对称异构网络，得出以下结论：
1. 创新性模块有效：特征桥接的Transformer - CNN非对称双编码器分支可高效提取辅助多模态和主导单模态的互补特征；T - CFAF模块促进多模态信息集成到单模态分支；CMHGF模块利用图结构自适应融合双编码器的跨模态特征。
2. 性能优越：实验结果表明，该方法显著优于现有的多模态分割方法，在多个数据集上的各项指标表现出色。
3. 具有通用性：该模型可作为通用的多模态研究框架，单模态编码分支易于替换，未来可进一步研究基于文本-图像的多模态模型。 



> 不足：
>
> **(1) 参数数量和模型复杂度**：该方法的参数数量和计算量较大，每批次大小为1时，有4.1137亿个参数和941.001 GFLOPs，相比其他方法规模更大。这一问题导致受限于GPU内存，只能使用二维网络。尽管采用的非对称特征编码结构以及T - CFAF和CMHGF特征对齐融合模块能有效学习多模态信息并取得优于现有先进技术的结果，但大量的参数限制了模型在处理能力或内存受限的实际场景中的应用。 
>
> **(2) 处理不完整模态数据能力**：该方法主要聚焦于对齐的多模态医学图像分割。然而在实际临床环境中，由于设备限制或患者状况等原因，可能会出现模态缺失的情况。未来研究需要解决在模态数据不完整的情况下进行有效分割的问题，即开发出能够适应模态缺失情况，并在关键模态信息缺失时仍能保持高分割精度的鲁棒算法。 
