export const options = {
  tabSize: 2,
  foldGutter: true,
  styleActiveLine: true,
  lineNumbers: true,
  line: true,
  keyMap: "sublime",
  mode: 'text/x-vue',
  theme: 'base16-light',
  extraKeys: {
    'F11'(cm) {
      cm.setOption("fullScreen", !cm.getOption("fullScreen"))
    },
    'Esc'(cm) {
      if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false)
    }
  }
}