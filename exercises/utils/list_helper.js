const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0
        ? 0
        : blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlogVanilla = (blogs) => {
    if (blogs.length === 0) return {}

    let max = { likes: 0 }
    for (let i = 0; i < blogs.length; i++) {
        if (max.likes < blogs[i].likes) {
            max = blogs[i]
        }
    }

    return max
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return {}

    return blogs.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    })
}

function mostBlogs(blogs) {

    const max = { author: '', blogs: 0 }

    const acumulator = {}
    for (let i = 0; i < blogs.length; i++) {
        let actual = blogs[i]

        acumulator[actual.author] = (acumulator[actual.author] === undefined)
            ? 1
            : acumulator[actual.author] + 1

        if (acumulator[actual.author] > max.blogs) {
            max.blogs = acumulator[actual.author]
            max.author = actual.author
        }
    }

    return max
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}

