(function () {
  var document = window.document;

  function Bell() {
    this.element = document.createElement('div');
    this.element.classList.add('wonderpush-bell');

    this.iconContainer = document.createElement('div');
    this.element.appendChild(this.iconContainer);
    this.iconContainer.classList.add('wonderpush-icon-container');

    this.icon = document.createElement('div');
    this.icon.classList.add('wonderpush-icon');
    this.iconContainer.appendChild(this.icon);

    this.paragraph = document.createElement('div');
    this.paragraph.classList.add('wonderpush-paragraph');
    this.element.appendChild(this.paragraph);
  }

  /**
   * WonderPush Web SDK plugin to present the user an opt-in bell before prompting her for push permission.
   * @class OptinBell
   * @param {external:WonderPushPluginSDK} WonderPushSDK - The WonderPush SDK instance provided automatically on intanciation.
   * @param {OptinBell.Options} options - The plugin options.
   */
  /**
   * @typedef {Object} OptinBell.Options
   * @property {external:WonderPushPluginSDK.TriggersConfig} [triggers] - The triggers configuration for this plugin.
   * @property {Object} [style] - Styles to be added to the bell container.
   */
  /**
   * The WonderPush JavaScript SDK instance.
   * @external WonderPushPluginSDK
   * @see {@link https://wonderpush.github.io/wonderpush-javascript-sdk/latest/WonderPushPluginSDK.html|WonderPush JavaScript Plugin SDK reference}
   */
  /**
   * WonderPush SDK triggers configuration.
   * @typedef TriggersConfig
   * @memberof external:WonderPushPluginSDK
   * @see {@link https://wonderpush.github.io/wonderpush-javascript-sdk/latest/WonderPushPluginSDK.html#.TriggersConfig|WonderPush JavaScript Plugin SDK triggers configuration reference}
   */
  WonderPush.registerPlugin("optin-bell", function OptinBell(WonderPushSDK, options) {
    this.style = options.style;

    WonderPushSDK.loadStylesheet('style.css');
    var bell = new Bell();

    this.showBell = function () {
      var readyState = document.readyState;
      var attach = function() { document.body.appendChild(bell.element); };
      if (readyState === 'loading') {
        document.addEventListener('domcontentloaded', attach);
      } else {
        attach();
      }
    }.bind(this);

    this.showBell();
    bell.paragraph.innerText = 'Subscribe to notifications';
  });

})();
