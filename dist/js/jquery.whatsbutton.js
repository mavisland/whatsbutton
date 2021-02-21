(function ($) {
  $.fn.whatsbutton = function (options) {
    var settings = $.extend(
      {
        name: "Tanju Yildiz",
        avatar: "https://avatars.githubusercontent.com/u/119868?s=128",
        status: "online",
        showStatus: true,
        welcomeMessage: "Hello there! Use this box to send me a message via WhatsApp...",
        message: "Hello, I want to get information about your products.",
        phone: "",
        placeholder: "Type here...",
        position: "right",
        autoOpenPopup: true,
        autoOpenPopupTimeout: 5000,
      },
      options
    );

    var _this = this;
    _this.addClass("whatsbutton");

    var wb = $(".whatsbutton");
    wb.addClass("is-" + settings.position);

    // Append Toggle Button
    wb.append('<div class="wb-toggle-button"></div>');
    var toggleButton = wb.find(".wb-toggle-button");

    // Append Unread Messages Badge
    toggleButton.append('<span class="wb-unread-badge">1</span>');
    var toggleBadge = toggleButton.find(".wb-unread-badge");

    // Append Chat Screen
    wb.append('<div class="wb-chat"></div>');
    var chat = wb.find(".wb-chat");

    // Append Dialog Screen Header
    chat.append('<header class="wb-chat-header"></header>');
    var chatHeader = chat.find(".wb-chat-header");

    // Append User Avatar
    chatHeader.append('<div class="wb-user-object"><img src="' + settings.avatar + '" class="wb-user-avatar"></div>');

    // Append User Name
    chatHeader.append(
      '<div class="wb-user-body"><strong class="wb-user-name">' +
        settings.name +
        "</strong>" +
        (settings.showStatus ? '<small class="wb-user-status">' + settings.status + "</small>" : "") +
        "</div>"
    );

    // Append Dialog Screen Body
    chat.append('<main class="wb-chat-body"></main>');
    var chatBody = chat.find(".wb-chat-body");

    chatBody.append('<ul class="wb-message-list"></ul>');
    var messageList = chat.find(".wb-message-list");

    messageList.append('<li class="wb-message-list-item">' + settings.welcomeMessage + "</li>");

    // Append Dialog Screen Footer
    chat.append('<footer class="wb-chat-footer"></footer>');
    var chatFooter = chat.find(".wb-chat-footer");

    chatFooter.append('<input type="text" class="wb-message-input" placeholder="' + settings.placeholder + '">');
    var messageInput = chatFooter.find(".wb-message-input");

    chatFooter.append('<div class="wb-send-button"></div>');
    var sendButton = chatFooter.find(".wb-send-button");

    setTimeout(function () {
      toggleBadge.show();
    }, 1500);

    if (settings.autoOpenPopup && !wb.hasClass("is-active")) {
      setTimeout(function () {
        wb.addClass("is-active otomatik");
      }, settings.autoOpenPopupTimeout);
    }

    toggleButton.on("click", function () {
      wb.toggleClass("is-active");
    });

    sendButton.on("click", function () {
      if (messageInput.val().length > 0) {
        var content = messageInput.val();
      } else {
        var content = settings.message;
      }

      window.open("https://api.whatsapp.com/send?phone=" + settings.phone + "&text=" + encodeURI(content));
    });
  };
})(jQuery);
