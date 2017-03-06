module.exports = function (app, passport) {

  //model
  var Category = require('./models/category');

  var Product = require('./models/product');

  //取得user model
  var User = require('./models/user');

  var Stripe = require('stripe')('sk_test_ZPTLcTtpDPvz3ZNkLt707GU4');


  // 因為ag2所以只回傳index.html
  // app.get('/', function (req, res) {
  //   // res.send('my first server');
  //   console.log("req.session in /");
  //   console.log(req.session);
  //   if (req.session.passport.user) {
  //     res.send("Hello ,user:" + req.session.passport.user);
  //   } else {
  //     res.send("logout successful!");
  //   }
  // });

  //localhost:3000/api/productName
  app.get('/about', function (req, res) {
    console.log(req.session);
    res.send('my about page');
  });

  app.post('/addCategory', function (req, res) {
    var category = new Category();
    category.name = req.body.name;

    category.save(function (err, category) {
      res.json({
        category: category
      });
    });
  });

  // 取得所有產品分類
  app.get('/categories/all', function (req, res) {
    Category.find({}, function (error, categories) {
      if (error) {
        return res.
        status(status.INTERNAL_SERVER_ERROR).
        json({
          error: error.toString()
        });
      }
      console.log("categories got!");
      res.json({
        categories: categories
      });
    });
  });

  //用category id取得對應products
  app.get('/products/:id', function (req, res, next) {
    Product
      .find({
        category: req.params.id
      })
      // 將category path替換成對應的資料
      .populate('category')
      .exec(function (err, products) {
        if (err) return next(err);
        // 取到資料就回傳json
        res.json({
          products: products
        });
      });
  });

  //取得所有product
  app.get('/productsall/', function (req, res) {
    //空{}代表傳回Category下所有document
    Product.find({})
      .populate('category')
      .exec(function (error, products) {
        if (error) {
          return res.status(500).
          json({
            error: error.toString()
          });
        }
        res.json({
          products: products
        });
        // res.json(products);
      });
  });

  // 用product_id找product
  app.get('/product/:id', function (req, res) {
    Product.findById({
      _id: req.params.id
    }, function (err, product) {
      if (err) return next(err);
      //回傳json
      res.json({
        product: product
      });
    })
  });



  //取出User的Cart資料 (for <cart>)
  app.get('/cart', function (req, res, next) {
    // 利用req.user._id去DB比對是否有此user
    User.findOne({
        _id: req.user._id
      })
      //因為product的type為ObjectId所以要populate
      .populate('data.cart.product')
      .exec(function (err, user) {
        if (err) return next(err);
        res.json({
          user: user
        });
      });
  });

  // 更新購物車內容
  app.put('/updateCart', function (req, res, next) {
    User.findById({
      clientID: req.body.clientID
    }, function (err, user) {
      user.data.cart.push({
        //put傳來的
        product: req.body.item.productid,
        quantity: parseInt(req.body.item.quantity),
        subtotal: parseInt(req.body.item.subtotal)
      });
      // req.body內為JSON，是string(透過bodyParser處理)
      user.data.totalValue += parseInt(req.body.item.subtotal);
      user.save(function (err, user) {
        if (err) return next(err);
        // 回傳save後的user
        return res.json({
          user: user
        });
      });
    });
  });

  app.post('/remove', function (req, res, next) {
    User.findOne({
      // 有登入的傳進來的req會帶有user資料(req.user)
      _id: req.user._id
    }, function (err, foundUser) {
      // 利用ObjectId移除該item
      foundUser.data.cart.pull(String(req.body.itemid));
      foundUser.data.totalValue = (foundUser.data.totalValue - parseInt(req.body.subtotal));
      foundUser.save(function (err, found) {
        console.log('save');
        if (err) return next(err);
        res.json(found);
      });
    });
  });



  app.post('/payment', function (req, res) {
    Stripe.charges.create({
        // 從req.user.data去抓要charge的資料
        //Stripe的價格要用cents所以x100且四捨五入
        // for test
        amount: 777,
        // amount: Math.ceil(req.user.data.totalValue * 100),
        currency: 'usd',
        source: req.body.stripeToken, //取得stripeToken
        description: 'Example charge from kuolun'
      },
      //成功的話會拿到charge object
      function (err, charge) {
        if (err && err.type === 'StripeCardError') {
          return res.status(400).
          json({
            error: err.toString()
          });
        }
        if (err) {
          return res.status(500).
          json({
            error: err.toString()
          });
        }
        // 清空購物車
        // req.user.data.cart = [];
        // req.user.data.totalValue = 0;
        // req.user.save(function() {
        //     // 成功的話回傳id及狀態
        //     return res.json({
        //         id: charge.id,
        //         status: charge.status
        //     });
        // });
        // // for test
        res.send("charge success!");
      });
  });


  /**
   * add new user from Auth0
   */
  app.post('/newUser', function (req, res, next) {
    var profile = req.body;
    //用email看是否user已存在DB
    User.findOne({
      email: profile.email
    }, function (err, user) {
      //如果有錯就回傳錯誤
      if (err) {
        console.log('DB error');
        throw err;
      }
      //如果user已存在DB，不處理
      if (user) {
        // console.log('user already exist in DB');
        // return res.json({ existedUser: user });
        // res.send({ warn: 'user already exist in DB!' });
        res.json({
          savedUser: user
        });
      } else {
        //沒找到就新增一筆存到DB
        var newUser = new User();
        //profile是Auth0回傳的資訊
        newUser.clientID = profile.clientID;
        newUser.email = profile.email;
        newUser.profile.username = profile.name;
        newUser.profile.picture = profile.picture;
        //把新user存到DB
        newUser.save(function (err, user) {
          if (err) {
            console.log('save error');
            throw err;
          }
          return res.json({
            savedUser: user
          });
        });
      }
    });
  });

  /**
   * check user in DB
   */
  app.get('/checkDBUser/:email', function (req, res, next) {
    User.findOne({
      email: req.params.email
    }, function (err, user) {
      if (err) return next(err);
      res.json({
        user: user
      });
    });
  });





  app.get('*', function (req, res) {
    // res.send('Page Not found!');
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });


};
