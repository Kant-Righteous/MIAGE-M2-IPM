# MIAGE-M2-IPM

这个项目用于把课程资料批量转换为 Markdown。转换由 [Docling](https://github.com/docling-project/docling) 完成，支持 PDF、PPTX、DOCX 等常见文档格式。

## 环境要求

- Python 3.10 或更高版本
- Windows、macOS 或 Linux
- 能够联网安装 Python 依赖

## 安装

在项目根目录打开终端，然后创建并激活虚拟环境。

### Windows PowerShell

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

如果 PowerShell 阻止激活脚本，可以直接使用虚拟环境中的 Python 安装依赖：

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

## 目录结构

每门课程需要包含 `original/` 和 `markdown/` 两个目录：

```text
MIAGE-M2-IPM/
├── convert.py
├── requirements.txt
├── developpement-front/
│   ├── original/       # 放入待转换的 PDF、PPTX、DOCX 等文件
│   └── markdown/       # 转换后的 Markdown 文件
└── （其他课）/
    ├── original/
    └── markdown/
```

`markdown/` 不存在时，脚本会自动创建它。

## 使用方法

1. 把资料放入目标课程的 `original/` 目录。
2. 打开 [convert.py](convert.py)，修改文件顶部的 `COURSE`：

   ```python
   COURSE = "developpement-front"
   ```

   这里的值必须与课程目录名称完全一致。

3. 在项目根目录运行转换：

   ```powershell
   python convert.py
   ```

   如果没有激活虚拟环境，在 Windows PowerShell 中运行：

   ```powershell
   .\.venv\Scripts\python.exe convert.py
   ```

4. 在对应课程的 `markdown/` 目录查看结果。

脚本会保留图片引用，并将导出的图片放在 Docling 生成的输出目录中。

## 切换课程

例如要转换另一门课程，只需将 `convert.py` 顶部改为：

```python
COURSE = "base-de-donnees"
```

然后确保存在以下目录：

```text
base-de-donnees/
├── original/
└── markdown/
```

再次运行 `python convert.py` 即可。一次运行只处理 `COURSE` 指定的课程。

## 常见问题

### 找不到 Docling

先确认已激活虚拟环境，然后重新安装依赖：

```powershell
python -m pip install -r requirements.txt
```

### 课程目录不存在

检查 `COURSE` 的拼写，并确认它对应项目根目录下的课程文件夹。

### 输入目录不存在

在目标课程目录下创建 `original/`，再把需要转换的文件放进去。

### 转换失败

确认输入文件可以正常打开，并查看终端中 Docling 输出的具体错误信息。大型文件或包含复杂布局的文件可能需要更长处理时间。
