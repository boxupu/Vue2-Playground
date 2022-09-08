<template>
  <div class="codemirror-playground">
    <div class="sfc-box">
      <div class="sfc-preview" ref="sfcPreview"></div>
      <div class="err" ref="Error" v-if="error">
        {{ error }}
      </div>
    </div>
    <div class="codemirror-box">
      <hr />
      <div class="title">
        <lu-icon-copy size="16" title="Copy Code" :data-clipboard-text="code" ref="CopyBtn" />
        <lu-icon-code size="20" title="View Code"  @click.native="toggleMirror" />
      </div>
      <div class="code-mirror-inner" ref="CodeMirrorInner">
        <hr />
        <div class="edit-bar">
          <div class="edit-tips">可实时编辑</div>
          <lu-icon-arrow-refresh size="16" title="恢复默认" @click.native="resetCode" />
        </div>
        <code-mirror
          v-model="code" 
          :options="codeMirrorOptions"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { CompCodeMirror as CodeMirror} from './vendor'
  import { options as codeMirrorOptions } from './config/code-mirror'
  import { SfcComplier } from './gen/sfc-complier'
  import copy from './utils/copy'

  export default {
    name: 'LucidPlayground',
    components: {
      CodeMirror
    },
    props: {
      value: {
        type: String,
        default: () => {
          return `<template>
                  <div class="code-mirror-wrapper">

                      <lu-radio v-model="radio" label="1">Option1</lu-radio>
                      <lu-radio v-model="radio" label="2">Option2</lu-radio>
                    </div>
                  </template>

                  <script>
                  export default {
                    data() {
                      return {
                        radio: '1'
                      }
                    }
                  }
                <\/script>`
        }
      }
    },
    data() {
      return {
        error: '',
        showMirror: false,
        sfcComplier: undefined,
        code: this.value,
        codeMirrorOptions: {
          ...codeMirrorOptions
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.sfcComplier = new SfcComplier({
          el: this.$refs.sfcPreview,
          emits: {
            emitError: this.emitError
          }
        })

        copy(this.$refs.CopyBtn.$el)

        // this.errorHandler.bindHandler()
        this.mountPreview(this.code)
      })
    },
    methods: {
      emitError (err) {
        this.error = err
      },
      mountPreview (code) {
        const compiler = this.sfcComplier.compiler(this.code)
        compiler && compiler.extend()
      },
      resetCode () {
        this.code = this.value
      },
      changeMirrorHeight () {
        this.$nextTick(() => {
          const realHeight = this.$el.querySelector('.CodeMirror-sizer').offsetHeight
          this.$refs.CodeMirrorInner.style.height = this.showMirror ? `${realHeight}px` : 0
        })
      },
      toggleMirror () {
        this.showMirror = !this.showMirror
        this.changeMirrorHeight()
      }
    },
    watch: {
      code (v) {
        if (!v) return
        this.mountPreview(v)
        this.changeMirrorHeight()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .codemirror-playground {
    width: 100%;
    margin: 0 auto;
    background: #fff;
    border: 16px solid #FBFBFD;
    line-height: 1.75;
    box-sizing: border-box;

    .sfc-box {
      position: relative;
      padding: 48px;
    }

    hr {
      border: none;
      height:1px;
      border-top: 1px solid #F0F1F7;
      margin: 0;
    }
    .codemirror-box {
      position: relative;
      height: 100%;
      margin: 0;
      overflow: hidden;
      box-sizing: border-box;

      .title {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        line-height: 24px;
        padding: 8px 24px;
      }
    }

    .lu-icon {
      display: inline-block;
      line-height: 1em;
      width: 1em;
      height: 1em;
      overflow: hidden;
      margin-left: 12px;
      cursor: pointer;
      ::v-deep svg {
        width: 1em;
        height: 1em;
        fill: currentColor;
      }
    }

    ::v-deep .CodeMirror {
      height: auto !important;
      .CodeMirror-sizer {
        padding-right: 7px !important;
      }
      .CodeMirror-vscrollbar, .CodeMirror-hscrollbar {
        &::-webkit-scrollbar-track {
          -webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
          border-radius:10px;
        }
        &::-webkit-scrollbar-thumb {
          border-radius:10px;
          background:rgba(0,0,0,0.1);
          -webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
        }
      }
      .CodeMirror-vscrollbar {
        &::-webkit-scrollbar {
          width: 6px;
        }
      }
      .CodeMirror-hscrollbar {
        &::-webkit-scrollbar {
          height: 6px;
        }
      }
      .CodeMirror-activeline-background {
        background: rgba(var(--lu-color-fill-3), 1);
      }
    }
    .err {
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      background: rgba(var(--lu-color-error-7), .7);
      color: rgba(var(--lu-color-error-1), 1);
      font-size: 14px;
      padding: 8px 24px;
      z-index: 1000;
    }
    .code-mirror-inner {
      position: relative;
      height: 0;
      transition: height ease-in-out .3s;

      &.is-expand {
        height: 300px;
      }
      .edit-bar {
        display: none;
        position: absolute;
        right: 8px;
        top: 6px;
        z-index: 1000;
        > * {
          display: inline-block;
          margin-left: 4px;
          background: rgba(var(--lu-color-fill-4), 1);
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 12px;
          line-height: 16px;
        }
        .lu-icon-arrow-refresh {
          cursor: pointer;
        }
      }
      &:hover {
        .edit-bar {
          display: flex;
          align-items: center;
        }
      }
    }
  }
</style>