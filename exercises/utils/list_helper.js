const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0
        ? 0
        : blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlog_oldSchool = (blogs) => {
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

    return blogs.reduce( (prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    }) 
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}

