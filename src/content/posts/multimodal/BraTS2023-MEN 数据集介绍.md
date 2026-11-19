---
title: BraTs2023数据集处理及python读取.nii文件
published: 2025-08-12 21:05:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "BraTs2023数据集"
category: BraTs数据集
tags: [BraTs2023数据集]
---

## 数据集信息

**BraTS2023-MEN**(Brain Tumor Segmentation 2023 Meningioma Challenge) 是 BraTS2023 五个分割子任务中之一，与 BraTS 常规分割脑胶质瘤不同，该子任务目标是从多模态 MR 图像 (mpMRI) 中分割**脑膜瘤**。该数据集在 23 年 5 月份放出合计 6 个中心的 1650 例数据，其中有标注的训练集 1000 例，每例提供四种序列 MR 的输入图像（t1w, t1c, t2w, t2f）以及脑膜瘤的分割结果，标注内容主要包括非增强肿瘤核心（NETC）、周围非增强的FLAIR高信号（SNFH）和增强型肿瘤（ET）。验证集提供图像但没有标注，可以在官网提交验证，而测试集数据不公开。

**脑膜瘤**是成人最常见的原发性颅内肿瘤，大多数脑膜瘤（约80%）是世界卫生组织（WHO）1级良性肿瘤，通常可以通过观察、手术切除和/或放射治疗来良好控制。然而，高级别的脑膜瘤（WHO 2级和3级）与显著更高的发病率和死亡率相关且容易复发。和 BraTS23 其它分割任务一样，数据所有标签和数据都经过了预处理，这包括与统一的解剖模板对齐、调整到相同的分辨率（1 mm³）并进行了颅骨剥离。

## 数据集元信息

数据集所有图像的 spacing 和 size 都已经被预处理到一致。

二维切片个数：620,000（基于 1000 例训练集统计 155000 × 4）

## 可视化

![图片描述](https://ss1.tupinayun.cn/autoupload/pzwl0/20261119/cvu0/0X0/0343OUQRec9dbd4FMsgnpk.webp)

## 文件结构

官方文件结构如下，包含两个主要目录：ASNR-MICCAI-BraTS2023-MEN-Challenge-TrainingData 和 ASNR-MICCAI-BraTS2023-MEN-Challenge-ValidationData，分别代表训练数据和验证数据。

## 作者及机构

Evan Calabrese (放射医学部，神经放射学分部，杜克大学医学中心，美国)

Dominic Labella (放射治疗学部，杜克大学医学中心，美国)





转载自知乎：https://zhuanlan.zhihu.com/p/662644135
