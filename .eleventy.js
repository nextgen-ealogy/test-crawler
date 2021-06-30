const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
  const repos = require("./data/repos.json");

  // Unsorted items (in whatever order they were added)
  eleventyConfig.addCollection("innerSourceRepos", function () {
    return repos;
  });

  eleventyConfig.setTemplateFormats(["png", "md", "html", "rss", "njk", "svg", "woff", "woff2"]);

  eleventyConfig.addPassthroughCopy("css/**/*.*");
  eleventyConfig.addPassthroughCopy("javascript/*.*");

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });
};
