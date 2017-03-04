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

  //FB
  // 因為strategy那邊沒有給name，所以預設是facebook
  // scope :要求更多權限
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
  }));

  // handle the callback after facebook has authenticated the user
  // 一旦user成功通過fb認證 整個session都可存取req.user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('http://localhost:4200/');
    }
  );

  // passport的logout，會把session移除
  app.get('/logout', function (req, res) {
    // provided by passport.
    req.logout();
    res.redirect('/');
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

  app.post('/updateCart', function (req, res, next) {
    User.findById({
      _id: req.user._id
    }, function (err, user) {
      user.data.cart.push({
        //put傳來的
        product: req.body.productid,
        quantity: parseInt(req.body.quantity),
        subtotal: parseInt(req.body.subtotal)
      });
      // req.body內為JSON，是string(透過bodyParser處理)
      user.data.totalValue = (user.data.totalValue + parseInt(req.body.subtotal));
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

  //Load目前登入user的購物車資料
  app.get('/me', function (req, res) {
    //check是否有user登入
    if (!req.user) {
      return res.status(401).
      json({
        error: 'User Not logged in!'
      });
    }
    //user已登入,req.user存在(FB 驗證後會回傳user資料)
    //替換user中data.cart.product資料
    req.user.populate({
      path: 'data.cart.product'
      // model: 'Product'
    }, function (error, user) {
      //錯誤處理
      if (error) {
        return res.status(500).
        json({
          error: error.toString()
        });
      } //資料找不到
      if (!user) {
        return res.status(404).
        json({
          error: 'Not found'
        });
      }
      // populate完回傳
      res.json({
        user: user
      });
    });
  });

  app.get('/logout', function (req, res) {
    // provided by passport.
    req.logout();
    res.redirect('/');
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




  app.get('*', function (req, res) {
    // res.send('Page Not found!');
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });


};
