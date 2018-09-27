process.env.NODE_ENV = "test";
const data = require("../seeds/testData/index.js");
const { seedDB } = require("../seeds/seed.js");
const { expect } = require("chai");
const app = require("../app.js");
const request = require("supertest")(app);
const mongoose = require("mongoose");

describe("/api", () => {
  let topics, articles;

  beforeEach(function() {
    return seedDB(data).then(docs => {
      [topics, articles] = docs;
    });
  });

  after(() => mongoose.disconnect());

  describe("/articles", () => {
    it("GET returns an array of articles objects and 200 status code", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.have.length(articles.length);
        });
    });
    it("/:articles_id - GET returns the requested actor and 200 status code", () => {
      return request
        .get(`/api/articles/${articles[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.articles.name).to.equal(articles[0].name);
        });
    });
  });
});
