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

    let max = { likes: 0 }

    for (let i = 0; i < blogs.length; i++) {
        if (max.likes < blogs[i].likes) {
            max = blogs[i]
        }
    }

    return max
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}

