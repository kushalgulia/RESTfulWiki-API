const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));


mongoose.connect('mongodb://localhost:27017/wikiDB');
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Article = mongoose.model('article', articleSchema);




app.route('/articles')
  .get((req, res) => {
    Article.find({}, (err, foundArticles) => {
      if (!err) {
        res.send(foundArticles)
      } else {
        res.send(err)
      }
    })
  })
  .post((req, res) => {
    article = new Article({
      title: req.body.title,
      content: req.body.content
    })
    article.save((err) => {
      if (!err) {
        res.send('Successfully added an article')
      } else {
        res.send(err)
      }
    })
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err) {
        res.send("Successfully deleted all articles")
      } else {
        res.send(err)
      }
    })
  });


app.route('/articles/:articleTitle')
  .get((req, res) => {
    Article.findOne({
      title: req.params.articleTitle
    }, (err, foundArticle) => {
      if (!err) {
        if (foundArticle) {
          res.send(foundArticle)
        } else {
          res.send("No such article")
        }
      } else {
        res.send(err)
      }
    })

  })
  .put((req, res) => {
    Article.findOneAndUpdate({
      title: req.params.articleTitle
    }, {
      title: req.body.title,
      content: req.body.content
    }, {
      overwrite: true //defualt value :false
      //completely replaces the document with provided fields
      //->when false monogoose uses $set which only updates the provided fields
    }, (err) => {
      if (!err) {
        res.send("Update Successfully")
      } else {
        res.send(err)
      }
    })
  })
  .patch((req, res) => {

    Article.findOneAndUpdate({
      title: req.params.articleTitle
    }, {
      $set: req.body
    }, err => {
      if (!err) {
        res.send("Successfully updated article")
      } else {
        res.send(err)
      }
    })
  })
  .delete((req, res) => {
    Article.findOneAndDelete({
      title: req.params.articleTitle
    }, err => {
      if (!err) {
        res.send("Article Deleted Successfully")
      } else {
        res.send(err)
      }
    })
  });


app.listen('3000', () => {
  console.log('Server started on port 3000');
})