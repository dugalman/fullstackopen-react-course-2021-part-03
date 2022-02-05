const listHelper = require('../utils/list_helper')
const { listWithOneBlog, listOfBlogs } = require('./test_helper')

test('dummy returns one', () => {
    const result = listHelper.dummy([])
    expect(result).toBe(1)
})

describe('Total Like', () => {

    test('of empty list is zero', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })

    test('when list has only one blog equals the likes of that', () => {
        expect(listHelper.totalLikes(listWithOneBlog)).toBe(5)
    })

    test('of a bigger list is calculated right', () => {
        expect(listHelper.totalLikes(listOfBlogs)).toBe(36)
    })
})

describe('favorite Blog', () => {

    test('of empty list is zero', () => {
        expect(listHelper.favoriteBlog([])).toEqual({})
    })

    test('when list has only one blog equals the likes of that', () => {
        expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(listWithOneBlog[0])
    })

    test('of a bigger list is calculated right', () => {
        expect(listHelper.favoriteBlog(listOfBlogs)).toEqual(listOfBlogs[2])
    })
})


describe('most Blogs', () => {

    test('of empty list is zero', () => {
        expect(listHelper.mostBlogs([]).blogs).toBe(0)
        expect(listHelper.mostBlogs([]).author).toBe('')
    })

    test('when list has only one blog equals the likes of that', () => {
        expect(listHelper.mostBlogs(listWithOneBlog).blogs).toBe(1)
        expect(listHelper.mostBlogs(listWithOneBlog).author).toBe('Edsger W. Dijkstra')
    })

    test('of a bigger list is calculated right', () => {
        expect(listHelper.mostBlogs(listOfBlogs).blogs).toBe(3)
        expect(listHelper.mostBlogs(listOfBlogs).author).toBe('Robert C. Martin')
    })
})


describe('most Likes', () => {

    test('of empty list is zero', () => {
        const result = listHelper.mostLikes([])
        expect(result.likes).toBe(0)
        expect(result.author).toBe('')
    })

    test('when list has only one blog equals the likes of that', () => {
        expect(listHelper.mostLikes(listWithOneBlog).likes).toBe(5)
        expect(listHelper.mostLikes(listWithOneBlog).author).toBe('Edsger W. Dijkstra')
    })

    test('of a bigger list is calculated right', () => {
        expect(listHelper.mostLikes(listOfBlogs).likes).toBe(17)
        expect(listHelper.mostLikes(listOfBlogs).author).toBe('Edsger W. Dijkstra')
    })
}) 