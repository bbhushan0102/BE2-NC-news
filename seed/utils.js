exports.createRefObj = (data, docs) => {
  return data.reduce((acc, datum, i) => {
    acc[datum.username] = docs[i]._id;
    return acc;
  }, {});
};
exports.formatArticleData = (articleData, userRefObj) => {
  return articleData.map(articleDatum => {
    return {
      ...articleDatum,
      created_by: userRefObj[articleDatum.created_by],
      belongs_to: articleDatum.topic
    };
  });
};

exports.createArticleObj = (data, docs) => {
  console.log(docs);
  return data.reduce((acc, datum, i) => {
    acc[datum.title] = docs[i]._id;
    return acc;
  }, {});
};

exports.formatCommentData = (commentData, articleDocs, userRefObj) => {
  return commentData.map(commentDatum => {
    return {
      ...commentDatum,
      created_by: userRefObj[commentDatum.created_by],
      belongs_to: articleDocs.find(
        article => commentDatum.belongs_to === article.title
      )._id
    };
  });
};
