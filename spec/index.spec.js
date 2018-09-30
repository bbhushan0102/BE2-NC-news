process.env.NODE_ENV = "test";
const data = require("../seed/testData/index.js");
const seedDB = require("../seed/seed.js");
const { expect } = require("chai");
const app = require("../app");
const request = require("supertest")(app);
const mongoose = require("mongoose");

describe("/api", function() {
  let topics, articles, users, comments;
  this.timeout(3000);
  beforeEach(function() {
    return seedDB(data).then(docs => {
      [users, topics, articles, comments] = docs;
    });
  });

  after(() => mongoose.disconnect());

  describe("/articles", () => {
    it("GET returns an array of articles objects and 200 status code", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("array");
          expect(res.body.articles.length).to.equal(articles.length);
          expect(res.body.articles[0].comments).to.equal(2);
          expect(res.body.articles[0]).to.haveOwnProperty("comments");
          expect(res.body.articles[0]).to.include.keys(
            "title",
            "body",
            "belongs_to",
            "created_by",
            "created_at",
            "_id",
            "votes",
            "__v",
            "comments"
          );
        });
    });
  });

  describe("/articles/:article_id", () => {
    it("GET returns object with article by id and returns a 200 status", () => {
      return request
        .get(`/api/articles/${articles[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.article.comments).to.equal(2);
          expect(res.body.article).to.include.keys(
            "title",
            "body",
            "belongs_to",
            "created_by",
            "votes",
            "created_at",
            "_id",
            "comments"
          );
          expect(res.body.article._id);
        });
    });
    it("Get returns an error 404 if article id does not exist", () => {
      return request
        .get(`/api/articles/${mongoose.Types.ObjectId()}`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("404 page not found");
        });
    });

    it("PATCH change a article vote by one up or down ", () => {
      return request
        .patch(`/api/articles/${articles[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(1);
        });
    });
    it("PATCH returns an error 404 if comment id does not exist", () => {
      return request
        .get(`/api/articles/${mongoose.Types.ObjectId()}?vote=up`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("404 page not found");
        });
    });
    it("PATCH change a article vote by one up or down ", () => {
      return request
        .patch(`/api/articles/${articles[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(-1);
        });
    });
    it("PATCH returns an error 404 if comment id does not exist", () => {
      return request
        .get(`/api/articles/${mongoose.Types.ObjectId()}?vote=down`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("404 page not found");
        });
    });
  });

  describe("/articles/:article_id/comments", () => {
    it("GET 200 returns comments for article by id and returns a 200 status", () => {
      return request
        .get(`/api/articles/${articles[0]._id}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body.comments[0].body).to.equal(
            "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — on you it works."
          );
          expect(res.body.comments[0]).to.include.keys(
            "votes",
            "created_at",
            "_id",
            "body",
            "belongs_to",
            "created_by",
            "__v"
          );
          expect(res.body.comments.length).to.equal(2);
        });
    });
    it("Get returns an error 404 if article id does not exist", () => {
      return request
        .get(`/api/articles/${mongoose.Types.ObjectId()}/comments`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("404 page not found");
        });
    });

    it("POST a comment for article id and return a 201 status", () => {
      return request
        .post(`/api/articles/${articles[0]._id}/comments`)
        .send({
          body: "This is my new article content",
          belongs_to: articles[0]._id,
          created_by: users[0]._id
          //created_by: "bharat"
        })
        .expect(201)
        .then(res => {
          expect(res.body.comment.body).to.equal(
            "This is my new article content"
          );
        });
    });
    it("POST returns a 400 status and error message when the new object is empty", () => {
      return request
        .post(`/api/articles/${articles[0]._id}/comments`)
        .send({})
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(
            "comments validation failed: created_by: Path `created_by` is required., body: Path `body` is required."
          );
        });
    });
  });

  //start here''''''
  describe("/api/topics", () => {
    it("GET returns object with topic array and returns a 200 status", () => {
      return request
        .get("/api/topics/")
        .expect(200)
        .then(res => {
          expect(res.body.topics).to.have.length(2);
          expect(res.body.topics).to.be.an("array");
          expect(res.body.topics[0]).to.include.keys(
            "_id",
            "title",
            "slug",
            "__v"
          );
        });
    });
  });

  describe("/api/topics/:topic_slug/articles", () => {
    it("POST new Article to a topic and return 201 status successfully added", () => {
      return request
        .post(`/api/topics/mitch/articles`)
        .send({
          title: "new article",
          body: "This is my new article content",
          belongs_to: "mitch",
          created_by: users[0]._id
        })
        .expect(201)
        .then(res => {
          expect(res.body.article.title).to.equal("new article");
          expect(res.body.article.comments).to.equal(0);
          expect(res.body.article).to.include.keys(
            "votes",
            "_id",
            "comments",
            "title",
            "body",
            "belongs_to",
            "created_by"
          );
        });
    });
  });
  describe("api/topics/:topic_slug/articles", () => {
    it("GET returns all articles for a certain topic", () => {
      return request
        .get("/api/topics/mitch/articles")
        .expect(200)
        .then(res => {
          expect(res.body.topicArticles).to.be.an("array");
          expect(res.body.topicArticles).to.have.length(2);
          expect(res.body.topicArticles[0]).to.haveOwnProperty("comments");
        });
    });
    it("GET returns a status 404 when an invalid topic is requested", () => {
      return request
        .get("/api/topics/bharat/articles")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("404 page not found");
        });
    });
  });

  describe("/api/comments/:comment_id?vote=", () => {
    it("PATCH Increment the votes by one", () => {
      return request
        .patch(`/api/comments/${comments[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
          // console.log(res.body.comment.votes);
          expect(res.body.comment.votes).to.equal(1);
        });
    });
    it("PATCH returns an error 404 if comment id does not exist", () => {
      return request
        .get(`/api/comments/${mongoose.Types.ObjectId()}?vote=up`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("404 page not found");
        });
    });
    it("PATCH decrements the votes of a comment by one", () => {
      return request
        .patch(`/api/comments/${comments[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(-1);
        });
    });
    it("PATCH returns an error 404 if comment id does not exist", () => {
      return request
        .get(`/api/comments/${mongoose.Types.ObjectId()}?vote=down`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("404 page not found");
        });
    });
    it("DELETE the comment by comment id", () => {
      return request
        .delete(`/api/comments/${comments[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.msg).to.equal("Comment successfully deleted");
        });
    });
  });
  describe("/users/:username", () => {
    it("GET Returns a JSON object with the profile data for the specified user", () => {
      return request
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(res => {
          expect(res.body.user[0]).to.include.keys(
            "username",
            "name",
            "avatar_url"
          );
        });
    });
    it("GET user that doesnt exist returns an error message and a 404 status", () => {
      return request
        .get(`/api/users/${mongoose.Types.ObjectId()}`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("404 page not found");
        });
    });
  });
});

//});
