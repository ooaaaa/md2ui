import mermaid from 'mermaid'

const NODE_SIZE_THEME = `
  themeCSS: |
    .node .nodeLabel {
      display: inline-block;
      width: 132px;
      max-width: 132px;
      text-align: center;
      white-space: normal;
      overflow-wrap: anywhere;
    }`

const AUTO_LAYOUT_FRONTMATTER = `---
config:
  layout: elk${NODE_SIZE_THEME}
  flowchart:
    curve: linear
    nodeSpacing: 28
    rankSpacing: 48
    wrappingWidth: 132
    inheritDir: true
    useMaxWidth: false
  elk:
    mergeEdges: false
    nodePlacementStrategy: NETWORK_SIMPLEX
---
`

const FLOWCHART_PATTERN = /^\s*(?:flowchart|graph)\s+(?:TB|TD|BT|LR|RL)\b/im
const EXPLICIT_CONFIG_PATTERN = /^\s*(?:---\s*$|%%\{(?:init|config):)/im
const FLOWCHART_EDGE_PATTERN = /-->|==>|-\.->|---/g
const AUTO_LAYOUT_EDGE_THRESHOLD = 8

let mermaidInitialized = false
let autoLayoutPromise = null

/** 初始化 Mermaid 的公共主题和安全配置。 */
export function ensureMermaid() {
  if (mermaidInitialized) return

  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'strict',
    suppressErrorRendering: true,
    themeVariables: {
      primaryColor: '#e8eaf6',
      primaryTextColor: '#37474f',
      primaryBorderColor: '#7986cb',
      lineColor: '#90a4ae',
      textColor: '#455a64',
      secondaryColor: '#f3e5f5',
      secondaryBorderColor: '#ba68c8',
      secondaryTextColor: '#4a148c',
      tertiaryColor: '#e0f7fa',
      tertiaryBorderColor: '#4dd0e1',
      tertiaryTextColor: '#006064',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '14px',
      nodeBorder: '#7986cb',
      nodeTextColor: '#37474f',
      actorBkg: '#e8eaf6',
      actorBorder: '#7986cb',
      actorTextColor: '#37474f',
      signalColor: '#5c6bc0',
      signalTextColor: '#37474f',
      sectionBkgColor: '#e8eaf6',
      altSectionBkgColor: '#f3e5f5',
      taskBkgColor: '#7986cb',
      taskTextColor: '#ffffff',
      activeTaskBkgColor: '#5c6bc0',
      doneTaskBkgColor: '#9fa8da',
      pie1: '#7986cb',
      pie2: '#ba68c8',
      pie3: '#4dd0e1',
      pie4: '#ffb74d',
      pie5: '#a1887f',
      classText: '#37474f',
      labelColor: '#37474f',
      mainBkg: '#e8eaf6',
      nodeBkg: '#e8eaf6',
      background: '#ffffff',
    }
  })

  mermaidInitialized = true
}

/** 判断流程图是否足够复杂，值得启用额外布局引擎。 */
function shouldUseAutoLayout(code) {
  if (!FLOWCHART_PATTERN.test(code) || EXPLICIT_CONFIG_PATTERN.test(code)) return false
  const edgeCount = code.match(FLOWCHART_EDGE_PATTERN)?.length || 0
  return edgeCount >= AUTO_LAYOUT_EDGE_THRESHOLD || /\bsubgraph\b/i.test(code)
}

/** 懒加载 ELK，插件不可用时仅关闭自动布局。 */
async function enableAutoLayout() {
  if (!autoLayoutPromise) {
    autoLayoutPromise = import('@mermaid-js/layout-elk')
      .then(({ default: elkLayouts }) => {
        mermaid.registerLayoutLoaders(elkLayouts)
        return true
      })
      .catch((error) => {
        console.warn('Mermaid ELK 布局加载失败，使用默认布局:', error)
        return false
      })
  }
  return autoLayoutPromise
}

function removeRenderArtifact(id) {
  document.getElementById(id)?.remove()
}

function getSvgDimensions(svg) {
  const match = svg.match(/viewBox=["'](?:[-\d.]+[\s,]+){2}([\d.]+)[\s,]+([\d.]+)["']/i)
  if (!match) return null
  const width = Number(match[1])
  const height = Number(match[2])
  return Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0
    ? { width, height }
    : null
}

/** 左右布局和多分组架构图不应被自动算法排成纵向长图。 */
function keepsRequestedDirection(svg, code) {
  const direction = code.match(FLOWCHART_PATTERN)?.[1]?.toUpperCase()
  const dimensions = getSvgDimensions(svg)
  if (!dimensions) return true

  const subgraphCount = code.match(/\bsubgraph\b/gi)?.length || 0
  if (subgraphCount >= 3 && dimensions.height > dimensions.width) return false
  if (direction !== 'LR' && direction !== 'RL') return true
  return dimensions.width >= dimensions.height
}

/** 自动布局只有不扩大画布时才算改进。 */
function isNoLargerThanDefault(autoSvg, defaultSvg) {
  const autoSize = getSvgDimensions(autoSvg)
  const defaultSize = getSvgDimensions(defaultSvg)
  if (!autoSize) return false
  if (!defaultSize) return true
  return autoSize.width * autoSize.height <= defaultSize.width * defaultSize.height
}

async function renderDefaultLayout(id, code) {
  const { svg } = await mermaid.render(id, code)
  return svg
}

/**
 * 渲染 Mermaid SVG。复杂流程图比较 ELK 与默认结果，逐图选择更紧凑的布局。
 */
export async function renderMermaidSvg(id, code) {
  ensureMermaid()

  if (!shouldUseAutoLayout(code) || !await enableAutoLayout()) {
    return renderDefaultLayout(id, code)
  }

  const defaultSvg = await renderDefaultLayout(`${id}-default`, code)
  const autoLayoutId = `${id}-auto`
  try {
    const enhancedCode = `${AUTO_LAYOUT_FRONTMATTER}${code.trimStart()}`
    const autoSvg = await renderDefaultLayout(autoLayoutId, enhancedCode)
    if (keepsRequestedDirection(autoSvg, code) && isNoLargerThanDefault(autoSvg, defaultSvg)) {
      return autoSvg
    }
    console.warn('Mermaid ELK 布局未改善画布，当前图恢复原始布局')
  } catch (error) {
    removeRenderArtifact(autoLayoutId)
    console.warn('Mermaid ELK 布局失败，当前图恢复原始布局:', error)
  }
  return defaultSvg
}
