const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0
        ? 0
        : blogs.reduce((sum, item) => sum + ((item.likes) ? item.likes : 0), 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return {}

    return blogs.reduce((prev, current) => {
        return ( prev.likes > ((current.likes)?current.likes:0)  ) ? prev : current
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

function mostLikes(blogs) {
    const max = { author: '', likes: 0 }

    const acumulator = {}
    for (let i = 0; i < blogs.length; i++) {
        let actual = blogs[i]

        acumulator[actual.author] = (acumulator[actual.author] === undefined)
            ? actual.likes
            : acumulator[actual.author] + actual.likes

        if (acumulator[actual.author] > max.likes) {
            max.likes = acumulator[actual.author]
            max.author = actual.author
        }
    }

    return max
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}

