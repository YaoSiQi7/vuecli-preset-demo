const autoTableHeightMixin = {
  data: function () {
    return {
      counter: 0,
      fullHeight: window.innerHeight
    };
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    foo: function () {
      console.info('foo');
    },
    panelCounter: function () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
      console.info('resize event: ', this.tableHeight);
    }
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 320;
      }
    }
  },
  watch: {
    counter: function (newValue, oldValue) {
      if (this.counter % 2 === 1) {
        // 开
        this.tableHeight = window.innerHeight - 70;
      } else {
        // 关
        this.tableHeight = window.innerHeight;
      }
    }
  }
};

export default autoTableHeightMixin;
