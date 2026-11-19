---
title: Stitching Fine-Tuning and Re-Training A SAM-Enabled Framework for Semi-Supervised 3D Medical Image Segmentation
published: 2025-12-16 14:44:00
expires: 2025-12-31 23:59:59
mathjax: true
description: "Segment Anything Model（SAM）"
category: 半监督医学图像分割
tags: [SAM]
---


:::note
代码不完整，缺少文件，不能复现
:::

::github{repo="ShumengLI/SFR"}


## 摘要

Segment Anything Model (SAM) fine-tuning has shown remarkable performance in medical image segmentation in a fully supervised manner, but requires precise annotations. To reduce the annotation cost and maintain satisfactory performance, in this work, we leverage the capabilities of SAM for establishing semi-supervised medical image segmentation models. Rethinking the requirements of effectiveness, efficiency, and compatibility, we propose a three-stage framework, i.e., Stitching, Fine-tuning, and Re-training (SFR). The current fine-tuning approaches mostly involve 2D slice-wise fine-tuning that disregards the contextual information between adjacent slices. Our stitching strategy mitigates the mismatch between natural and 3D medical images. The stitched images are then used for fine-tuning SAM, providing robust initialization of pseudo-labels. Afterwards, we train a 3D semi-supervised segmentation model while maintaining the same parameter size as the conventional segmenter such as V-Net. Our SFR framework is plug-and-play, and easily compatible with various popular semi-supervised methods. We also develop an extended framework SFR+ with selective fine-tuning and re-training through confidence estimation. Extensive experiments validate that our SFR and SFR+ achieve significant improvements in both moderate annotation and scarce annotation across five datasets. In particular, SFR framework improves the Dice score of Mean Teacher from 29.68% to 74.40% with only one labeled data of LA dataset. The code is available at https://github.com/ShumengLI/SFR

## 翻译

Segment Anything Model（SAM）的微调在全监督模式下在医学图像分割中表现出色，但需要精确的注释。为了降低注释成本并保持令人满意的性能，在这项工作中，我们利用SAM的能力来建立半监督的医学图像分割模型。重新思考有效性、效率和兼容性的要求，我们提出了一个三阶段框架，即拼接、微调和再训练（SFR）。当前的微调方法主要涉及2D切片的逐片微调，忽略了相邻切片之间的上下文信息。我们的拼接策略缓解了自然图像与3D医学图像之间的不匹配。拼接后的图像用于微调SAM，提供了稳健的伪标签初始化。之后，我们训练一个3D半监督分割模型，同时保持与传统分割器（如V-Net）相同的参数大小。我们的SFR框架是即插即用的，并且易于兼容各种流行的半监督方法。我们还通过置信度估计开发了一个扩展框架SFR+，进行选择性微调和再训练。大量实验验证了我们的SFR和SFR+在五个数据集上在中等注释和稀缺注释方面均实现了显著改进。特别是，SFR框架将Mean Teacher在仅有一个标注的LA数据集上的Dice得分从29.68%提高到了74.40%。代码可在https://github.com/ShumengLI/SFR

## 研究背景

近年来，视觉基础模型（如SAM）在医学图像分割中展现出优异性能，但现有研究多依赖全监督微调，需大量精确标注，而医学图像标注成本高昂、过程繁琐。半监督学习虽能减少标注需求，部分方法在40%标注量下性能接近全监督，但如何有效结合基础模型能力与半监督框架仍面临挑战：

1. **初始化质量问题**：现有2D切片级微调忽略3D医学图像的层间上下文信息，导致伪标签质量不足；
2. **模型效率问题**：基础模型参数量庞大（如SAM），推理成本高，而医学图像纹理有限，存在参数冗余；
3. **兼容性问题**：需设计通用框架以适配主流半监督方法（如Mean Teacher、MagicNet），并支持未来方法扩展。

为此，本文提出SFR框架，通过切片拼接（Stitching）、基础模型微调（Fine-tuning）和半监督重训练（Re-training）三阶段，在减少标注成本的同时保持高性能，解决上述有效性、效率与兼容性问题。

![Snipaste_2025-12-16_14-54-19](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/SRwx/0X0/0343OW4aXkgiyTlqdwVUaL.webp)

## 研究现状

1. **基础模型应用**：视觉基础模型（如SAM、SegGPT）凭借强泛化能力被引入医学影像分割，通过提示工程（如CC-SAM）或适配器微调（如MedSAM、SAMed）适配医学数据，但多为全监督学习，依赖大量精确标注。
2. **半监督学习进展**：半监督方法（如Mean Teacher、ACMT、MagicNet）通过伪标签和一致性正则化减少标注成本，在部分数据集（如BTCV）上性能接近全监督，但依赖高质量伪标签初始化。
3. **3D医学影像适配**：现有方法多采用2D切片级微调（如MedSAM），忽略3D体数据的层间关联性；少数3D扩展模型（如3DSAM-Adapter）参数规模大，效率低。

## 提出的模型

![Snipaste_2025-12-16_14-57-31](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/Q95M/1270X507/4LMyIb9uctAHKsNJPQ0zEw.png)

#### 1. **拼接模块（Stitching Module）**

- **目标**：解决3D医学图像与SAM预训练自然图像之间的分辨率和维度差异，保留切片间的空间连续性。
- **方法**：将3D医学图像的切片按`d×d`网格（`d=⌈√D⌉`，D为切片总数）拼接成2D图像（1024×1024），使输入分辨率匹配SAM的预训练需求。若切片数不足，用零填充补全网格。
- **优势**：相比传统的切片缩放（如直接上采样或降采样），拼接策略能同时保留多切片上下文信息和单个切片的细节，缓解领域差异。

![Snipaste_2025-12-16_14-59-43](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/UGD1/782X599/2E83BlYwTUqeUCddPf4Iyb.png)

#### 2. **微调模块（Fine-Tuning Module）**

- **目标**：利用少量标注数据微调SAM，生成高质量伪标签（pseudo-labels）。
- **方法**：
  - 使用拼接后的2D图像及其标签微调SAM，采用LoRA（低秩适应）策略优化参数，仅更新适配器权重以减少计算量。
  - 微调损失函数为Dice损失与交叉熵损失的加权平均
- **输出**：通过SAM对未标注数据生成伪标签，并通过逆拼接转换为3D体积。

![Snipaste_2025-12-16_15-00-59](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/g1od/784X529/1DzBjF4MNDvIhs9XPl3Lp6.png)

#### 3. **重训练模块（Re-Training Module）**

- **目标**：基于伪标签训练轻量级3D半监督分割模型，保持与主流分割器（如V-Net）相当的参数规模。
- **方法**：
  - 结合标注数据和伪标签训练3D半监督模型，支持多种现有方法（如Mean Teacher、MagicNet等）。
  - 损失函数由监督损失（标注数据）和无监督伪标签损失（未标注数据）组成
- **优势**：参数规模远小于SAM，适合临床部署，且框架“即插即用”，兼容多数半监督方法。

### **4、SFR+扩展框架**

- **改进点**：引入**置信度估计**和**选择性训练策略**，优化伪标签质量和模型学习效率。
  1. **置信度估计**：计算未标注样本的体素级平均置信度，通过阈值区分高/低置信样本。
  2. **选择性训练**：
     - 高置信样本：用于更新微调模块，增强伪标签可靠性；
     - 低置信样本：用于重训练模块，通过伪标签引导模型学习。
- **效果**：缓解伪标签误差传播，进一步提升分割精度。

![Snipaste_2025-12-16_15-01-57](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/ha55/780X350/4skiA8uStjws5FDsdidMcw.png)

## 实验（Compared with SOTA）

### 1、数据集

1. **单目标数据集**
   - **LA数据集**：100例心脏MRI左心房分割数据，各向同性分辨率0.625×0.625×0.625 mm³。
   - **BraTS数据集**：335例脑胶质瘤MRI数据（T2-FLAIR模态），含高低级别胶质瘤标注。
2. **多目标数据集**
   - **BTCV数据集**：30例腹部CT，含13个器官标注（如肝脏、肾脏、胰腺等）。
   - **MACT数据集**：90例腹部CT，标注8个器官（如脾脏、胆囊、胃等）。
   - **AbdomenCT-1K数据集**：1000+例多中心腹部CT，含多期相、多厂商数据。

### 2、实验设置

- **基础模型**：采用SAM（ViT-B版本）作为基础分割模型，使用LoRA低秩微调策略，秩设为4。
- **半监督方法**：对比经典方法（自训练、Mean Teacher）和先进方法（ACMT、MagicNet）。
- **评估指标**：Dice系数、Jaccard指数、平均表面距离（ASD）、95% Hausdorff距离（HD）。
- **实验配置**：PyTorch框架，NVIDIA RTX 3090/4090TI GPU，输入分辨率统一为1024×1024（通过切片拼接实现）。

### 3、结果分析

#### **1、拼接策略分析**

- **目标**：解决3D医学图像与SAM预训练自然图像的分辨率和维度差异。
- **方法**：将3D体数据按切片顺序排列为d×d网格（d=⌈√D⌉，D为切片数），生成1024×1024的2D拼接图像。
- **结果**：9×9网格拼接（保留完整3D体信息）性能最优，Dice得分显著高于直接上采样或降采样策略（图9）。

#### 2. **中等标注量实验（20%-40%标注数据）**

- **单目标分割**：
  - LA数据集：SFR框架将Mean Teacher的Dice从29.68%提升至74.40%，ASD指标优于全监督结果（表I）。
  - BraTS数据集：SFR+ACMT方法Dice达89.73%，接近全监督性能（表II）。
- **多目标分割**：
  - BTCV数据集：SFR+MagicNet平均Dice提升13.57%，尤其主动脉区域提升近30%（表IV）。
  - AbdomenCT-1K数据集：20%标注下，SFRMT平均Dice达88.73%，较基线提升13.57%（表III）。

![Snipaste_2025-12-16_15-08-16](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/3WVU/512X393/6XBdaXkfWVY7L0yhtF2V95.png)

#### 3. **稀缺标注量实验（1-2例标注数据）**

- **单目标分割**：
  - LA数据集：仅1例标注时，SFR将Mean Teacher的Dice从29.68%提升至74.40%（表VII）。
  - BraTS数据集：SFR帮助MagicNet提升15.15% Dice（表VIII）。
- **多目标分割**：
  - MACT数据集：SFR使Mean Teacher在脾脏区域Dice提升37.33%，右肾提升34.53%（表XI）。
  - BTCV数据集：SFR+MagicNet在1例标注下平均Dice达66.16%，较基线提升10.13%（表X）。

![Snipaste_2025-12-16_15-08-37](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/sn2J/535X193/4BbFqcI5D7P6gOV3Lelxh1.png)

#### 4. **SFR+框架增强实验**

- **策略**：引入置信度估计（阈值τ=0.985），高置信度样本更新微调模块，低置信度样本用于重训练。
- **结果**：在LA、BTCV等数据集上，SFR+较SFR进一步提升Dice 1%-3%（表I、IV、VII）。

#### 5. **模块有效性验证**

- **重训练模块必要性**：仅微调SAM时Dice得分低于重训练模块（如LA数据集74.40% vs. 89.73%，表XII），且重训练模型参数量与V-Net相当（远小于SAM）。
- **兼容性验证**：SFR可适配多种半监督方法（自训练、Mean Teacher、ACMT），在1-16例标注下均显著提升性能（图12）。

#### 6、对比实验

- **与3D-SAM方法对比**：SFR在LA数据集上Dice达89.73%，优于3DSAM-Adapter（81.73%）和SAM-Med3D（需多点击提示），且无需额外参数（表XIII、XIV）。
- **与SAM 2对比**：SFR在LA数据集1例标注下Dice 74.40%，优于SAM 2（需2-10点提示）（表XV）。

## 结论

在这项工作中，我们提出了由**拼接、微调和再训练**模块组成的SFR框架，通过利用基础模型来实现半监督分割任务的更高改进。拼接模块处理医学图像和自然图像的分辨率差异，微调模块为再训练模块提供可靠的初始伪标签。我们的框架保持了与主流分割器(如V-Net[30])相同的参数大小，并且可以与大多数流行的SSL方法(如Mean Teacher[21])兼容。此外，我们还开发了SFR+，通过引入置信度估计和选择性训练策略进一步增强了框架。大量的实验表明，SFR和SFR+框架在中等和稀缺注释场景下都显著提高了性能。
