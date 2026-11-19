---
title: BTSegDiff Brain tumor segmentation based on multimodal MRI Dynamically guided diffusion probability model
published: 2025-07-06 20:30:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "在脑肿瘤的治疗中，准确的诊断和治疗严重依赖于可靠的脑肿瘤分割，而多模态磁共振成像（MRI）通过提供有价值的补充信息发挥关键作用"
categories: 多模态医学图像分割
tags: [Diffusion Probability Model (DPM), Brain tumor]
top: true
---

云南大学、锡根大学

## 摘要

In the treatment of brain tumors, accurate diagnosis and treatment heavily rely on reliable **brain tumor segmentation**, where multimodal **Magnetic Resonance Imaging** (MRI) plays a pivotal role by providing valuable complementary information. This integration significantly enhances the performance of brain tumor segmen­tation. However, due to the uneven grayscale distribution, irregular shapes, and significant size variations in brain tumor images, this task remains highly challenging. In order to overcome these obstacles, we have introduced a novel framework for automated segmentation of brain tumors that leverages the diverse infor­mation from multi-modal MRI scans. Our proposed method is named BTSegDiff and it is based on a Diffusion Probability Model (DPM). First, we designed a dynamic conditional guidance module consisting of an encoder. This encoder is used to extract information from multimodal MRI images and guide the DPM in generating accurate and realistic segmentation masks. During the guidance process, we need to fuse the diffused generated features with the extracted multimodal features. However, diffusion process itself introduces a significant amount of Gaussian noise, which can affect the fusion results. Therefore, we designed a Fourier domain feature fusion module to transfer this fusion process to Euclidean space and reduce the impact of high-frequency noise on fusion. Lastly, we have taken into account that the DPM, as a generative model, produces non-unique results with each sampling. In the meticulous field of medicine, this is highly detrimental. Therefore, we have designed a Stepwise Uncertainty Sampling module based on Monte Carlo uncertainty calculation to generate unique out­ comes and enhance segmentation accuracy simultaneously. To validate the effectiveness of our approach, we perform a validation on the popular BraTs2020 and BraTS2021 benchmarks. The experimental results show that our method outperforms many existing brain tumor segmentation methods. Our code is available at https://github.com/jaceqin/BTSegDiff.

## 翻译

在脑肿瘤的治疗中，准确的诊断和治疗严重依赖于可靠的脑肿瘤分割，而多模态磁共振成像（MRI）通过提供有价值的补充信息发挥关键作用。这种整合显著提高了脑肿瘤分割的性能。然而，由于脑肿瘤图像中灰度分布不均、形状不规则以及大小差异显著，这项任务仍然极具挑战性。为了克服这些障碍，我们引入了一种利用多模态MRI扫描的多样信息进行脑肿瘤自动分割的新框架。我们提出的方法名为BTSegDiff，基于扩散概率模型（DPM）。首先，我们设计了一个动态条件指导模块，该模块由编码器组成。编码器用于从多模态MRI图像中提取信息，并指导DPM生成准确和逼真的分割掩码。在指导过程中，我们需要将扩散生成的特征与提取的多模态特征进行融合。然而，扩散过程本身引入了大量的高斯噪声，这可能影响融合结果。因此，我们设计了一个傅里叶域特征融合模块，将该融合过程转移到欧几里得空间，并减少高频噪声对融合的影响。最后，我们考虑到DPM作为生成模型，每次采样产生的结果都不唯一。在医学这个细致的领域中，这非常不利。因此，我们设计了一个基于蒙特卡洛不确定性计算的逐步不确定性采样模块，以生成独特结果并同时提高分割精度。为了验证我们方法的有效性，我们在流行的BraTs2020和BraTS2021基准上进行了验证。实验结果表明，我们的方法优于许多现有的脑肿瘤分割方法。我们的代码可在https://github.com/jaceqin/BTSegDiff。

## 研究背景

本文聚焦于**脑肿瘤分割研究**，其背景源于脑肿瘤发病率上升，准确分割对诊断治疗至关重要。传统手动分割耗人力且依赖医生经验，计算机辅助自动分割方法具有重要临床价值，但面临诸多挑战。 早期基于区域生成、边缘检测和阈值分割的自动分割方法虽有进步，但需手动调参，难以处理多模态图像。深度学习发展使基于其的医学图像分割方法展现出强大特征学习能力，U - Net 提升了脑肿瘤分割性能，Transform 能更好学习全局信息。然而，这些方法仍存在不足，如 CNN 难以学习全局特征，Transform 需为不同数据集设计合适架构。 扩散概率模型（DPM）在生成任务和医学成像领域有一定成效，但现有基于 DPM 的脑肿瘤分割方法忽视了多模态信息提取和模型不确定性定量分析。为解决这些问题，作者提出基于 DPM 的脑肿瘤分割框架 BTSegDiff，旨在利用多模态 MRI 信息引导 DPM 生成高质量分割结果，减少噪声影响，解决 DPM 结果不唯一问题，提升分割准确性和稳定性。 

![Snipaste_2025-07-06_20-39-04](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/yZms/0X0/0343OUTunGQcrQXRrFv9o1.webp)

​                                                    Different modalities in the multimodal MRI dataset



## 研究现状

- **传统方法**：早期基于区域生成、边缘检测和阈值分割的自动化方法，相比手动方法提高了脑肿瘤分割效率，具有广泛适用性和低成本的优点，但仍需手动调整参数，且难以处理多模态图像。
- **深度学习方法**：基于深度学习的医学图像分割方法特征学习能力强。U - Net改进了脑肿瘤分割性能，但学习脑肿瘤图像全局特征的能力不足；Transform能捕捉长距离依赖关系，在脑肿瘤分割领域表现出色，但需为每个数据集专门设计合适的模型。
- **扩散概率模型**：扩散概率模型（DPM）在生成任务和医学成像中展现出有效性，现有基于DPM的方法在脑肿瘤分割领域超越了Transform，但忽略了多模态信息提取和模型不确定性的定量分析。

## 提出的模型

![Snipaste_2025-07-06_20-41-38](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-06_20-41-38.png)

### 整体架构

使用基于**ResNet**修改的EC和EU编码器对原始图像和当前估计图像进行编码，结合多级残差连接且无批量归一化层，使用组归一化层。每个编码块先进行卷积层下采样，再连接由两个卷积层、组归一化和SiLU激活组成的残差块。解码器Du和Dm基于U - Net，Dm由两个含注意力层的残差块组成，Du先连接三个残差块接收Dm信息，再连接五个下采样卷积层，每层后接三个残差块，部分残差块后有注意力层，编码器各层与解码器同层有跳跃连接。

### 多模态动态条件引导

以往采用固定图像引导扩散概率模型，但脑组织结构复杂，MRI图像存在偏差场效应和噪声，正常与患病组织灰度相似，固定输入图像会影响网络学习能力。因此，该模块将当前步骤的分割信息与原始图像的分割信息融合，公式为$A = LN (m_{xt})⨁LN (m_{I})$ ，其中⨁表示逐元素相加，LN ( • )表示归一化。不过当前步骤存在高斯噪声会影响融合结果，为此提出傅里叶域特征融合模块来抑制噪声影响。

### 傅里叶域特征融合

受相关文献启发，该模块将当前特征图和条件输入特征图转换到傅里叶空间以减轻噪声影响。对两个特征图进行二维快速傅里叶变换（2D FFT），与参数化权重图逐元素相乘，增强后的特征图逐元素相加并通过sigmoid激活函数生成傅里叶空间的亲和图，公式为$M = Sigmoid ( ( F [ m_{xI,t} ] ⊗W ) ⨁(F [m_{I}] ⊗W ) )$ ，其中⊙表示逐元素相乘，F [ • ]表示2D FFT，m为输入特征图，W为参数化权重图。最后通过二维逆快速傅里叶变换（2D IFFT）将亲和图转换回欧几里得空间，公式为$\tilde{m} = F ^{-1}[M ]$ 。

### 基于不确定性度量的采样

扩散模型是生成模型，传统生成任务中多次采样结果不确定，但脑肿瘤分割区域固定。该模块发现时间步越接近$x_0$，预测图像越准确、不确定性越低。借鉴MC Dropout和Diff - UNet计算不确定性，公式为$U_{t} = -X_{t} log(X_{t})$ ，其中$X_{t} = \frac{1}{S} \sum_{1}^{S} X_{S_{t}}$ ，S为每个扩散步骤生成的结果数量。结合不确定性和预测步数得到最终分割结果，权重公式为$w_{t} = e^{sigmoid ( \frac{t}{T} )}×(1 - U_{t})$ ，最终预测结果$Y = \sum_{t = 1}^{T} w_{t} × X_{t}$ ，其中t为当前预测步骤，T为总预测步数。

### 训练

训练过程依据DPM设置，扩散步数T设为1000。每次迭代随机获取图像I及其真实二值分割图G，从均匀分布中采样迭代步数t，从标准分布中采样噪声$\epsilon$ 。损失函数为$Loss = E_{x_0,\epsilon,t} [ \| \epsilon - \epsilon_{\theta} ( \sqrt{\alpha_{t}} x_0 + \epsilon \sqrt{ (1 - \alpha_{t}) }, I, t ) \|^2 + \frac{1}{2} \sum( x_{I,t} - G )^2 ]$ ，训练时设$x_0 = G$ 。采样过程为随机过程，保存每步生成的$x_{I,t}$ 用于基于不确定性度量的采样，最终生成分割掩码。

## 实验（Compared with SOTA）

> 数据集:
   - **脑肿瘤数据集（BraTs2020 - 2021）**：BraTs2020和BraTs2021数据集分别包含369和1251名患者的训练数据。将训练集按轴向切片，每个患者数据切成155片，选取第80 - 120片，打乱后划分训练集和测试集。BraTs2020使用了来自340 - 1200名患者脑肿瘤MR图像的13940个训练数据，测试集为来自29名患者的1189个MR图像；BraTs2021使用了49200个训练数据，测试集为来自51名患者的2091个MR图像。
   - **甲状腺结节数据集（DDTI）**：是一个甲状腺超声图像的开放数据库，包含99例和134张图像。将XML文件转换为JPG格式后，最终数据集包含2878个训练对和613个测试对，对图像大小进行了标准化处理。
   - **青光眼数据集（REFUGE - 2）**：由REFUGE竞赛提供，包含1200对RGB眼底图像，训练集和测试集按7:3比例划分。





- **与现有方法对比**：在BraTs2020 - 2021数据集上，与多种脑肿瘤分割方法进行对比。结果表明，该方法在Dice系数、HD95和Jaccard指数等指标上优于传统方法和基于扩散概率模型的最新方法。例如，相较于EnsemDiff，Dice系数提高了5.87% - 6.95%，Jaccard指数提高了6.92% - 8.74%。同时，在Sensitivity和Specificity指标上也表现出色。
- **在其他数据集上的验证**：在REFUGE - 2和DDTI数据集上进行对比。在REFUGE - 2数据集上，该方法在Dice系数和Jaccard指数上优于TransUNet等方法；在DDTI数据集上，虽然该方法在部分指标上优于大多数方法，但由于超声图像的特点，部分特征像素在融合过程中被忽略，导致最终结果未达预期。



![Snipaste_2025-07-06_20-46-18](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-06_20-46-18.png)

![Snipaste_2025-07-06_20-46-24](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-06_20-46-24.png)

![Snipaste_2025-07-06_20-46-38](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-06_20-46-38.png)

## 实验（Ablation Experiments）​​

对多模态动态条件引导（MDCG）、傅里叶域特征融合（FFF）和基于不确定性测量的采样（UMS）三个关键组件进行消融实验。结果显示，传统DPM不适合脑肿瘤分割，MDCG有效解决了肿瘤位置信息缺失的问题，FFF进一步提高了分割性能，UMS使分割结果更稳定。同时，确定了UMS中最优的S值为3。

![Snipaste_2025-07-06_20-47-36](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-06_20-47-36.png)



![Snipaste_2025-07-06_20-47-40](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/Snipaste_2025-07-06_20-47-40.png)

## 结论

作者提出基于扩散概率模型（DPM）的脑肿瘤分割框架，得出以下结论： 

- 利用多模态MRI引导DPM生成高质量分割结果，在傅里叶域进行特征融合操作，降低DPM高频噪声对融合的影响。 
- 考虑DPM生成结果的不确定性对脑肿瘤分割性能的影响，结合各步骤的不确定性生成最终分割结果，在多个数据集上验证了方法的有效性。 


>不足：指出研究存在的问题，如DPM采样过程慢，脑肿瘤数据集切片会丢失肿瘤原始空间位置信息，影响空间体积准确性。后续将采用新加速策略，考虑肿瘤体素信息，将方法应用于3D领域，使分割结果更可靠。 
