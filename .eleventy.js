const fs = require("fs")

const pluginNavigation = require("@11ty/eleventy-navigation")
const pluginRss = require("@11ty/eleventy-plugin-rss")
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")
const pluginInclusiveLanguage = require("@11ty/eleventy-plugin-inclusive-language")

const markdownIt = require("markdown-it")
const markdownItAnchor = require("markdown-it-anchor")
const markdownFootnotes = require("markdown-it-footnote")
const markdownAccessibleLists = require("markdown-it-accessible-lists")

const installFilters = require("./.eleventy.filters.js")

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginNavigation)
  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPlugin(pluginSyntaxHighlight)
  eleventyConfig.addPlugin(pluginInclusiveLanguage, {
    templateFormats: ["md"],
    words:
      "simply,obviously,basically,of course,clearly,just,everyone knows,however,easy",
  })

  installFilters(eleventyConfig)

  eleventyConfig.setDataDeepMerge(true)

  eleventyConfig.addLayoutAlias("post", "layouts/post.njk")

  eleventyConfig.addCollection("tagList", require("./_11ty/getTagList"))
  eleventyConfig.addCollection(
    "archiveByMonth",
    require("./_11ty/getArchiveByMonth")
  )

  eleventyConfig
    // .addPassthroughCopy("assets")
    .addPassthroughCopy("robots.txt")
    .addPassthroughCopy("humans.txt")
    .addPassthroughCopy({
      "node_modules/sledsworth.css/dist/index.css": "sledsworth.css",
    })
  // .addPassthroughCopy({
  //   "node_modules/@empatheticbot/time-elements/dist/": "js/time-elements",
  // });

  installFilters(eleventyConfig)

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  })
    .use(markdownFootnotes)
    .use(markdownItAnchor, {
      permalink: true,
      permalinkClass: "post-header-link",
      permalinkSymbol: "§",
      level: 2,
    })
    .use(markdownAccessibleLists)

  eleventyConfig.setLibrary("md", markdownLibrary.disable("code"))

  eleventyConfig.addPairedShortcode("callout", function (content) {
    console.log(content)
    return `
    <div class="callout">${content}</div>
    `
  })

  // Browsersync Overrides
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync("_site/404.html")

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404)
          res.end()
        })
      },
    },
    ui: false,
    ghostMode: false,
  })

  return {
    // templateFormats: ["md", "njk", "html", "liquid", "css"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  }
}
