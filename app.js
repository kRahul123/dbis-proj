var express    = require("express");
var bodyParser=require('body-parser');
var connection=require('./config/mysql_setup.js');
var app = express();
var expressValidators = require('express-validator');
var cookieParser=require('cookie-parser');
var jsonParser = bodyParser.json()
//authentication packages
var session=require('express-session');
var bcrypt = require('bcrypt');
var passport=require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);
var options={
  host     : 'localhost',
  user     : 'root',
  password : '2020',
  database : 'company_review'
};
var sessionStore = new MySQLStore(options);

const saltRounds = 10;
app.use(expressValidators());
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set('view engine','ejs');
app.use(cookieParser());
app.use(session({
  secret: 'iami',
  resave: false,
  store:sessionStore,
  saveUninitialized: false,
  //cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
  res.locals.isAuthenticated=req.isAuthenticated();
  next();
});

passport.use('local',new LocalStrategy(


  function(username, password, done) {
    console.log(username);
    console.log(password);

      return done(null,true);
  }
));



app.get('/:company_name/review',function(req,res){
  c=req.params.company_name;
  connection.query('select * from company where company_name=?',[c],function(err,result,field){

    res.render('review',{c:result,errors:""});
  });
});

app.get('/:company_name/edit',authenticationMiddleware(),function(req,res){
    c=req.params.company_name;
    console.log(c);
    connection.query('select * from company where company_name=?',[c],function(err,result,fields){
      res.render('edit',{c:result,errors:""});
    });
});

app.post('/edit',urlencodedParser,authenticationMiddleware(),function(req,res){
  //res.send('khksjdh');
  console.log(req.body);
  var c_name=req.body.c_name;
  var job=req.body.j_title;
  var salary=req.body.salary;
  var r_title=req.body.r_title;
  var pros=req.body.pros;
  var cons=req.body.cons;
  var overall_rating=req.body.rating;
  var c_status=req.body.options;
  var user_id=req.user;


  connection.query('select c_id from company where company_name=?',[c_name],function(err,result,fields){
    var c_id=result[0].c_id;
    connection.query('call find_review_id(?,?)',[c_id,user_id],function(err,result,fields){
      var review_id=result[0][0].review_id;
      connection.query('update review set overall_rating=?,salary=?,review_title=?,pros=?,cons=? where review_id=?',[overall_rating,salary,r_title,pros,cons,review_id],function(err,result){
        if(err) console.log(err);
      });
      connection.query('update company_review set company_id=? where review_id=?',[c_id,review_id],function(err,result){
        if(err) console.log(err);
      });
      res.render('success_reg',{msg:'Update Successful'});
    });
  });

});



app.get('/:company_name/delete',authenticationMiddleware(),function(req,res){
  c=req.params.company_name;
  //console.log(c);
  connection.query('select c_id from company where company_name=?',[c],function(err,result,fields){
    var c_id=result[0].c_id;
    var user_id=req.user;
    connection.query('call find_review_id(?,?)',[c_id,user_id],function(err,result,fields){
      var review_id=result[0][0].review_id;
      //console.log(review_id,user_id,c_id);
      connection.query('call delete_review(?,?,?)',[user_id,c_id,review_id],function(err,result){
        if(err) console.log(err);
        else {
          res.render('success_reg',{msg:'Deleted Successfully'});
        }
      });
    });
  });
});

app.get('/home',authenticationMiddleware(),function(req,res){
  connection.query('select * from company order by avg_rating desc limit 3',function(err,result,fields){
    res.render('home',{company:result});
  });
});
app.get('/register',function(req,res){


  res.render('register',{errors:"",msg:""});

})

app.post('/register',urlencodedParser,function(req,res){
  req.checkBody('username', 'Username field cannot be empty.').notEmpty();
  req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
  req.checkBody('firstName', 'firstname field cannot be empty.').notEmpty();
  req.checkBody('email', 'email field cannot be empty.').notEmpty();
  req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
  req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
  req.checkBody('password', 'Password must be between 4-100 characters long.').len(4, 100);req.checkBody('password', 'Password must be between 4-100 characters long.').len(4, 100);
  req.checkBody('cpassword', 'confirm Password must be between 4-100 characters long.').len(4, 100);
  req.checkBody('cpassword', 'Passwords do not match, please try again.').equals(req.body.password);

  const error=req.validationErrors();
  if(error){
    console.log(error);
    res.render('register',{errors : error,msg:""});
  }
  else{

  var username=req.body.username;
  var first_name=req.body.firstName;
  var lastname=req.body.lastName;
  var email=req.body.email;
  var ph=req.body.phone_no;
  var password=req.body.password;
  var cpassword=req.body.cpassword;




bcrypt.hash(password, saltRounds, function(err, hash) {
  connection.query('call new_user(?,?,?,?,?,?)',[first_name,lastname,username,email,ph,hash],function(err,result){
    if(err){

      const msg='username or email already taken try another!!';

      res.render('register',{errors:"",msg:msg});
    }
    else {
      connection.query('select last_insert_id() as user_id',function(error,result,fields){
        //console.log(result[0]);
        const user_id=result[0];
        req.login(user_id,function(err){

          res.redirect('/home');
        });
      });

    }
  });
});
}
});


app.get('/login',function(req,res){
  res.render('login',{msg:""});
//  console.log(req.user);
  //console.log(req.isAuthenticated());
});
app.post('/login',urlencodedParser,function(req,res) {
  //console.log(req.body);

  var username=req.body.username;
  var password=req.body.password;
  connection.query('select * from user where user_name=?',[username],function(error,result,fields){
    if(result.length>0){
      var user_id=result[0].user_id;
      var hash=result[0].p_word;
      //console.log(hash);

      bcrypt.compare(password,hash,function(err,response){
        if(response===true){
          req.login(user_id,function(err){
            res.redirect('/home');
            //console.log(req.user);
          });
        }
        else{
          res.render('login',{msg:'Incorrect password'});
        }
      });



    }
    else{
      res.render('login',{msg:'Username does not exist'});
    }

  });

});

app.get('/logout',function(req,res){
  req.logout();
  req.session.destroy();
  res.render('success_reg',{msg:'Logged Out'});
});

app.get('/my_review',authenticationMiddleware(),function(req,res){
  var user_id=req.user;
  connection.query('call my_rating(?)',[user_id],function(err,result,fielsd){
    //console.log(result);
    res.render('my_review',{company:result});
  });
});
app.get('/review',authenticationMiddleware(),function(req,res){
  var result=[{
    c_id: null,
    company_name: '',
    contact_no: '',
    address: '',
    c_domain: '',
    avg_rating: null,
    avg_salary: null }]
  res.render('review',{c:result,errors:""});
});
app.post('/review',urlencodedParser,function(req,res){

  req.checkBody('domain', 'Domain must be 2-30 character long').len(2, 30);
  req.checkBody('j_title', 'job title must be 4-30 character long ').len(4,30);
  req.checkBody('pros', 'pros should be less than 200 character').len(0,200);
  req.checkBody('cons', 'cons should be less than 200 character').len(0,200);
  req.checkBody('r_title', 'review title should be less than 80 character').len(4,80);

  const error=req.validationErrors();
  if(error){
    var result=[{
      c_id: null,
      company_name: '',
      contact_no: '',
      address: '',
      c_domain: '',
      avg_rating: null,
      avg_salary: null }]

    res.render('review',{c:result,errors : error});
  }
  else{


  var c_name=req.body.c_name;
  var phone=req.body.phone.toString();
  var address=req.body.address;
  var domain=req.body.domain;
  var job=req.body.j_title;
  var salary=req.body.salary;
  var r_title=req.body.r_title;
  var pros=req.body.pros;
  var cons=req.body.cons;
  var overall_rating=req.body.rating;
  var c_status=req.body.options;
  var user_id=req.user;
connection.query('select user_id from worked_in,company where worked_in.company_id=company.c_id and company_name=?',[c_name],function(err,result,fields){
  var flag=false;
  //console.log(result);
  //console.log(user_id);
  for(i=0;i<result.length;i++){
    if(result[i].user_id===req.user) flag=true;
  }
  //console.log(flag);
  if(flag===true){
    res.render('success_reg',{msg:'you have already reviewed this company'});
  }
  else{
    connection.query('select c_id from company where company_name=?',[c_name],function(err,result,fields){
      //console.log(result);

      var c_id;
      if(result.length===0){
        connection.query('call new_company(?,?,?,?)',[c_name,phone,address,domain],function(err,result){
          if(err) throw err;
        });
        connection.query('select last_insert_id() as c_id',function(err,result,fields){

          c_id=result[0].c_id;
          connection.query('insert into worked_in values(?,?,?,?)',[user_id,c_id,c_status,job],function(err,result){
            if(err) throw err;
            //console.log('1');
          });
          connection.query('call new_review(?,?,?,?,?)',[overall_rating,salary,r_title,pros,cons],function(err,result){
            if(err) throw err;
            //console.log('2');
          });
          connection.query('select last_insert_id() as r_id',function(err,result,fields){

            var r_id=result[0].r_id;
            //console.log(c_id);
            connection.query('insert into company_review values(?,?)',[c_id,r_id],function(err,result){
              if(err) throw err;
            //  console.log('l');
            });
            connection.query('insert into user_review values(?,?)',[user_id,r_id],function(err,result){
              if(err) throw err;
            //  console.log('h');
            });

          });
        });
        res.render('success_reg',{msg:'reviewed successfully'});

      }
      else{
        c_id=result[0].c_id;
        connection.query('insert into worked_in values(?,?,?,?)',[user_id,c_id,c_status,job],function(err,result){
          if(err) throw err;
          //console.log('1');
        });
        connection.query('call new_review(?,?,?,?,?)',[overall_rating,salary,r_title,pros,cons],function(err,result){
          if(err) throw err;
          //console.log('2');
        });
        connection.query('select last_insert_id() as r_id',function(err,result,fields){

          var r_id=result[0].r_id;
          //console.log(c_id);
          connection.query('insert into company_review values(?,?)',[c_id,r_id],function(err,result){
            if(err) throw err;
            //console.log('l');
          });
          connection.query('insert into user_review values(?,?)',[user_id,r_id],function(err,result){
            if(err) throw err;
            //console.log('h');
            res.render('success_reg',{msg:'reviewed successfully'});
          });

        });
      }

    });
  }
});

}
});







passport.serializeUser(function(user_id, done) {

  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {

    done(null,user_id );

});




function authenticationMiddleware () {
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/login')
	}
}


app.listen(3000);
