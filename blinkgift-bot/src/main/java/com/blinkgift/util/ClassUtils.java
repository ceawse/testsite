package com.blinkgift.util;

import com.blinkgift.telegram.Bot;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.telegram.telegrambots.meta.api.methods.ParseMode;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.updatingmessages.EditMessageText;
import org.telegram.telegrambots.meta.api.objects.CallbackQuery;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@UtilityClass
public class ClassUtils {

    private Integer messageIdToReply;
    private static final Map<Long, Integer> adminMessageIds = new ConcurrentHashMap<>();

    private static final List<Long> ADMIN_IDS = List.of(
            1342062477L,
            1152098143L,
            1526314726L
    );

    public static void sendFormToAdmins(CallbackQuery query, String adminMessage, Bot bot, InlineKeyboardMarkup markup) {
        for (Long adminId : ADMIN_IDS) {
            try {
                if (query == null) {
                    SendMessage message = new SendMessage();
                    message.setChatId(adminId.toString());
                    message.setText(adminMessage);
                    message.disableWebPagePreview();
                    message.setParseMode(ParseMode.MARKDOWN);
                    message.setReplyMarkup(markup);

                    Message sentMessage = bot.execute(message);
                    adminMessageIds.put(adminId, sentMessage.getMessageId());
                }
                else {
                    Integer messageId = adminMessageIds.get(adminId);
                    if (messageId == null) {
                        SendMessage message = new SendMessage();
                        message.setChatId(adminId.toString());
                        message.setText(adminMessage);
                        message.disableWebPagePreview();
                        message.setParseMode(ParseMode.MARKDOWN);
                        message.setReplyMarkup(null);

                        Message sentMessage = bot.execute(message);
                        adminMessageIds.put(adminId, sentMessage.getMessageId());
                        continue;
                    }

                    String originalText = query.getMessage().toString();
                    String updatedText = originalText + "\n\n" + adminMessage;

                    EditMessageText editMessage = new EditMessageText();
                    editMessage.setChatId(adminId.toString());
                    editMessage.setMessageId(messageId);
                    editMessage.setText(updatedText);
                    editMessage.setReplyMarkup(null);
                    editMessage.setParseMode(ParseMode.MARKDOWN);

                    bot.execute(editMessage);
                }
            } catch (TelegramApiException e) {
                log.error("Не удалось отправить анкету админу " + adminId, e);
                if (e.getMessage().contains("message to edit not found")) {
                    adminMessageIds.remove(adminId);
                }
            }
        }
    }
}
