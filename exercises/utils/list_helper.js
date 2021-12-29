const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0
        ? 0
        : blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return {}
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}

