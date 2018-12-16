(function () {
  var document = window.document;
  var _ = function(text) { return text; };

  /**
   *
   * @param {object?} options
   * @param {string?} options.notificationIcon
   * @param {string?} options.dialogTitle
   * @constructor
   */
  function Bell(options) {
    options = options || {};
    this.element = document.createElement('div');
    this.element.classList.add('wonderpush-bell');

    var definitions = [
      { cls: 'wonderpush-icon-container', name: 'iconContainer'},
      { cls: 'wonderpush-icon', name: 'icon', parent: 'iconContainer'},
      { cls: 'wonderpush-paragraph', name: 'paragraph'},
      { cls: 'wonderpush-help', name: 'help'},
      { cls: 'wonderpush-dialog', name: 'dialog'},
      { cls: 'wonderpush-dialog-title', name: 'dialogTitle', parent: 'dialog'},
      { cls: 'wonderpush-notification', name: 'notification', parent: 'dialog'},
      { cls: 'wonderpush-notification-icon', name: 'notificationIcon', parent: 'notification'},
      { cls: 'wonderpush-notification-paragraph-large', parent: 'notification'},
      { cls: 'wonderpush-notification-paragraph-medium', parent: 'notification'},
      { cls: 'wonderpush-notification-paragraph-large', parent: 'notification'},
      { cls: 'wonderpush-notification-paragraph-small', parent: 'notification'},
      { cls: 'wonderpush-dialog-button', name: 'dialogButton', parent: 'dialog'},
    ];

    // Create the DOM
    definitions.forEach(function (definition) {
      var elt = document.createElement('div');
      if (definition.name) this[definition.name] = elt;
      var parent = this[definition.parent || 'element'];
      parent.appendChild(elt);
      elt.classList.add(definition.cls);
    }.bind(this));

    // Configure a few things
    if (options.notificationIcon) this.notificationIcon.style.backgroundImage = 'url(' + options.notificationIcon + ')';
    this.dialogTitle.textContent = options.dialogTitle || _('Manage Notifications');
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
    var bell = new Bell({
      notificationIcon: WonderPushSDK.getNotificationIcon(),
    });

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
    bell.paragraph.innerText = _('Subscribe to notifications');
    bell.dialogButton.textContent = _('Subscribe');
  });

})();
