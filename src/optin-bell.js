(function () {
  var document = window.document;
  var _ = function(text) { return text; };

  /**
   *
   * @param {object?} options
   * @param {string?} options.notificationIcon
   * @param {string?} options.dialogTitle
   * @constructor
   * @class Bell
   * @property {HTMLElement} icon
   * @property {HTMLElement} iconContainer
   * @property {HTMLElement} iconBadge
   * @property {HTMLElement} paragraph
   * @property {HTMLElement} help
   * @property {HTMLElement} dialog
   * @property {HTMLElement} dialogButton
   * @property {HTMLElement} notification
   * @property {HTMLElement} notificationIcon
   */
  function Bell(options) {
    options = options || {};
    this.element = document.createElement('div');
    this.element.classList.add('wonderpush-bell');

    var definitions = [
      { cls: 'wonderpush-icon-container', name: 'iconContainer'},
      { cls: 'wonderpush-icon', name: 'icon', parent: 'iconContainer'},
      { cls: 'wonderpush-icon-badge', name: 'iconBadge', parent: 'iconContainer'},
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

    var makeTransitionPromise = function(elt) {
      return new Promise(function(res, rej) {
        var listener = function(event) {
          elt.removeEventListener('transitionend', listener);
          res();
        };
        elt.addEventListener('transitionend', listener);
      })
    };
    // Instance methods
    this.collapse = function(prop) {
      var elt = typeof prop === 'string' ? this[prop] : prop;
      if (!elt) return;
      if (elt.classList.contains('wonderpush-collapsed')) return Promise.resolve();
      elt.classList.add('wonderpush-collapsed');
      return makeTransitionPromise(elt);
    }.bind(this);

    this.uncollapse = function(prop) {
      var elt = typeof prop === 'string' ? this[prop] : prop;
      if (!elt) return;
      if (!elt.classList.contains('wonderpush-collapsed')) return Promise.resolve();
      elt.classList.remove('wonderpush-collapsed');
      return makeTransitionPromise(elt);
    }.bind(this);

    // Configure a few things
    if (options.notificationIcon) this.notificationIcon.style.backgroundImage = 'url(' + options.notificationIcon + ')';
    this.dialogTitle.textContent = options.dialogTitle || _('Manage Notifications');
    this.iconBadge.textContent = '1';
    this.collapse('help');
    this.collapse('dialog');
    this.collapse('paragraph');
    this.collapse('iconBadge');
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

    /**
     * Adapts the UI to a subscription state change
     * @param {WonderPushSDK.prototype.SubscriptionState} state
     * @param {object|undefined} event. If present, the event that reported the state change
     */
    this.updateTexts = function() {
      var state = WonderPushSDK.Notification.getSubscriptionState();
      switch (state) {
        case WonderPushSDK.SubscriptionState.SUBSCRIBED:
          bell.dialogButton.textContent =_('Unsubscribe');
          bell.paragraph.textContent = _('You\'re subscribed to notifications');
          break;
        case WonderPushSDK.SubscriptionState.UNSUBSCRIBED:
          bell.dialogButton.textContent =_('Subscribe');
          bell.paragraph.textContent = _('You are not receiving any notifications');
          break;
        case WonderPushSDK.SubscriptionState.UNDETERMINED:
          bell.dialogButton.textContent = _('Loading');
          bell.paragraph.textContent = _('Loading');
          break;
        case WonderPushSDK.SubscriptionState.NOT_SUBSCRIBED:
          bell.dialogButton.textContent = _('Subscribe');
          bell.paragraph.textContent = _('Subscribe to notifications');
          break;
      }
    };

    this.showBell();

    // Handle subscription state changes
    this.updateTexts();
    if (WonderPushSDK.Notification.getSubscriptionState() === WonderPushSDK.SubscriptionState.SUBSCRIBED) {
      bell.element.classList.add('wonderpush-discrete');
    }
    window.addEventListener('WonderPushEvent', function(event) {
      if (!event.detail || !event.detail.state || event.detail.name !== 'subscription') return;
      this.updateTexts();
      if (event.detail.state === WonderPushSDK.SubscriptionState.UNSUBSCRIBED) {
        bell.paragraph.textContent = _('You won\'t receive more notifications');
        setTimeout(function() {
          bell.collapse(bell.paragraph);
          this.updateTexts();
        }.bind(this), 1200);
      }
      if (event.detail.state === WonderPushSDK.SubscriptionState.SUBSCRIBED) {
        bell.paragraph.textContent = _('Thanks for subscribing!');
        bell.uncollapse(bell.paragraph);
        setTimeout(function() {
          bell.element.classList.add('wonderpush-discrete');
          bell.collapse(bell.paragraph)
            .then(function() {
              this.updateTexts();
            }.bind(this));
        }.bind(this), 1200);
      }
    }.bind(this));

    // Handle clicks on button
    bell.dialogButton.addEventListener('click', function(event) {
      switch(WonderPushSDK.Notification.getSubscriptionState()) {
        case WonderPushSDK.SubscriptionState.SUBSCRIBED:
          // Unsubscribe
          WonderPushSDK.setNotificationEnabled(false, event)
            .then(function() {
              bell.collapse(bell.dialog);
              bell.uncollapse(bell.paragraph);
            });
          break;
        case WonderPushSDK.SubscriptionState.UNSUBSCRIBED:
          // Subscribe
          WonderPushSDK.setNotificationEnabled(true, event);
          bell.collapse(bell.dialog);
          break;
      }
    });

    // Show badge if appropriate
    WonderPushSDK.Storage.get('badgeShown')
      .then(function(result) {
        if (result.badgeShown) return;
        WonderPushSDK.Storage.set('badgeShown', true);
        bell.uncollapse(bell.iconBadge);
      });


    // Handle mouse events
    bell.iconContainer.addEventListener('mouseenter', function() {
      bell.collapse(bell.iconBadge);
      bell.uncollapse(bell.paragraph);
    });
    bell.iconContainer.addEventListener('mouseleave', function() {
      bell.collapse(bell.paragraph)
        .then(function() {
          this.updateTexts();
        }.bind(this));
    }.bind(this));
    bell.iconContainer.addEventListener('click', function(event) {
      switch(WonderPushSDK.Notification.getSubscriptionState()) {
        case WonderPushSDK.SubscriptionState.SUBSCRIBED:
        case WonderPushSDK.SubscriptionState.UNSUBSCRIBED:
          bell.uncollapse(bell.dialog);
          bell.collapse(bell.paragraph);
          bell.element.classList.remove('wonderpush-discrete');
          break;
        case WonderPushSDK.SubscriptionState.NOT_SUBSCRIBED:
          // Subscribe
          WonderPushSDK.setNotificationEnabled(true, event);
          bell.collapse(bell.dialog);
          break;
      }
    });
    window.document.addEventListener('click', function(event) {
      if (!bell.element.contains(event.srcElement)) {
        bell.collapse(bell.dialog);
        this.updateTexts();
      }
    }.bind(this));
  });

})();
