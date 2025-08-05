const Image = require("@11ty/eleventy-img")
const htmlmin = require("html-minifier-terser");

// A helper function to make the shortcode syntax cleaner
async function imageShortcode(src, alt, sizes) {
    // The options object for Eleventy Image
    let metadata = await Image(src, {
        widths: [300, 600, 900], // Create images at these widths
        formats: ["webp", "jpeg"], // Create WebP and JPEG formats
        outputDir: "./public/img/", // Save processed images here
    })

    // The attributes for the generated <img> tag
    let imageAttributes = {
        alt,
        sizes,
        loading: "lazy",
        decoding: "async",
    }

    // Let the plugin generate the full <picture> element HTML
    return Image.generateHTML(metadata, imageAttributes)
}

module.exports = function (eleventyConfig) {
    // Passthrough copy for assets
    eleventyConfig.addPassthroughCopy("src/style.css")
    eleventyConfig.addPassthroughCopy("src/assets")

    // Register our new async shortcode
    eleventyConfig.addAsyncShortcode("image", imageShortcode);

    eleventyConfig.addTransform("htmlmin", function (content) {
        if ((this.page.outputPath || "").endsWith(".html")) {
            let minified = htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
                minifyCSS: true,
                removeRedundantAttributes: true,
                removeAttributeQuotes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                minifyJS: true,
                removeOptionalTags: true
            });

            return minified;
        }

        // If not an HTML output, return content as-is
        return content;
    });

    return {
        dir: {
            input: "src",
            output: "public",
            includes: "_includes",
            data: "_data"
        }
    }
}
