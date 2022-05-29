npm install bcrypt
var bcrypt = require('bcrypt')
app.post('/submit',async (req,res)=>{
    <!-- get the unhashed password from the body of the request performed -->
    var pass = req.body.password;
    <!-- unhashed password -->
    console.log(pass);
     <!-- hash the password -->
     var hashed = await bcrypt.hash(pass,10)
    <!-- log out the hashed password -->
     console.log(hashed);
    <!-- get the email from the body of the request performed -->
    var email = [req.body.email];
    var war = email.toString();
    <!-- log out the email from the request body -->
    console.log(war);
    <!-- use the moongoose function find() to traverse the database -->
    Chunk.find()
    .then((result)=>{
        <!-- loop through the result object to see whether the email in the request body is already existent in the database -->
        for(var i=0;i<result.length;i++){
            <!-- if the email is already existent, redirect to the Sign Up page with appropriate error messages-->
            if(result[i].email===war){                
                console.log(result[i].email);   
                res.sendFile(path.join(__dirname+'/martin.html'));            
                                        
            }
                        
        }
    })
    console.log(req.body);
    <!-- update the password property in the req.body object to the hashed one -->
    req.body.password=hashed;
    <!-- log out the updated req.body object to confirm the modifications on it -->
    console.log(req.body);
    // new object    
    <!-- create a new chunk called news containing the request body to be saved to the database -->
    var news= new Chunk(req.body);
    <!-- use  the moongoose funtion save to save the object to the database -->
    news.save()
    .then((result)=>{
        // res.sendFile(path.join(__dirname+'/index.html'));
        var Data = new Chunk(req.body);
        res.render('\index.ejs',{Data});
    })
    .catch((err)=>{
        console.log(err);
    });
    
});






app.post('/submitt', async (req,res)=>{
  <!-- get the password from the request body of the login form -->
  var passw= req.body.password;
  <!-- get the email from the request body of the login form -->
  var em=req.body.email;
  <!-- use the moongoose function find() to traverse the database -->
    Chunk.find()
   .then( async (result)=>{
   
   console.log(result);
   <!-- loop through the result array of objects to get a match between the email in the database and the email passed in the login form (request body) -->
   for (i=0;i<result.length;i++){
       if(result[i].email===em){
           <!-- if we have a match get compare the password in the login form and the hashed password in the database using bcrypt compare -->
          if( await bcrypt.compare(result[i].password,passw)){
              <!-- redirect to the home page -->
            res.redirect('/home');
            break;
          }
       }
   }
   <!-- if we have no match in the email passed in the login form (request body) redirect to the sign up page with appropriate error messages -->
   res.sendFile(path.join(__dirname+'/martin.html'));
    
   })
   .catch((err)=>{
       console.log(err);
   })

  
});