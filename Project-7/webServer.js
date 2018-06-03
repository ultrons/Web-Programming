"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
var async = require('async');
// project-7: Additional modules
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require("fs");

var processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');


// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();
var cs142password = require('./cs142password.js').cs142password;

// XXX - Your submission should work without this line
var cs142models = require('./modelData/photoApp.js').cs142models;

mongoose.connect('mongodb://localhost/cs142project6');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));
// project-7: Adding express session and body parser to express
app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());


// Note-> userAuth

app.all('/:first/:second', function (request, response, next) {
  // Check if path no equal to login is not
  if (request.params.first !== 'admin') {
    if (request.session.user_id === undefined) {
      response.status(401).send();
      return;

     }
  }


  //Pass the control to the next handler
  next();
});

app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.count({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
    //response.status(200).send(cs142models.userListModel());
  User.find({}, '_id first_name last_name', function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            response.end(JSON.stringify(info));
  });
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    var id = request.params.id;
  //  var user = cs142models.userModel(id);
    User.findOne({'_id':id}, '_id first_name last_name location description occupation', function (err, info) {
         if (err) {
             // Query returned an error.  We pass it back to the browser with an Internal Service
             // Error (500) error code.
             if (info === undefined) {
                response.status(400).send(JSON.stringify(err));
                return;
             }
             response.status(500).send(JSON.stringify(err));
             return;
         }
         // We got the object - return it in JSON format.
         //response.end(JSON.stringify(info));
         response.end(JSON.stringify(info));


    });
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
    var id = request.params.id;
  //  var user = cs142models.userModel(id);
    Photo.find({'user_id':id}, '_id user_id comments file_name date_time',  function (err, photoList) {
      // var photos = [];

        if (err) {
           response.status(400).send(JSON.stringify(err));
           return;
        }
        if (photoList.length === 0) {
            response.status(400).send('Bad param ' + id);
            return;
        }

       photoList=JSON.parse(JSON.stringify(photoList));

        async.each(photoList, photoIter, allPhotosDoneCallBack);

        function photoIter (photo, photoItemDoneCallback) {
            var comments = [];
            async.each (photo.comments, commentIter, commentItemDone);

            function commentIter (comment, commentItemDoneCallback) {
               User.findOne({'_id':comment.user_id}, '_id first_name last_name', commentItemDoneCallback2);

               function commentItemDoneCallback2(err, info) {
                  if (err) {
                      if (info === undefined) {
                         response.status(400).send(JSON.stringify(err));
                         return;
                      }
                      console.error('Doing /user/'+ id, err);
                      response.status(500).send(JSON.stringify(err));
                      return;
                   } else {
                       delete comment.user_id;
                       comment.user =  JSON.parse(JSON.stringify(info));
                  }
                  commentItemDoneCallback(err);
               }
            }

            function commentItemDone (err) {
              photoItemDoneCallback(err);

            }


        }

        function allPhotosDoneCallBack (err) {
          if (err) {
             response.status(500).send(JSON.stringify(err));
             return;
          } else {
             response.end(JSON.stringify(photoList));
          }

        }
    });
});

app.get('/profile/:id', function (request, response) {
    var id = request.params.id;
    Photo.findOne({'user_id':id}, function (err, info) {
         if (err) {
             // Query returned an error.  We pass it back to the browser with an Internal Service
             // Error (500) error code.
             console.error('Doing /user/info error:', err);
             response.status(500).send(JSON.stringify(err));
             return;
         }
         // We got the object - return it in JSON format.
         User.findOne({'_id':id}, function (err, info_user) {
           if (!err) {
             if (!info) {
               info = {};
               info.file_name="NONE";

             }
             var r_info = {
                user_name:info_user.first_name+ ' ' + info_user.last_name,
                file_name: info.file_name,
                user_id: id
             };

             console.log("ProfileData", r_info);
             response.end(JSON.stringify(r_info));
           }
         });
    });
});

/////
app.get('/comments/', function (request, response) {
  var allUserData = {};
    // Get All the photos in the database and
    // remove comments from all the users except the the user matching this id
    User.find({}, function (err, userData) {
      if (err) {
         response.status(400).send(JSON.stringify(err));
         return;
      }
      userData=JSON.parse(JSON.stringify(userData));
      async.each(userData, function(user, userDoneCallback) {
      if (allUserData[user._id] === undefined ) {
         allUserData[user._id] = {};
         allUserData[user._id].photosCommented= [];
         allUserData[user._id].photosCount= 0;
         allUserData[user._id].photosCountDone= 0;
         allUserData[user._id].photosCommentsCount= 0;
      }

      Photo.find({}, '_id user_id comments file_name date_time',  function (err, photoList) {
        // var photos = [];

          if (err) {
             response.status(400).send(JSON.stringify(err));
             return;
          }

          photoList=JSON.parse(JSON.stringify(photoList));

          async.each(photoList, photoIter, allPhotosDoneCallBack);

          function photoIter (photo, photoItemDoneCallback) {
              var filteredComments= [];
              var commented = 0;
              if (photo.user_id === user._id) {
                 if (allUserData[user._id].photosCountDone === 0)  { allUserData[user._id].photosCount += 1;}
              }
              var comment_id = 0;
              async.each (photo.comments, commentIter, commentItemDone);

              function commentIter (comment, commentItemDoneCallback) {
                 if (comment.user_id === user._id) {
                   commented = 1;
                   allUserData[user._id].photosCommentsCount +=1;
                   filteredComments.push(comment);
                 } else {
                    commentItemDoneCallback(err);
                    return;
                 }
                 comment_id+=1;

                 User.findOne({'_id':comment.user_id}, '_id first_name last_name', commentItemDoneCallback2);

                 function commentItemDoneCallback2(err, info) {
                    if (err) {
                        if (info === undefined) {
                           response.status(400).send(JSON.stringify(err));
                           return;
                        }
                        console.error('Doing /user/'+ user._id, err);
                        response.status(500).send(JSON.stringify(err));
                        return;
                     } else {
                         delete comment.user_id;
                         comment.user =  JSON.parse(JSON.stringify(info));
                    }
                    commentItemDoneCallback(err);
                 }
              }

              function commentItemDone (err) {
                photoItemDoneCallback(err);
                if (commented) {
                   delete photo.comments;
                   photo.comments = filteredComments;
                   allUserData[user._id].photosCommented.push(photo);
                }
              }
          }

          function allPhotosDoneCallBack (err) {
            allUserData[user._id].photosCountDone = 1;
            if (err) {
               response.status(500).send(JSON.stringify(err));
               return;
            }
            userDoneCallback();

          }
      });
      },
        function finalDoneCallback(err) {
           response.end(JSON.stringify(allUserData));
        });
    });
});





/////
app.post('/admin/login', function(request, response) {
    var login_name = request.body.login_name;
    var password = request.body.password;
    User.findOne({'login_name':login_name}, function (err, info) {
       if (err || !info) {
          if (err === null) {
              err = {};
          }
          err.loginValid=0;
          err.passwordValid=-1;
          response.status(400).send(JSON.stringify(err));
          return;
       }
       if (!cs142password.doesPasswordMatch(info.password.hash, info.password.salt, password)) {
          if (err === null) {
              err = {};
          }
          err.loginValid=1;
          err.passwordValid=0;
          response.status(400).end("Password does NOT match!");
          return;
       }

       request.session.user_id = info._id;
       request.session.loggedIn = true;
      var  reply={_id:info._id, message: "User "+ login_name + " logged in!", first_name:info.first_name};
       reply.loginValid=1;
       reply.passwordValid=1;

       response.status(200).end(JSON.stringify(reply));
       return;
    });

});


app.post('/user', function(request, response) {
    var login_name = request.body.login_name;
    var reply = {};
    var user = {
                 login_name: request.body.login_name,
                 password: cs142password.makePasswordEntry(request.body.password),
                 first_name: request.body.first_name,
                 last_name: request.body.last_name,
                 location: request.body.location,
                 description: request.body.description,
                 occupation: request.body.occupation
    };

    // Check if the user already exists
    User.findOne({'login_name':login_name}, function (err, info) {
       if (info) {
          if (info.login_name === login_name) {
            reply.mess = "User "+ login_name + " already exists!";
            response.status(400).end(JSON.stringify(reply));
            return;
          }
       }
          console.log("DBG!!!!!");
          User.create(
            user, function (err, newUser) {
              if (err) {
                response.status(400).end("Failled create User: "+ login_name);
                return;
              }
              newUser.save( function (err) {
                 reply.user_id=newUser._id;
                 reply.mess="User "+ login_name + " created!";
                 request.session.user_id = newUser._id;
                 response.status(200).end(JSON.stringify(reply));

              }
              );
            }
          );
    });

});



app.post('/admin/logout', function(request, response) {
    var login_name = request.session.login_name;
    User.findOne({'login_name':login_name}, '_id', function (err, info) {
       if (err) {
          response.status(400).send(JSON.stringify(err));
          return;
       }
       request.session.destroy( function(err)
         { if(!err) {
             response.status(200).end("User "+ login_name + " logged Out!");
           }
         });
      request.session=null;
    });
});


app.post('/commentsOfPhoto/:photo_id', function(request, response) {
    var photo_id = request.params.photo_id;
    Photo.findOne({'_id':photo_id},  function (err, photoItem) {
      if(err) {
          response.status(400).send(JSON.stringify(err));
          return;
      } else {
         photoItem.comments = photoItem.comments.concat([{
           comment: request.body.comment,
           date_time: request.body.date_time,
           user_id: request.body.user_id
         }]);

          photoItem.save( function(err) {
               if(err) {
                   response.status(400).send(JSON.stringify(err));
                   return;
               } else {
                   response.status(200).end("Comment Post Successful!");

               }
          });

      }
    });


});

app.post('/photos/new', function (request, response) {

  processFormBody(request, response, function (err) {
    if (err || !request.file) {
        // XXX -  Insert error handling code here.
        response.status(400).send(JSON.stringify(err));
        return;
    }
    // request.file has the following properties of interest
    //      fieldname      - Should be 'uploadedphoto' since that is what we sent
    //      originalname:  - The name of the file the user uploaded
    //      mimetype:      - The mimetype of the image (e.g. 'image/jpeg',  'image/png')
    //      buffer:        - A node Buffer containing the contents of the file
    //      size:          - The size of the file in bytes

    // XXX - Do some validation here.
    // We need to create the file in the directory "images" under an unique name. We make
    // the original file name unique by adding a unique prefix with a timestamp.
    var timestamp = new Date().valueOf();
    var filename = 'U' +  String(timestamp) + request.file.originalname;

    fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
      // XXX - Once you have the file written into your images directory under the name
      // filename you can create the Photo object in the database
      Photo.create({
          file_name: filename,
          date_time: Date.now(),
          user_id: request.session.user_id,
          comments:[]
        } , function (err, newPhoto) {
          if(err) {
              response.status(400).send(JSON.stringify(err));
              return;
          } else {
              newPhoto.save(function(err) {
                  if(err) {
                    response.status(400).send(JSON.stringify(err));
                  } else {
                    response.status(200).end("Photo Post Successful!");
                  }
              });
          }
        });
      });
    });
});

////
var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


