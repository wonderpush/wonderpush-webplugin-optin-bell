(function () {

  var translations = {
    "fr": {
      "Manage Notifications": "Gestion des notifications",
      "Your personal notification data:": "Vos données personnelles de notification :",
      "WonderPush fully supports european GDPR": "WonderPush soutient pleinement la RGPD européenne",
      "Clear": "Effacer",
      "Download": "Télécharger",
      "You've blocked notifications": "Vous avez bloqué les notifications",
      "Unsubscribe": "Désinscription",
      "You're subscribed to notifications": "Vous êtes abonné aux notifications",
      "Subscribe": "Je m'abonne",
      "You are not receiving any notifications": "Vous ne recevez pas de notifications",
      "Loading": "Chargement",
      "Click to subscribe to notifications": "Cliquez pour vous abonner aux notifications",
      "You won't receive more notifications": "Vous ne recevrez plus de notifications",
      "Thanks for subscribing!": "Merci de vous être abonné !"
    }
  };

  /**
   * Translates the given text
   * @param text
   * @returns {*}
   */
  var _ = function(text) {
    var language = (navigator.language || '').split('-')[0];
    if (translations.hasOwnProperty(language) && translations[language][text]) return translations[language][text];
    return text;
  };

  /**
   * Installs a one-time 'transitionend' handler on given element and returns a Promise
   * that resolves when the handler is called.
   * @param elt
   * @returns {Promise<void>}
   */
  var makeTransitionPromise = function(elt) {
    return new Promise(function(res, rej) {
      var listener = function(event) {
        elt.removeEventListener('transitionend', listener);
        res();
      };
      elt.addEventListener('transitionend', listener);
    });
  };
  /**
   * A display object that builds the DOM and keep references to important nodes.
   * @param {object?} options
   * @param {string?} options.notificationIcon
   * @param {string?} options.dialogTitle
   * @param {string?} options.advancedSettingsDescription
   * @param {string?} options.advancedSettingsFineprint
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
   * @property {HTMLElement} dialogButtonContainer
   * @property {HTMLElement} dialogSettingsButton
   * @property {HTMLElement} dialogAdvancedSettings
   * @property {HTMLElement} dialogAdvancedSettingsDescription
   * @property {HTMLElement} dialogAdvancedSettingsButtonContainer
   * @property {HTMLElement} dialogAdvancedSettingsClearButton
   * @property {HTMLElement} dialogAdvancedSettingsDownloadButton
   * @property {HTMLElement} dialogAdvancedSettingsFineprint
   */
  function Bell(options) {
    options = options || {};
    this.element = window.document.createElement('div');
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
      { cls: 'wonderpush-dialog-button-container', name: 'dialogButtonContainer', parent: 'dialog'},
      { cls: 'wonderpush-dialog-settings-button', name: 'dialogSettingsButton', parent: 'dialogButtonContainer'},
      { cls: 'wonderpush-dialog-button', name: 'dialogButton', parent: 'dialogButtonContainer'},
      { cls: 'wonderpush-dialog-advanced-settings', name: 'dialogAdvancedSettings', parent: 'dialog'},
      { cls: 'wonderpush-dialog-advanced-settings-description', name: 'dialogAdvancedSettingsDescription', parent: 'dialogAdvancedSettings'},
      { cls: 'wonderpush-dialog-advanced-settings-button-container', name: 'dialogAdvancedSettingsButtonContainer', parent: 'dialogAdvancedSettings'},
      { cls: 'wonderpush-dialog-advanced-settings-download-button', name: 'dialogAdvancedSettingsDownloadButton', parent: 'dialogAdvancedSettingsButtonContainer'},
      { cls: 'wonderpush-dialog-advanced-settings-clear-button', name: 'dialogAdvancedSettingsClearButton', parent: 'dialogAdvancedSettingsButtonContainer'},
      { cls: 'wonderpush-dialog-advanced-settings-fineprint', name: 'dialogAdvancedSettingsFineprint', parent: 'dialogAdvancedSettings'},
    ];

    // Create the DOM
    definitions.forEach(function (definition) {
      var elt = window.document.createElement('div');
      if (definition.name) this[definition.name] = elt;
      var parent = this[definition.parent || 'element'];
      parent.appendChild(elt);
      elt.classList.add(definition.cls);
    }.bind(this));

    /**
     * Is the given elt/prop collapsed ?
     * @param {HTMLElement|string} Element of name of a property resolving to an element
     * @return {Boolean}
     */
    this.isCollapsed = function(prop) {
      var elt = typeof prop === 'string' ? this[prop] : prop;
      if (!elt) return false;
      return elt.classList.contains('wonderpush-collapsed');
    }.bind(this);

    /**
     * Collapse the given elt/prop. Returns a promise that resolves when the animation is complete.
     * Doesn't do anything and resolves immediately if bell already collapsed
     * @param {HTMLElement|string} Element of name of a property resolving to an element
     * @return {Promise}
     */
    this.collapse = function(prop) {
      var elt = typeof prop === 'string' ? this[prop] : prop;
      if (!elt) return;
      if (elt.classList.contains('wonderpush-collapsed')) return Promise.resolve();
      elt.classList.add('wonderpush-collapsed');
      var result = makeTransitionPromise(elt);
      if (elt === this.dialog) {
        result.then(function() { this.collapse(this.dialogAdvancedSettings); }.bind(this));
      }
      return result;
    }.bind(this);

    /**
     * Uncollapse the given elt/prop. Returns a promise that resolves when the animation is complete.
     * Doesn't do anything and resolves immediately if bell already uncollapsed
     * @param {HTMLElement|string} Element of name of a property resolving to an element
     * @return {Promise}
     */
    this.uncollapse = function(prop) {
      var elt = typeof prop === 'string' ? this[prop] : prop;
      if (!elt) return;
      if (!elt.classList.contains('wonderpush-collapsed')) return Promise.resolve();
      elt.classList.remove('wonderpush-collapsed');
      return makeTransitionPromise(elt);
    }.bind(this);

    /**
     * Collapse or uncollapse the given elt/prop. Returns a promise that resolves when the animation is complete.
     * @param {HTMLElement|string} Element of name of a property resolving to an element
     * @return {Promise}
     */
    this.toggleCollapse = function(prop) {
      var elt = typeof prop === 'string' ? this[prop] : prop;
      if (!elt) return;
      if (elt.classList.contains('wonderpush-collapsed')) return this.uncollapse(elt);
      return this.collapse(elt);
    }.bind(this);

    /**
     * Deactivate this bell. Returns a promise that resolves when the animation is complete.
     * Doesn't do anything and resolves immediately if bell already deactivated
     * @param {HTMLElement|string} Element of name of a property resolving to an element
     * @return {Promise}
     */
    this.deactivate = function() {
      if (this.element.classList.contains('wonderpush-deactivated')) return;
      this.element.classList.add('wonderpush-deactivated');
      return makeTransitionPromise(this.element).then(function() {
        this.element.classList.add('wonderpush-hidden');
      }.bind(this));
    }.bind(this);

    /**
     * Activate this bell. Returns a promise that resolves when the animation is complete.
     * Doesn't do anything and resolves immediately if bell already active
     * @param {HTMLElement|string} Element of name of a property resolving to an element
     * @return {Promise}
     */
    this.activate = function() {
      if (!this.element.classList.contains('wonderpush-deactivated')) return;
      this.element.classList.remove('wonderpush-hidden');
      setTimeout(function() {  // Needs setTimeout to be animated
        this.element.classList.remove('wonderpush-deactivated');
      }.bind(this), 0);
      return makeTransitionPromise(this.element);
    };

    // Configure a few things
    if (options.notificationIcon) this.notificationIcon.style.backgroundImage = 'url(' + options.notificationIcon + ')';
    this.dialogTitle.textContent = options.dialogTitle || _('Manage Notifications');
    this.dialogAdvancedSettingsDescription.textContent = options.advancedSettingsDescription || _('Your personal notification data:');
    if (options.advancedSettingsFineprint) {
      this.dialogAdvancedSettingsFineprint.textContent = options.advancedSettingsFineprint;
    } else {
      this.dialogAdvancedSettingsFineprint.innerHTML = _('WonderPush fully supports european GDPR').replace('WonderPush', '<a href="https://www.wonderpush.com/">WonderPush</a>');
    }
    this.dialogAdvancedSettingsClearButton.textContent = _('Clear');
    this.dialogAdvancedSettingsDownloadButton.textContent = _('Download');
    this.dialogSettingsButton.addEventListener('click', function() { this.toggleCollapse(this.dialogAdvancedSettings); }.bind(this));
    this.iconBadge.textContent = '1';
    this.collapse('help');
    this.collapse('dialog');
    this.collapse('paragraph');
    this.collapse('iconBadge');
    this.collapse('dialogAdvancedSettings');
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
   * @property {String} [language] - The language code. We currently support 'en' and 'fr'. Defaults to the browser language.
   * @property {Boolean} [hideWhenSubscribed] - When true, the bell will be hidden to subscribed users. Defaults to false.
   * @property {Object} [style] - Styles to be added to the bell container.
   * @property {String} [color] - Main color of the widget. Defaults to #ff6f61
   * @property {String} [position] - Acceptable values are "left" or "right". Defaults to "left".
   * @property {String} [bellIcon] - URL of the bell icon.
   * @property {String} [dialogTitle] - Title of the settings dialog. Defaults to "Manage Notifications".
   * @property {String} [subscribeButtonTitle] - Title of the subscribe button. Defaults to "Subscribe".
   * @property {String} [unsubscribeButtonTitle] - Title of the subscribe button. Defaults to "Unsubscribe".
   * @property {String} [notificationIcon] - Url of the mock notification icon in the settings dialog. Defaults to your app's notification icon as specified in your dashboard.
   * @property {String} [subscribeInviteText] - Text displayed to invite user to subscribe. Defaults to "Click to subscribe to notifications".
   * @property {String} [alreadySubscribedText] - Text displayed when already subscribed users hover the notification bell. Defaults to "You're subscribed to notifications".
   * @property {String} [alreadyUnsubscribedText] - Text displayed when unsubscribed users hover the notification bell. Defaults to "You are not receiving any notifications".
   * @property {String} [blockedText] - Text displayed when already users have blocked notifications. Defaults to "You've blocked notifications".
   * @property {String} [subscribedText] - Text displayed when users subscribe. Defaults to "Thanks for subscribing!".
   * @property {String} [unsubscribedText] - Text displayed when users unsubscribe. Defaults to "You won't receive more notifications".
   * @property {String} [advancedSettingsDescription] - Text displayed above advanced settings. Defaults to "Your personal notification data:".
   * @property {String} [advancedSettingsFineprint] - Text displayed below advanced settings. Defaults to "WonderPush fully supports european GDPR".
   * @property {Boolean} [showUnreadBadge] - When true, a badge with an unread count of "1" will be displayed the first time users see the bell. Defaults to true.
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
  WonderPush.registerPlugin("optin-bell", { window: function OptinBell(WonderPushSDK, options) {
    options = options || {};
    WonderPushSDK.loadStylesheet('style.css');
    var bell = new Bell({
      notificationIcon: options.notificationIcon || WonderPushSDK.getNotificationIcon(),
      dialogTitle: options.dialogTitle,
      advancedSettingsDescription: options.advancedSettingsDescription,
      advancedSettingsFineprint: options.advancedSettingsFineprint,
    });

    /**
     * Attaches the bell element to the document body
     * @type {any}
     */
    this.showBell = function () {
      var readyState = window.document.readyState;
      var attach = function() { window.document.body.appendChild(bell.element); };
      if (readyState === 'loading') {
        window.document.addEventListener('domcontentloaded', attach);
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
        case WonderPushSDK.SubscriptionState.DENIED:
          bell.dialogButton.textContent = '';
          bell.paragraph.textContent = options.blockedText || _('You\'ve blocked notifications');
          // We don't want to load this earlier
          bell.help.style.backgroundImage = 'url(https://cdn.by.wonderpush.com/plugins/optin-bell/1.0.0/allow-notifications.jpg)';
          break;
        case WonderPushSDK.SubscriptionState.SUBSCRIBED:
          bell.dialogButton.textContent = options.unsubscribeButtonTitle || _('Unsubscribe');
          bell.paragraph.textContent = options.alreadySubscribedText || _('You\'re subscribed to notifications');
          break;
        case WonderPushSDK.SubscriptionState.UNSUBSCRIBED:
          bell.dialogButton.textContent = options.subscribeButtonTitle || _('Subscribe');
          bell.paragraph.textContent = options.alreadyUnsubscribedText || _('You are not receiving any notifications');
          break;
        case WonderPushSDK.SubscriptionState.UNDETERMINED:
          bell.dialogButton.textContent = _('Loading');
          bell.paragraph.textContent = _('Loading');
          break;
        case WonderPushSDK.SubscriptionState.NOT_SUBSCRIBED:
          bell.dialogButton.textContent = _('Subscribe');
          bell.paragraph.textContent = options.subscribeInviteText || _('Click to subscribe to notifications');
          break;
      }
    };

    // Handle subscription state changes
    window.addEventListener('WonderPushEvent', function(event) {
      if (!event.detail || !event.detail.state || event.detail.name !== 'subscription') return;
      this.updateTexts();
      bell.collapse(bell.dialog);
      bell.collapse(bell.help);
      if (event.detail.state === WonderPushSDK.SubscriptionState.UNSUBSCRIBED) {
        bell.paragraph.textContent = options.unsubscribedText || _('You won\'t receive more notifications');
        setTimeout(function() {
          bell.collapse(bell.paragraph);
          this.updateTexts();
          // Activate the bell
          if (options.hideWhenSubscribed) {
            bell.activate();
          }
        }.bind(this), 1200);
      }
      if (event.detail.state === WonderPushSDK.SubscriptionState.SUBSCRIBED) {
        bell.paragraph.textContent = options.subscribedText || _('Thanks for subscribing!');
        bell.uncollapse(bell.paragraph);
        // Set discrete after a while
        setTimeout(function() {
          // Deactivate the bell
          if (options.hideWhenSubscribed) {
            bell.deactivate();
            return;
          }

          bell.element.classList.add('wonderpush-discrete');
          bell.collapse(bell.paragraph)
            .then(function() {
              this.updateTexts();
            }.bind(this));
        }.bind(this), 1200);
      }
      if (event.detail.state === WonderPushSDK.SubscriptionState.DENIED) {
        bell.element.classList.remove('wonderpush-discrete');
        bell.uncollapse(bell.paragraph);
        // Activate the bell
        if (options.hideWhenSubscribed) {
          bell.activate();
        }
        setTimeout(function() {
          bell.collapse(bell.paragraph);
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

    // Handle mouse events
    bell.iconContainer.addEventListener('mouseenter', function() {
      bell.collapse(bell.iconBadge);
      if (bell.isCollapsed(bell.dialog)) bell.uncollapse(bell.paragraph);
    });
    bell.iconContainer.addEventListener('mouseleave', function() {
      bell.collapse(bell.paragraph)
        .then(function() {
          this.updateTexts();
        }.bind(this));
    }.bind(this));
    bell.iconContainer.addEventListener('click', function(event) {
      if (!bell.isCollapsed(bell.dialog)) {
        bell.collapse(bell.dialog);
        return;
      }
      var state = WonderPushSDK.Notification.getSubscriptionState();
      switch(state) {
        case WonderPushSDK.SubscriptionState.DENIED: {
          // Do not show help picture if the user is on another domain
          // because performing help steps would allow notifications on the wrong domain
          if (WonderPushSDK.isOnRightDomain()) {
            bell.uncollapse(bell.help);
            bell.collapse(bell.paragraph);
            bell.element.classList.remove('wonderpush-discrete');
          } else {
            // TODO: uncomment me when the subscription popup has a better behavior and presents acceptable help to the user.
            // WonderPushSDK.setNotificationEnabled(true, event);
          }
        }
          break;
        case WonderPushSDK.SubscriptionState.SUBSCRIBED:
        case WonderPushSDK.SubscriptionState.UNSUBSCRIBED:
          bell.dialogSettingsButton.style.display = state === WonderPushSDK.SubscriptionState.SUBSCRIBED ? '' : 'none';
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
        bell.collapse(bell.help);
        if (WonderPushSDK.Notification.getSubscriptionState() === WonderPushSDK.SubscriptionState.SUBSCRIBED) bell.element.classList.add('wonderpush-discrete');

        this.updateTexts();
      }
    }.bind(this));

    // Main program

    // Options
    if (options.style) for (var prop in options.style) bell.element.style[prop] = options.style[prop];
    if (options.position === 'right') bell.element.classList.add('wonderpush-right');
    if (options.color) {
      bell.iconContainer.style.backgroundColor = options.color;
      bell.dialogButton.style.backgroundColor = options.color;
      bell.dialogAdvancedSettingsClearButton.style.color = options.color;
      bell.dialogAdvancedSettingsDownloadButton.style.color = options.color;
      bell.dialogAdvancedSettingsClearButton.style.borderColor = options.color;
      bell.dialogAdvancedSettingsDownloadButton.style.borderColor = options.color;
    }
    if (options.bellIcon) {
      bell.icon.style.maskImage = bell.icon.style.webkitMaskImage = 'url(' + options.bellIcon + ')';
    }
    // Attach
    this.showBell();
    // Texts
    this.updateTexts();
    // Discrete
    if (WonderPushSDK.Notification.getSubscriptionState() === WonderPushSDK.SubscriptionState.SUBSCRIBED) {
      bell.element.classList.add('wonderpush-discrete');
    }
    // Deactivated
    if (options.hideWhenSubscribed && WonderPushSDK.Notification.getSubscriptionState() === WonderPushSDK.SubscriptionState.SUBSCRIBED) {
      bell.element.classList.add('wonderpush-hidden');
      bell.element.classList.add('wonderpush-deactivated');
    }
    // Unread badge
    if (!options.hasOwnProperty('showUnreadBadge') || options.showUnreadBadge) {
      WonderPushSDK.Storage.get('badgeShown')
        .then(function(result) {
          if (result.badgeShown) return;
          WonderPushSDK.Storage.set('badgeShown', true);
          bell.uncollapse(bell.iconBadge);
        });
    }

    }});
})();
