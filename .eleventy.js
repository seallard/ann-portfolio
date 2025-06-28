const Image = require("@11ty/eleventy-img")

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
    // We no longer need to copy images manually, eleventy-img handles it.

    // Register our new async shortcode
    eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode)

    return {
        dir: {
            input: "src",
            output: "public",
            includes: "_includes",
            data: "_data"
        }
    }
}
