const { DateTime } = require("luxon")
const CleanCSS = require("clean-css")
const { minify } = require("terser")

module.exports = function installFilters(eleventyConfig) {
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles
  })

  eleventyConfig.addNunjucksAsyncFilter(
    "jsmin",
    async function (code, callback) {
      try {
        const minified = await minify(code)
        callback(null, minified.code)
      } catch (err) {
        console.error("Terser error: ", err)
        callback(null, code)
      }
    }
  )

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "LLL dd, yyyy"
    )
  })

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd")
  })

  eleventyConfig.addFilter("keywordsFromTags", (list, filter = []) => {
    return list.filter((item) => filter.indexOf(item) == -1).join(", ")
  })

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n)
    }

    return array.slice(0, n)
  })
}
