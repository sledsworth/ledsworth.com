const { DateTime } = require("luxon");

module.exports = function(collectionAPI) {
  collectionAPI.getFilteredByTag('posts')
    .forEach(function(post) {
      const date = DateTime.fromJSDate(post.date);
      console.log(date.startOf('day').toFormat('yyyy-LL-dd'));
  });
  return [];
};
