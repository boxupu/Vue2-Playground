import Clipboard from 'clipboard'

export default function copy (target) {
  const clipboard = new Clipboard(target)
  clipboard.on('success', e => {
    alert('ε€εΆζε')
  })
}