/*! whatsbutton v1.0.1 | MIT License | https://github.com/mavisland/whatsbutton */
(function ($, window, document) {
  var WhatsButton = function (element, options) {
    this.elm = element;
    this.options = options;
  };

  WhatsButton.prototype = {
    classes: {
      base: "whatsbutton",
      position: "is-right",
      isOpen: "is-open",
      isActive: "is-active",
      toggleButton: "wb-toggle-button",
      toggleBadge: "wb-unread-badge",
      chatScreen: "wb-chat",
      chatHeader: "wb-chat-header",
      userObject: "wb-user-object",
      userAvatar: "wb-user-avatar",
      userBody: "wb-user-body",
      userName: "wb-user-name",
      userStatus: "wb-user-status",
      chatBody: "wb-chat-body",
      messageList: "wb-message-list",
      messageListItem: "wb-message-list-item",
      chatFooter: "wb-chat-footer",
      messageInput: "wb-message-input",
      submitButton: "wb-send-button",
    },
    defaults: {
      position: "right",
      showBadge: true,
      countBadge: 1,
      timeoutBadge: 1500,
      alwaysOpen: false,
      alwaysOpenTimeout: 2500,
      autoOpen: true,
      autoOpenTimeout: 5000,
      doNotDisturb: false,
      name: "Tanju Yildiz",
      avatar: "https://avatars.githubusercontent.com/u/119868?s=128",
      status: "online",
      showStatus: true,
      messages: "Hello there",
      placeholder: "Type here...",
      defaultMessage: "Hello",
      phone: "",
    },
    init: function () {
      // Introduce defaults that can be extended either
      // globally or using an object literal.
      this.config = $.extend({}, this.defaults, this.options);

      this.elm.classList.add(this.classes.base);

      if (this.config.position === "left" || this.config.position === "right") {
        this.elm.classList.add("is-" + this.config.position);
      } else {
        this.elm.classList.add(this.classes.position);
      }

      this.render();

      return this;
    },
    setCookie: function (name, value, days) {
      var expires = "";

      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
      }

      return (document.cookie = name + "=" + (value || "") + expires + "; path=/");
    },
    getCookie: function (name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(";");

      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];

        while (c.charAt(0) == " ") {
          c = c.substring(1, c.length);
        }

        if (c.indexOf(nameEQ) == 0) {
          return c.substring(nameEQ.length, c.length);
        }
      }

      return null;
    },
    eraseCookie: function (name) {
      return (document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;");
    },
    render: function () {
      var self = this;

      // Append Toggle Button
      var $toggleButton = document.createElement("div");
      $toggleButton.classList.add(self.classes.toggleButton);
      self.elm.appendChild($toggleButton);

      // Check if the badge will show
      if (self.config.showBadge) {
        // Append Unread Messages Badge
        var $toggleBadge = document.createElement("span");
        $toggleBadge.className = self.classes.toggleBadge;
        $toggleBadge.innerHTML = self.config.countBadge;
        $toggleButton.appendChild($toggleBadge);

        setTimeout(function () {
          document.querySelector("." + self.classes.toggleBadge).style.display = "block";
        }, self.config.timeoutBadge);
      }

      // Append Chat Screen
      var $chat = document.createElement("div");
      $chat.classList.add(self.classes.chatScreen);
      self.elm.appendChild($chat);

      // Check if the chat screen will always be shown.
      if (self.config.alwaysOpen && !self.elm.classList.contains(self.classes.isOpen)) {
        setTimeout(function () {
          self.elm.classList.add(self.classes.isOpen);
        }, self.config.alwaysOpenTimeout);

        self.setCookie("wbAlwaysOpen", "true");
      } else {
        self.eraseCookie("wbAlwaysOpen");

        // Check if do not disturb mode is turned on
        if (self.config.doNotDisturb) {
          if (self.getCookie("wbShownPopup") !== "true") {
            setTimeout(function () {
              self.elm.classList.toggle(self.classes.isActive);
            }, self.config.autoOpenTimeout);

            self.setCookie("wbShownPopup", "true");
          }
        } else {
          // Check if the chat screen will open automatically
          if (self.config.autoOpen && !self.elm.classList.contains(self.classes.isActive)) {
            setTimeout(function () {
              self.elm.classList.toggle(self.classes.isActive);
            }, self.config.autoOpenTimeout);

            self.setCookie("wbShownPopup", "true");
          }
        }
      }

      // Append Dialog Screen Header
      var $chatHeader = document.createElement("div");
      $chatHeader.classList.add(self.classes.chatHeader);
      $chat.appendChild($chatHeader);

      // Append User Object
      var $userObject = document.createElement("div");
      $userObject.classList.add(self.classes.userObject);
      $chatHeader.appendChild($userObject);

      // Append User Avatar
      var $userAvatar = document.createElement("img");
      $userAvatar.classList.add(self.classes.userAvatar);
      $userAvatar.setAttribute("src", self.config.avatar);
      $userObject.appendChild($userAvatar);

      // Append User Body
      var $userBody = document.createElement("div");
      $userBody.classList.add(self.classes.userBody);
      $chatHeader.appendChild($userBody);

      // Append User Name
      var $userName = document.createElement("strong");
      $userName.className = self.classes.userName;
      $userName.innerHTML = self.config.name;
      $userBody.appendChild($userName);

      // Append User Status
      var $userStatus = document.createElement("small");
      $userStatus.className = self.classes.userStatus;
      $userStatus.innerHTML = self.config.status;

      if (self.config.showStatus) {
        $userBody.appendChild($userStatus);
      }

      // Append Dialog Screen Body
      var $chatBody = document.createElement("div");
      $chatBody.classList.add(self.classes.chatBody);
      $chat.appendChild($chatBody);

      // Append Messages List
      var $messageList = document.createElement("ul");
      $messageList.classList.add(self.classes.messageList);
      $chatBody.appendChild($messageList);

      // Append Messages
      if (typeof self.config.messages === "object") {
        var messages = self.config.messages;

        messages.forEach(function (message, i) {
          setTimeout(function () {
            var item = document.createElement("li");
            item.className = self.classes.messageListItem;
            item.innerHTML = message;
            $messageList.appendChild(item);
          }, 2000 * i);
        });
      } else {
        var item = document.createElement("li");
        item.className = self.classes.messageListItem;
        item.innerHTML = self.config.messages;
        $messageList.appendChild(item);
      }

      // Append Dialog Screen Footer
      var $chatFooter = document.createElement("div");
      $chatFooter.classList.add(self.classes.chatFooter);
      $chat.appendChild($chatFooter);

      // Append Message Input
      var $messageInput = document.createElement("input");
      $messageInput.classList.add(self.classes.messageInput);
      $messageInput.setAttribute("type", "text");
      $messageInput.setAttribute("placeholder", self.config.placeholder);
      $chatFooter.appendChild($messageInput);

      // Append Submit Button
      var $submitButton = document.createElement("div");
      $submitButton.classList.add(self.classes.submitButton);
      $chatFooter.appendChild($submitButton);

      // Show the chat screen when the toggle button is clicked.
      $toggleButton.addEventListener("click", function () {
        if (self.elm.classList.contains(self.classes.isOpen)) {
          self.elm.classList.remove(self.classes.isOpen);
        } else {
          self.elm.classList.toggle(self.classes.isActive);
        }
      });

      // When the submit button is clicked, forward the message to WhatsApp.
      $submitButton.addEventListener(
        "click",
        function () {
          var messageInput = document.querySelector("." + self.classes.messageInput);
          var messageContent = messageInput.value;

          if (messageContent.length === 0) {
            messageContent = self.config.defaultMessage;
          }

          window.open(
            "https://api.whatsapp.com/send?phone=" + self.config.phone + "&text=" + encodeURI(messageContent)
          );
        },
        false
      );
    },
  };

  WhatsButton.defaults = WhatsButton.prototype.defaults;

  $.fn.whatsbutton = function (options) {
    return this.each(function () {
      new WhatsButton(this, options).init();
    });
  };

  window.WhatsButton = WhatsButton;
})(jQuery, window, document);
