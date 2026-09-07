# MIAGE-M2-IPM

这是一个课程学习工作区：先把课程资料转换为 Markdown，再使用 `teach` skill 生成课程、参考资料和学习记录，辅助持续学习。

## 安装

在项目根目录执行：

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

如果 PowerShell 不允许激活虚拟环境，也可以直接使用虚拟环境中的 Python：

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## 转换课程资料

将 PDF、PPTX、DOCX 等资料放入课程目录的 `original/`，然后在 [convert.py](convert.py) 顶部设置课程名称：

```python
COURSE = "developpement-front"
```

运行：

```powershell
python convert.py
```

转换结果会写入对应课程的 `markdown/` 目录。每次运行只处理 `COURSE` 指定的课程。

目录示例：

```text
developpement-front/
├── original/
├── markdown/
└── .agents/
```

## 使用 Teach skill 学习

完成资料转换后，在 VS Code / Copilot 中使用 `teach` skill。它会基于工作区中的 `MISSION.md`、课程资料和学习记录，生成课程内容并持续记录学习进展。

Teach skill 的相关文件位于各个科目文件夹内：

```text
developpement-front/.agents/skills/teach/
```

首次使用需要用该命令安装teach skill：

```powershell
npx skills@latest add mattpocock/skills
```