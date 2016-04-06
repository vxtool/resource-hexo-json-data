var util     = require('hexo-util');
var keywords = require('keyword-extractor');

hexo.extend.generator.register('json-data', hexo_generator_json_data);

function hexo_generator_json_data(site) {
  var cfg = hexo.config.hasOwnProperty('jsonData') ? hexo.config.jsonData : { posts: true },

  minify = function (str) {
		return util.stripHTML(str).trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
  },

  getKeywords = function (str) {
    return keywords.extract(str, {
      language: cfg.keywords,
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true
    }).join(' ');
  },

  posts = cfg.hasOwnProperty('posts') ? cfg.posts : {
    raw: false,
    content: false,
    title: true,
    slug: true,
    date: true,
    updated: true,
    comments: true,
    path: true,
    link: true,
    permalink: true,
    excerpt: true,
    text: true,
    categories: true,
    tags: true,
    keywords: true,
    additional: true
  },

  json = {};

  if (posts) {
    json = site.posts.sort('-date').filter(function (post) {
      return post.published;
    }).map(function (post) {
      return {
        title: posts.title ? post.title : null,
        slug: posts.slug ? post.slug : null,
        date: posts.date ? post.date : null,
        updated: posts.updated ? post.updated : null,
        comments: posts.comments ? post.comments : null,
        path: posts.path ? post.path : null,
        link: posts.link ? post.link : null,
        permalink: posts.permalink ? post.permalink : null,
        excerpt: posts.excerpt ? minify(post.excerpt) : null,
        keywords: cfg.keywords && posts.keywords ? getKeywords(minify(post.excerpt)) : null,
        text: posts.text ? minify(post.content) : null,
        raw: posts.raw ? post.raw : null,
        content: posts.content ? post.content : null,
        categories: posts.categories ? post.categories.map(function (cat) {
          return {
            name: cat.name,
            slug: cat.slug,
            permalink: cat.permalink
          };
        }) : null,
        tags: posts.tags ? post.tags.map(function (tag) {
          return {
            name: tag.name,
            slug: tag.slug,
            permalink: tag.permalink
          };
        }) : null,
        additional : posts.additional ? posts.additional : null
      };
    });
  }

  return {
    path: 'posts.json',
    data: JSON.stringify(json)
  };
}
