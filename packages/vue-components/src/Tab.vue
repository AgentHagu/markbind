<template>
  <div
    role="tabpanel"
    class="tab-pane active printable-tab-pane"
    :class="{'tab-pane-hide': !show}"
  >
    <div class="nav-tabs printable-tab-header">
      <div ref="header" class="nav-link active">
        <slot name="header"></slot>
      </div>
    </div>
    <slot></slot>
    <hr />
  </div>
</template>

<script>
import { toBoolean } from './utils/utils';

export default {
  props: {
    header: {
      type: String,
      default: '',
    },
    disabled: {
      type: [Boolean, String],
      default: false,
    },
  },
  computed: {
    active() {
      return this._tabset.show === this;
    },
    index() {
      return this._tabset.tabs.indexOf(this);
    },
    show() {
      return this._tabset && this._tabset.show === this;
    },
    disabledBool() {
      return toBoolean(this.disabled);
    },
  },
  mounted() {
    this.headerRendered = this.$refs.header?.innerHTML;
  },
  created() {
    this._ingroup = this.$parent && '_tabgroup' in this.$parent;
    let tabset = this;
    while (tabset && tabset._tabset !== true && tabset.$parent) {
      tabset = tabset.$parent;
    }
    if (!tabset._tabset) {
      this._tabset = {};
      // Warning: "tab" depend on "tabset" to work properly.
    } else {
      tabset.tabs.push(this);
      if (!this._ingroup) {
        tabset.headers.push(this);
      // eslint-disable-next-line no-bitwise
      } else if (!~tabset.headers.indexOf(this.$parent)) {
        tabset.headers.push(this.$parent);
      }
      this._tabset = tabset;
    }
    if (this._ingroup) {
      this.$parent.tabs.push(this);
    }
  },
  beforeUnmount() {
    if (this._tabset.activeNumber === this.index) { this._tabset.activeNumber = 0; }
    if (this._ingroup) {
      const tabIndex = this.$parent.tabs.indexOf(this);
      this.$parent.tabs.splice(tabIndex, 1);
    }
    this._tabset.tabs.splice(this.index, 1);
  },
};
</script>
<style scoped>
    .tab-pane > hr {
        margin: 0;
    }

    .tab-pane-hide {
        display: none;
    }

    .printable-tab-header {
        display: none;
    }

    @media print {
        .printable-tab-header {
            display: flex;
            margin-bottom: 15px;
            border-bottom: 1px solid #dee2e6;
        }

        .printable-tab-header > div {
            margin-bottom: -2px;
        }

        .printable-tab-pane {
            display: block;
            padding: 10px;
        }
    }
</style>
