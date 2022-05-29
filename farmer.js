var express = require('express');

// create an app
var app = express();
const bp = require('body-parser');
// model
var Chunk = require('./model/chunk');

//model 2
var Chunk1 = require('./model/chunk1');
//model 3
var Chunk2 = require('./model/Chunk2');
//model 4
var Chunk3 = require('./model/chunk3');
// instantiate jwt
var jwt = require('jsonwebtoken')
//require dotenv
require('dotenv').config()
// stripe
const stripe = require('stripe')(process.env.STRIPE_API_KEY)
//moongoose 1
var moongoose = require('mongoose');
// bcrypt
var bcrypt = require('bcrypt')
//mongoClient
var MongoClient = require('mongoclient');
//connect to database
var dbURI = 'mongodb+srv://mato:mato123@444marichu.7bmjg.mongodb.net/farmers?retryWrites=true&w=majority';
moongoose.connect(dbURI, { usenewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('connection is successful');
        app.listen(3000);
    }).catch((err) => {
        console.log(err);
    })


// require file system
var fs = require('fs');
const router = express.Router();
const path = require('path');
const { stringify } = require('querystring');
const { exit } = require('process');
const { chunk } = require('lodash');
const Data = require('../../../Users/MARTIN/NODE/marichu/models/data');
// set
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

var database;
var taip;


router.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));

})
    .get('/signup.html', (req, res) => {
        res.sendFile(path.join(__dirname + '/signup.html'));
    })
    .get('/signup2.html', (req, res) => {
        res.sendFile(path.join(__dirname + '/signup2.html'));
    })
    .get('/martin.html', (req, res) => {
        res.sendFile(path.join(__dirname + '/martin.html'));
    })
    .get('/martin1.html', (req, res) => {
        res.sendFile(path.join(__dirname + '/martin1.html'));
    });
app.post('/submittt', async (req, res) => {
    const passw = req.body.password;
    const emai = req.body.email;
    const emma = emai.toString();

    console.log(passw);
    console.log(emai);

    Chunk.find()
        .then(async (result) => {
            for (i = 0; i < result.length; i++) {
                var validy = await bcrypt.compare(passw, result[i].password);

                if (result[i].email === emma) {
                    console.log("/");
                    console.log(emma);
                    console.log(result[i].email);
                    console.log(result[i].password);
                    console.log("/");
                    if (validy === true || passw === result[i].password) {
                        console.log("we have found a match");
                        console.log(validy);
                        res.render('home', { Data: result[i].email });
                        break;
                        exit;
                    } else {
                        console.log("we have not found a match");
                        res.redirect('/martin1.html');
                    }
                }
            }

        })
        .catch((err) => {
            console.log(err);
        })
    // authentication
    var user = { name: passw };
    var accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    database = accesstoken;
    authenticateToken();
});
app.post('/submit', async (req, res) => {
    var pass = req.body.password;
    console.log(pass);

    var hashed = await bcrypt.hash(pass, 10)

    console.log(hashed);
    var email = [req.body.email];
    var war = email.toString();
    console.log(war);
    Chunk.find()
        .then((result) => {
            for (var i = 0; i < result.length; i++) {
                if (result[i].email === war) {
                    console.log("user already exists");
                    console.log(result[i].email);
                    console.log(war)
                    res.redirect('/martin.html')
                    break;

                }
            }
            console.log(req.body);
            req.body.password = hashed;
            console.log(req.body);
            // new object    
            var news = new Chunk(req.body);
            news.save()
                .then((result) => {
                    res.sendFile(path.join(__dirname + '/index.html'));
                })
                .catch((err) => {
                    console.log(err);
                });
        })


});
app.post('/submitt', async (req, res) => {
    var passo = req.body.password;
    console.log(passo);
    var wara = req.body.email;

    hashed = await bcrypt.hash(passo, 10);
    console.log(hashed);

    Chunk.find()
        .then((result) => {
            for (var i = 0; i < result.length; i++) {
                if (result[i].email === wara) {
                    res.redirect('/martin.html');
                    break;
                }
            }
        })
        .catch((err) => {
            console.log(err);
        });
    var newa = req.body;
    newz = new Chunk(newa);
    newz.save()
        .then((result) => {
            res.redirect('\index.ejs');
        })
        .catch((err) => {
            console.log(err);
        })
})
// admin
app.get('/sadmin', (req, res) => {
    res.render('admin');
})
// sign up admin
app.post('/sadmin', (req, res) => {
    var mkulima = new Chunk3(req.body);
    mkulima.save()
        .then((result) => {
            res.render('admin');
        }).catch((err) => {
            console.log(err);
        })
});
// login admin
app.get('/getAdmin', (req, res) => {

    Chunk3.find()
        .then((result) => {
            res.redirect('/upload');
        }).catch((err) => {
            console.log(err);
        })
})
app.get('/marto', (req, res) => {
    res.render('martin');
})
// upload to the buy database
app.post('/bought/:id', async (req, res) => {
    const id = req.params.id;

    Chunk1.findById(id)
        .then(async(result) => {
            console.log(result);

            var pur = {
                type: result.type,
                quantity: result.quantity,
                description: result.description
            }
            const storeItems =new Map([result]);

            try {
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    mode: 'payment',
                    line_items : req.body.items.map(item => {
                        const itemId = storeItems.get(item._id);
                        return {
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    names: item.description
                                },
                                unit_amount: 10000
                            },
                            quantity: item.quantity
                        }
                    })
                })
                

            } catch (e) {
                console.log(e.message);
            }
            console.log(pur);
            var brandy = new Chunk2(pur);
            brandy.save()
                .then((result) => {
                    res.json({url:session.url});
                }).catch((err) => {
                    console.log(err);
                })
        }).catch((err) => {
            console.log(err);
        })



});
// delete from database
app.delete('/getProduce/:id', (req, res) => {
    const id = req.params.id;
    Chunk1.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/home' })
        })
        .catch((err) => {
            console.log(err);
        });
})

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname + '/home.html'));
});
app.post('/all-produce', (req, res) => {
    console.log(req.body);
    var kimoja = new Chunk1(req.body);
    kimoja.save()
        .then((result) => {
            // res.write('Data has been successfully saved');     
            res.redirect('/manage');
        }).catch((err) => {
            console.log(err);
        })
});
//forgot password route
app.get('/forget', (req, res) => {
    Chunk.find()
        .then((result) => {
            res.render('forget', { Data: result });
        }).catch((err) => {
            console.log(err);
        })

});

//forgot password handler
app.post('/forgotten', (req, res) => {
    const ema = [req.body.email];
    var waraka = ema.toString();
    console.log(waraka);
    Chunk.find()
        .then((result) => {
            //console.log(result);
            for (var i = 0; i < result.length; i++) {
                if (result[i].email === waraka) {
                    console.log(result[i]);
                    console.log(result[i].password);
                    res.render('forget', { Data: result[i] });
                }
            }
        }).catch((err) => {
            console.log(err);
        })
});
// upload a produce
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname + '/create.html'));
});
// all products
app.get('/manage', (req, res) => {
    Chunk1.find()
        .then((result) => {
            res.render('adetails', { Data: result });
        }).catch((err) => {
            console.log(err);
        })
})
//search 
app.get('/search', (req, res) => {

    Chunk1.find()
        .then((result) => {
            res.render('details', { Data: result });
        }).catch((err) => {
            console.log(err);
        })

});
app.get('/getProduce/:id', (req, res) => {
    const hello = new Chunk1(req.body);
    const id = req.params.id;
    res.render('details', { Data: hello });


})
// app.get('/purchased', (req, res) => {
//     Chunk2.find()
//         .then((result) => {
//             res.render('search', { Data: result });
//         }).catch((err) => {
//             console.log(err);
//         })
// })
app.get('/all-produce', (req, res) => {
    res.redirect('/upload');
});
// contact us
app.get('/contact', (req, res) => {
    res.render('contact');
});
// about us
app.get('/about', (req, res) => {
    res.render('/about');
});
// search for bought produce
app.post('/productSearch', (req, res) => {
    const search = [req.body.search];
    var sting = search.toString();
    console.log(sting);
    var thisA = new Array();
    Chunk1.find()
        .then((result) => {
            for (var i = 0; i < result.length; i++) {
                if (result[i].type === sting) {

                    console.log(result[i].type)
                    thisA.push(result[i]);

                }
            }
            res.setHeader('Content-type', 'text/html');
            res.render('search', { Data: thisA });
        }).catch((err) => {
            console.log(err);
        })



});
//search for produce
app.post('/getProduce', (req, res) => {
    const search = [req.body.search];
    var sting = search.toString();
    console.log(sting);
    var thisA = new Array();
    Chunk1.find()
        .then((result) => {
            for (var i = 0; i < result.length; i++) {
                if (result[i].type === sting) {
                    console.log(result[i].type)
                    thisA.push(result[i]);


                }
            }
            res.setHeader('Content-type', 'text/html');
            res.render('details', { Data: thisA });
        }).catch((err) => {
            console.log(err);
        })
});
//login
// app.post('/submittt',(req,res)=>{

//   var passw= req.body.password;
//   var em=req.body.email;
//   console.log(passw);
//     Chunk.find()
//    .then( async (result)=>{    
//    //  console.log(result);
//    for (i=0;i<result.length;i++){    
//        if(result[i].email===em){
//            console.log(result[i].email);
//            console.log(em);
//           if( await bcrypt.compare(result[i].password,passw)){
//             console.log("a match has been found")
//             res.redirect('/home');
//             break;
//           } else{
//             res.sendFile(path.join(__dirname+'/martin1.html'));
//           }
//        }
//    }

//    })
//    .catch((err)=>{
//        console.log(err);
//    })
//    //    jwt authentication
// //    create the object user
// var user ={ name: passw};
// var accesstoken= jwt.sign(user,process.env.ACCESS_TOKEN_SECRET); 
// database = accesstoken;
// authenticateToken();


// });

function authenticateToken(req, res) {
    console.log(database);
    var token = database;
    if (token == null) return res.sendStatus(401, "Token is null");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("auth verification successful");
        }


    })

}


app.get('/', (req, res) => {
    res.redirect('/index')
})

app.use('/', router);

