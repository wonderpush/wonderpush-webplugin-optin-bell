(function () {

  /**
   * WonderPush Web SDK plugin to present the user an opt-in bell before prompting her for push permission.
   * @class OptinBell
   * @param {external:WonderPushPluginSDK} WonderPushSDK - The WonderPush SDK instance provided automatically on intanciation.
   * @param {OptinBell.Options} options - The plugin options.
   */
  /**
   * @typedef {Object} OptinBell.Options
   * @property {String} [language] - The language code. We currently support 'en' and 'fr'. Defaults to the browser language.
   * @property {Boolean} [hideWhenSubscribed] - When true, the bell will be hidden to subscribed users. Defaults to false.
   * @property {Object} [style] - Styles to be added to the bell container.
   * @property {String} [cssPrefix] - A prefix to be used in front of all CSS classes. Use this to reset our styles and put your own. Defaults to 'wonderpush-'.
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
   * @property {String} [downloadDataButtonTitle] - Title of the download button. Defaults to "Download".
   * @property {String} [clearDataButtonTitle] - Title of the clear button. Defaults to "Clear".
   * @property {Boolean} [hidePrivacySettings] - By default, subscribed users see a Settings button giving them access to privacy settings. When hidePrivacySettings is specified, the settings button is hidden. Defaults to false.
   * @property {Boolean} [showBadge] - When true, a badge with an unread count of "1" will be displayed the first time users see the bell. Defaults to true.
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
  WonderPush.registerPlugin("optin-bell", {
    window: function OptinBell(WonderPushSDK, options) {
      // Do not show anything on unsupported browsers.
      if (WonderPushSDK.Notification.getSubscriptionState() === WonderPushSDK.SubscriptionState.UNSUPPORTED) {
        return;
      }
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
        },
        "es": {
          "Manage Notifications": "Administrar notificaciones",
          "Your personal notification data:": "Sus datos personales de notificación :",
          "WonderPush fully supports european GDPR": "WonderPush es totalmente compatible con GDPR europeo",
          "Clear": "Borrar",
          "Download": "Descargar",
          "You've blocked notifications": "Has bloqueado las notificaciones",
          "Unsubscribe": "Darse de baja de las notificaciones",
          "You're subscribed to notifications": "Estás suscrito a notificaciones",
          "Subscribe": "Suscribirse",
          "You are not receiving any notifications": "No está recibiendo ninguna notificación",
          "Loading": "Cargando",
          "Click to subscribe to notifications": "Haga clic para suscribirse a las notificaciones",
          "You won't receive more notifications": "No recibirá más notificaciones",
          "Thanks for subscribing!": "¡Gracias por suscribirse!"
        },
        "it": {
          "Manage Notifications": "Gestisci notifiche",
          "Your personal notification data:": "I tuoi dati di notifica personali:",
          "WonderPush fully supports european GDPR": "WonderPush supporta pienamente il GDPR europeo",
          "Clear": "Eliminare",
          "Download": "Scaricare",
          "You've blocked notifications": "Notifiche bloccate",
          "Unsubscribe": "Annulla iscrizione",
          "You're subscribed to notifications": "Sei iscritto alle notifiche",
          "Subscribe": "Mi iscrivo",
          "You are not receiving any notifications": "Non ricevi alcuna notifica",
          "Loading": "Carica",
          "Click to subscribe to notifications": "Fai clic per iscriverti alle notifiche",
          "You won't receive more notifications": "Non riceverai più notifiche",
          "Thanks for subscribing!": "Grazie per esserti iscritto!"
        },
        "de": {
          "Manage Notifications": "Benachrichtigungen verwalten",
          "Your personal notification data:": "Ihre persönlichen Benachrichtigungsdaten:",
          "WonderPush fully supports european GDPR": "WonderPush unterstützt die europäische GDPR",
          "Clear": "Klar",
          "Download": "Herunterladen",
          "You've blocked notifications": "Sie haben Benachrichtigungen blockiert",
          "Unsubscribe": "Abbestellen",
          "You're subscribed to notifications": "Sie haben Benachrichtigungen abonniert",
          "Subscribe": "Abonnieren",
          "You are not receiving any notifications": "Sie erhalten keine Benachrichtigungen",
          "Loading": "Wird geladen",
          "Click to subscribe to notifications": "Klicken Sie hier, um Benachrichtigungen zu abonnieren",
          "You won't receive more notifications": "Sie erhalten keine Benachrichtigungen mehr",
          "Thanks for subscribing!": "Danke fürs Abonnieren!"
        },
        "pt": {
          "Manage Notifications": "Gerenciar notificações",
          "Your personal notification data:": "Os seus dados de notificação pessoal:",
          "WonderPush fully supports european GDPR": "O WonderPush suporta totalmente o GDPR europeu",
          "Clear": "Clear",
          "Download": "Download",
          "You've blocked notifications": "Você bloqueou as notificações",
          "Unsubscribe": "Cancelar inscrição",
          "You're subscribed to notifications": "Você está inscrito nas notificações",
          "Subscribe": "Inscrever-se",
          "You are not receiving any notifications": "Você não está recebendo nenhuma notificação",
          "Loading": "Loading",
          "Click to subscribe to notifications": "Clique para assinar as notificações",
          "You won't receive more notifications": "Você não receberá mais notificações",
          "Thanks for subscribing!": "Obrigado por se inscrever!"
        },
        "nl": {
          "Manage Notifications": "Beheer pushmeldingen",
          "Your personal notification data:": "Uw persoonlijke meldingsgegevens:",
          "WonderPush fully supports european GDPR": "WonderPush ondersteunt de Europese GDPR volledig",
          "Clear": "Clear",
          "Download": "Downloaden",
          "You've blocked notifications": "Je hebt pushmeldingen geblokkeerd",
          "Unsubscribe": "Abonnement opzeggen",
          "You're subscribed to notifications": "U bent aangemeld voor kennisgevingen",
          "Subscribe": "Abonneren",
          "You are not receiving any notifications": "Je ontvangt geen meldingen meer",
          "Loading": "Bezig met laden",
          "Click to subscribe to notifications": "Klik om u te abonneren op meldingen",
          "You won't receive more notifications": "Je ontvangt geen meldingen meer",
          "Thanks for subscribing!": "Bedankt voor het inschrijven!",
        },
        "pl": {
          "Manage Notifications": "Zarządzaj powiadomieniami push",
          "Your personal notification data:": "Twoje osobiste dane powiadomień:",
          "WonderPush fully supports european GDPR": "WonderPush w pełni wspiera europejski RODO",
          "Clear": "Wyczyść dane",
          "Download": "Pobierz",
          "You've blocked notifications": "Zablokowałeś powiadomienia",
          "Unsubscribe": "Anuluj subskrypcje",
          "You're subscribed to notifications": "Subskrybujesz powiadomienia",
          "Subscribe": "Subskrybuj",
          "You are not receiving any notifications": "Nie otrzymujesz żadnych powiadomień",
          "Loading": "Ładowanie",
          "Click to subscribe to notifications": "Kliknij, aby zasubskrybować powiadomienia",
          "You won't receive more notifications": "Nie będziesz otrzymywać więcej powiadomień",
          "Thanks for subscribing!": "Dzięki za subskrypcję!",
        },
      };
      var cssPrefix = 'wonderpush-';

      var locales = WonderPushSDK.getLocales ? WonderPushSDK.getLocales() || [] : [];
      var language = locales.map(function(x) { return x.split(/[-_]/)[0]; })[0] || (navigator.language || '').split('-')[0];

      /**
       * Translates the given text
       * @param text
       * @returns {*}
       */
      var _ = function (text) {
        if (translations.hasOwnProperty(language) && translations[language][text]) return translations[language][text];
        return text;
      };

      /**
       * Installs a one-time 'transitionend' handler on given element and returns a Promise
       * that resolves when the handler is called.
       * @param elt
       * @returns {Promise<void>}
       */
      var makeTransitionPromise = function (elt) {
        return new Promise(function (res, rej) {
          var listener = function (event) {
            elt.removeEventListener('transitionend', listener);
            elt.removeEventListener('transitioncancel', listener);
            res();
          };
          elt.addEventListener('transitionend', listener);
          elt.addEventListener('transitioncancel', listener);
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
        this.element.classList.add(cssPrefix + 'bell');

        var definitions = [
          {cls: 'icon-container', name: 'iconContainer'},
          {cls: 'icon', name: 'icon', parent: 'iconContainer'},
          {cls: 'icon-badge', name: 'iconBadge', parent: 'iconContainer'},
          {cls: 'paragraph', name: 'paragraph'},
          {cls: 'help', name: 'help'},
          {cls: 'dialog', name: 'dialog'},
          {cls: 'dialog-title', name: 'dialogTitle', parent: 'dialog'},
          {cls: 'notification', name: 'notification', parent: 'dialog'},
          {cls: 'notification-icon', name: 'notificationIcon', parent: 'notification'},
          {cls: 'notification-paragraph-large', parent: 'notification'},
          {cls: 'notification-paragraph-medium', parent: 'notification'},
          {cls: 'notification-paragraph-large', parent: 'notification'},
          {cls: 'notification-paragraph-small', parent: 'notification'},
          {cls: 'dialog-button-container', name: 'dialogButtonContainer', parent: 'dialog'},
          {cls: 'dialog-settings-button', name: 'dialogSettingsButton', parent: 'dialogButtonContainer'},
          {cls: 'dialog-button', name: 'dialogButton', parent: 'dialogButtonContainer'},
          {cls: 'dialog-advanced-settings', name: 'dialogAdvancedSettings', parent: 'dialog'},
          {cls: 'dialog-advanced-settings-description', name: 'dialogAdvancedSettingsDescription', parent: 'dialogAdvancedSettings'},
          {cls: 'dialog-advanced-settings-button-container', name: 'dialogAdvancedSettingsButtonContainer', parent: 'dialogAdvancedSettings'},
          {cls: 'dialog-advanced-settings-download-button', name: 'dialogAdvancedSettingsDownloadButton', parent: 'dialogAdvancedSettingsButtonContainer'},
          {cls: 'dialog-advanced-settings-clear-button', name: 'dialogAdvancedSettingsClearButton', parent: 'dialogAdvancedSettingsButtonContainer'},
          {cls: 'dialog-advanced-settings-fineprint', name: 'dialogAdvancedSettingsFineprint', parent: 'dialogAdvancedSettings'},
        ];

        // Create the DOM
        definitions.forEach(function (definition) {
          var elt = window.document.createElement('div');
          if (definition.name) this[definition.name] = elt;
          var parent = this[definition.parent || 'element'];
          parent.appendChild(elt);
          elt.classList.add(cssPrefix + definition.cls);
        }.bind(this));

        if (options.hidePrivacySettings) {
          this.dialogSettingsButton.style.display = 'none';
        }
        /**
         * Is the given elt/prop collapsed ?
         * @param {HTMLElement|string} Element of name of a property resolving to an element
         * @return {Boolean}
         */
        this.isCollapsed = function (prop) {
          var elt = typeof prop === 'string' ? this[prop] : prop;
          if (!elt) return false;
          return elt.classList.contains(cssPrefix + 'collapsed');
        }.bind(this);

        /**
         * Collapse the given elt/prop. Returns a promise that resolves when the animation is complete.
         * Doesn't do anything and resolves immediately if bell already collapsed
         * @param {HTMLElement|string} Element of name of a property resolving to an element
         * @return {Promise}
         */
        this.collapse = function (prop) {
          var elt = typeof prop === 'string' ? this[prop] : prop;
          if (!elt) return;
          if (elt.classList.contains(cssPrefix + 'collapsed')) return Promise.resolve();
          elt.classList.add(cssPrefix + 'collapsed');
          var result = this.element.parentNode ? makeTransitionPromise(elt) : Promise.resolve();
          if (elt === this.dialog) {
            result.then(function () {
              this.collapse(this.dialogAdvancedSettings);
            }.bind(this));
          } else if (elt === this.paragraph) {
            result.then(function() {
              this.paragraph.classList.add(cssPrefix + 'hidden');
            }.bind(this));
          }
          return result;
        }.bind(this);

        /**
         * Uncollapse the given elt/prop. Returns a promise that resolves when the animation is complete.
         * Doesn't do anything and resolves immediately if bell already uncollapsed
         * @param {HTMLElement|string} Element of name of a property resolving to an element
         * @return {Promise}
         */
        this.uncollapse = function (prop) {
          var elt = typeof prop === 'string' ? this[prop] : prop;
          if (!elt) return;
          if (!elt.classList.contains(cssPrefix + 'collapsed')) return Promise.resolve();
          elt.classList.remove(cssPrefix + 'collapsed');
          elt.classList.remove(cssPrefix + 'hidden');
          return makeTransitionPromise(elt);
        }.bind(this);

        /**
         * Collapse or uncollapse the given elt/prop. Returns a promise that resolves when the animation is complete.
         * @param {HTMLElement|string} Element of name of a property resolving to an element
         * @return {Promise}
         */
        this.toggleCollapse = function (prop) {
          var elt = typeof prop === 'string' ? this[prop] : prop;
          if (!elt) return;
          if (elt.classList.contains(cssPrefix + 'collapsed')) return this.uncollapse(elt);
          return this.collapse(elt);
        }.bind(this);

        /**
         * Deactivate this bell. Returns a promise that resolves when the animation is complete.
         * Doesn't do anything and resolves immediately if bell already deactivated
         * @param {HTMLElement|string} Element of name of a property resolving to an element
         * @return {Promise}
         */
        this.deactivate = function () {
          if (this.element.classList.contains(cssPrefix + 'deactivated')) return;
          this.element.classList.add(cssPrefix + 'deactivated');
          return makeTransitionPromise(this.element).then(function () {
            this.element.classList.add(cssPrefix + 'hidden');
          }.bind(this));
        }.bind(this);

        /**
         * Activate this bell. Returns a promise that resolves when the animation is complete.
         * Doesn't do anything and resolves immediately if bell already active
         * @param {HTMLElement|string} Element of name of a property resolving to an element
         * @return {Promise}
         */
        this.activate = function () {
          if (!this.element.classList.contains(cssPrefix + 'deactivated')) return;
          this.element.classList.remove(cssPrefix + 'hidden');
          setTimeout(function () {  // Needs setTimeout to be animated
            this.element.classList.remove(cssPrefix + 'deactivated');
          }.bind(this), 0);
          return makeTransitionPromise(this.element);
        };

        // Configure a few things
        if (options.notificationIcon) this.notificationIcon.style.backgroundImage = 'url(' + options.notificationIcon.replace('(', '%28').replace(')', '%29') + ')';
        this.dialogTitle.textContent = options.dialogTitle || _('Manage Notifications');
        this.dialogAdvancedSettingsDescription.textContent = options.advancedSettingsDescription || _('Your personal notification data:');
        if (options.advancedSettingsFineprint) {
          this.dialogAdvancedSettingsFineprint.textContent = options.advancedSettingsFineprint;
        } else {
          this.dialogAdvancedSettingsFineprint.innerHTML = _('WonderPush fully supports european GDPR').replace('WonderPush', '<a href="https://www.wonderpush.com/">WonderPush</a>');
        }
        this.dialogAdvancedSettingsClearButton.textContent = options.clearDataButtonTitle || _('Clear');
        this.dialogAdvancedSettingsDownloadButton.textContent = options.downloadDataButtonTitle || _('Download');
        this.dialogSettingsButton.addEventListener('click', function () {
          this.toggleCollapse(this.dialogAdvancedSettings);
        }.bind(this));
        this.iconBadge.textContent = '1';
        this.collapse('help');
        this.collapse('dialog');
        this.collapse('paragraph');
        this.collapse('iconBadge');
        this.collapse('dialogAdvancedSettings');
      }

      options = options || {};
      if (options.cssPrefix) cssPrefix = options.cssPrefix;
      WonderPushSDK.loadStylesheet('style.css');
      var bell = new Bell({
        notificationIcon: options.notificationIcon || WonderPushSDK.getNotificationIcon(),
        dialogTitle: options.dialogTitle,
        hidePrivacySettings: options.hidePrivacySettings,
        clearDataButtonTitle: options.clearDataButtonTitle,
        downloadDataButtonTitle: options.downloadDataButtonTitle,
        advancedSettingsDescription: options.advancedSettingsDescription,
        advancedSettingsFineprint: options.advancedSettingsFineprint,
      });

      /**
       * Attaches the bell element to the document body
       * @type {any}
       */
      this.showBell = function () {
        var readyState = window.document.readyState;
        var attach = function () {
          window.document.body.appendChild(bell.element);
        };
        if (readyState === 'loading') {
          window.document.addEventListener('domcontentloaded', attach);
        } else {
          attach();
        }
      }.bind(this);

      /**
       * Detaches the bell element from the document body
       */
      this.hideBell = function() {
        if (bell.element && bell.element.parentNode) {
          bell.element.parentNode.removeChild(bell.element);
        }
      };

      /**
       * Adapts the UI to a subscription state change
       * @param {WonderPushSDK.prototype.SubscriptionState} state
       * @param {object|undefined} event. If present, the event that reported the state change
       */
      this.updateTexts = function () {
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

      /**
       * Makes sure the bell stays discrete when it should;
       */
      this.updateDiscretion = function() {
        if (WonderPushSDK.Notification.getSubscriptionState() === WonderPushSDK.SubscriptionState.SUBSCRIBED &&
          bell.isCollapsed(bell.dialog) &&
          bell.isCollapsed(bell.help)) {
          bell.element.classList.add(cssPrefix + 'discrete');
        }
      }.bind(this);

      // Handle subscription state changes
      window.addEventListener('WonderPushEvent', function (event) {
        if (!event.detail || !event.detail.state || event.detail.name !== 'subscription') return;
        this.updateTexts();
        bell.collapse(bell.dialog);
        bell.collapse(bell.help);
        bell.collapse(bell.iconBadge);
        if (event.detail.state === WonderPushSDK.SubscriptionState.UNSUBSCRIBED) {
          bell.paragraph.textContent = options.unsubscribedText || _('You won\'t receive more notifications');
          setTimeout(function () {
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
          setTimeout(function () {
            // Deactivate the bell
            if (options.hideWhenSubscribed) {
              bell.deactivate();
              return;
            }

            bell.element.classList.add(cssPrefix + 'discrete');
            bell.collapse(bell.paragraph)
              .then(function () {
                this.updateTexts();
              }.bind(this));
          }.bind(this), 1200);
        }
        if (event.detail.state === WonderPushSDK.SubscriptionState.DENIED) {
          bell.element.classList.remove(cssPrefix + 'discrete');
          bell.uncollapse(bell.paragraph);
          // Activate the bell
          if (options.hideWhenSubscribed) {
            bell.activate();
          }
          setTimeout(function () {
            bell.collapse(bell.paragraph);
          }.bind(this), 1200);
        }
      }.bind(this));

      // (Un)subscribe button
      bell.dialogButton.addEventListener('click', function (event) {
        switch (WonderPushSDK.Notification.getSubscriptionState()) {
          case WonderPushSDK.SubscriptionState.SUBSCRIBED:
            // Unsubscribe
            WonderPushSDK.setNotificationEnabled(false, event)
              .then(function () {
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

      // Download data button
      bell.dialogAdvancedSettingsDownloadButton.addEventListener('click', function (event) {
        WonderPushSDK.Data.downloadExport();
      });

      // Clear data button
      bell.dialogAdvancedSettingsClearButton.addEventListener('click', function (event) {
        if (window.confirm(_('This action will clear all the data used to send you targeted push notifications. Are you sure ?'))) {
          bell.collapse(bell.dialog);
          WonderPushSDK.Data.clearAll()
            .then(function () {
              bell.paragraph.textContent = _('Data successfully cleared');
              bell.uncollapse(bell.paragraph);
              setTimeout(function() {
                bell.collapse(bell.paragraph);
                this.updateTexts();
              }.bind(this), 1200);
            }.bind(this));
        }
      }.bind(this));
      // Handle mouse events
      bell.iconContainer.addEventListener('mouseenter', function () {
        bell.collapse(bell.iconBadge);
        if (bell.isCollapsed(bell.dialog)) bell.uncollapse(bell.paragraph);
      });
      bell.iconContainer.addEventListener('mouseleave', function () {
        this.updateDiscretion();
        bell.collapse(bell.paragraph)
          .then(function () {
            this.updateTexts();
          }.bind(this));
      }.bind(this));
      bell.iconContainer.addEventListener('click', function (event) {
        if (!bell.isCollapsed(bell.dialog)) {
          bell.collapse(bell.dialog);
          return;
        }
        var state = WonderPushSDK.Notification.getSubscriptionState();
        switch (state) {
          case WonderPushSDK.SubscriptionState.DENIED: {
            // Do not show help picture if the user is on another domain
            // because performing help steps would allow notifications on the wrong domain
            if (WonderPushSDK.isOnRightDomain()) {
              bell.uncollapse(bell.help);
              bell.collapse(bell.paragraph);
              bell.element.classList.remove(cssPrefix + 'discrete');
            } else {
              // TODO: uncomment me when the subscription popup has a better behavior and presents acceptable help to the user.
              // WonderPushSDK.setNotificationEnabled(true, event);
            }
          }
            break;
          case WonderPushSDK.SubscriptionState.SUBSCRIBED:
          case WonderPushSDK.SubscriptionState.UNSUBSCRIBED:
            bell.dialogSettingsButton.style.display = options.hidePrivacySettings ? 'none' : state === WonderPushSDK.SubscriptionState.SUBSCRIBED ? '' : 'none';
            bell.uncollapse(bell.dialog);
            bell.collapse(bell.paragraph);
            bell.element.classList.remove(cssPrefix + 'discrete');
            break;
          case WonderPushSDK.SubscriptionState.NOT_SUBSCRIBED:
            // Subscribe
            WonderPushSDK.setNotificationEnabled(true, event);
            bell.collapse(bell.dialog);
            break;
        }
      });
      window.document.addEventListener('click', function (event) {
        if (!bell.element.contains(event.srcElement)) {
          bell.collapse(bell.dialog);
          bell.collapse(bell.help);
          this.updateDiscretion();
          this.updateTexts();
        }
      }.bind(this));

      // Main program

      // Options
      if (options.style) for (var prop in options.style) bell.element.style[prop] = options.style[prop];
      if (options.position === 'right') bell.element.classList.add(cssPrefix + 'right');
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
        bell.element.classList.add(cssPrefix + 'discrete');
        bell.collapse(bell.iconBadge);
      }
      // Deactivated
      if (options.hideWhenSubscribed && WonderPushSDK.Notification.getSubscriptionState() === WonderPushSDK.SubscriptionState.SUBSCRIBED) {
        bell.element.classList.add(cssPrefix + 'hidden');
        bell.element.classList.add(cssPrefix + 'deactivated');
      }
      // Unread badge
      if (!options.hasOwnProperty('showBadge') || options.showBadge) {
        WonderPushSDK.Storage.get('badgeShown')
          .then(function (result) {
            if (result.badgeShown) return;
            WonderPushSDK.Storage.set('badgeShown', true);
            bell.uncollapse(bell.iconBadge);
          });
      }
    }
  });
})();
