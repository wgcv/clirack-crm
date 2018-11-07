const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const request = require("request");
const Inbox = require("../models/inbox");
const Conversation = require("../models/conversation");
const Message = require("../models/message");
const User = require("../models/user");
const Company = require("../models/company");
const api = require("../config/api");
const google = require("googleapis");
const googleAuth = require("google-auth-library");

const host = "https://f2646894.ngrok.io";

// Add Gmail Inbox for peronsal
router.get("/add-personal-inbox/", function(req, res) {
  User.getUserbyUsername(req.query.state, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    } else {
      if (req.query["code"]) {
        const auth = new googleAuth();
        let oauth2Client = new auth.OAuth2(
          api.gmail.client_id,
          api.gmail.client_secret,
          api.gmail.redirect_uris[0]
        );
        oauth2Client.getToken(req.query["code"], function(err, token) {
          if (err) {
            return res.json({
              success: false,
              msg: "Error while trying to retrieve access token" + err
            });
          }
          oauth2Client.credentials = token;
          Company.getCompanyByUser(user._id, (err, company) => {
            let gmail = google.gmail("v1");
            gmail.users.getProfile(
              {
                auth: oauth2Client,
                userId: "me"
              },
              function(err, profile) {
                if (err) {
                    return res.json({
                        success: false,
                        msg: "The API returned an error:" + err
                      });
                }
                if (!company) {
                  return res.json({ success: false, msg: "Company not found" });
                } else {
                  Inbox.getInboxBySourceAndUser(
                    "gmail-inbox",
                    user._id,
                    (err, inboxList) => {
                      if (
                        intersect(
                          company.inboxes,
                          inboxList.map(inbox => inbox.id)
                        ).length < 1
                      ) {
                        let name = profile.emailAddress + " - gmail";
                        let newInbox = new Inbox({
                          source: "gmail-inbox",
                          name: name,
                          slug: name.replace(/\s+/g, "").toLowerCase(),
                          team: false,
                          user: profile.emailAddress,
                          token: req.query["code"],
                          assigned: [user]
                        });
                        Inbox.addInbox(newInbox, (err, page) => {
                          if (err) {
                            return res.json({
                              success: false,
                              msg: "Faild to register the Gmail inbox"
                            });
                          } else {
                            company.inboxes.push(newInbox);
                            Company.updateCompany(company, (err, company) => {
                              if (err) {
                                return res.json({
                                  success: false,
                                  msg: "Faild to register the Gmail Inbox"
                                });
                              } else {
                                // Register the webhook
                                gmail.users.watch(
                                    {
                                      auth: oauth2Client,
                                      userId: profile.emailAddress,
                                      resource: {
                                      labelIds: ['INBOX'],
                                      topicName: 'projects/clirack-1515706224578/topics/gmail-webhook'
                                        }   
                                    }, (err, profile) => {
                                      if (err) {
                                        return res.json({
                                            success: false,
                                            msg: "The API returned an error:" + err
                                          });
                                      }
                                      req.io.sockets.to(user._id).emit('add inbox', newInbox);
                                        return res.send("<script>try {window.opener.HandlePopupResult('"+JSON.stringify(newInbox)+"');}catch (err) {}window.close();</script>");
                                    });
                                /*
                                let options = {
                                    url: 'https://graph.facebook.com/v2.11/'+req.query.id+'/subscribed_apps?client_id=1559072617503035&client_secret=46a43ca1303048b745cb3e312cff1b93&access_token='+req.query.token,
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                };
                                */
                              
                              }
                            });
                          }
                        });
                      }
                    }
                  );
                }
              }
            );
          });
        });
      } else {
        res.status(500).send("Error you need to add a param Twitter API");
      }
    }
  });
});

// For gmail Verifcation
router.get("/webhook/", function(req, res) {
  if (req.query["code"]) {
    console.log(req.query["code"]);
    res.send({ response_token: req.query["code"] });
  } else {
    res.status(500).send("Error you need to add a param Twitter API");
  }
});
// Post events
router.post("/webhook/", function(req, res) {
  console.log(req.body);
  res.send("200 OK");
});

// intersection two arrays
function intersect(a, b) {
  var d = {};
  var results = [];
  for (var i = 0; i < b.length; i++) {
    d[b[i]] = true;
  }
  for (var j = 0; j < a.length; j++) {
    if (d[a[j]]) results.push(a[j]);
  }
  return results;
}

module.exports = router;
