/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const ChatbotQueriesCtrl = require('../../controllers/ChatbotQueriesCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/admin/chatbot/query/create', ChatbotQueriesCtrl.postChatbotQryCreate);
  app.post('/swit/admin/chatbot/queries/list', ChatbotQueriesCtrl.getChatbotQrsList);
  app.post('/swit/admin/chatbot/status/update', ChatbotQueriesCtrl.postChatbotStatusUpdate);
  app.post('/swit/admin/chatbot/msg/update', ChatbotQueriesCtrl.postChatbotMsgUpdate);
  app.get('/swit/admin/chatbot/lfcs/list/:id', ChatbotQueriesCtrl.getChatbotLfcsList);

};
