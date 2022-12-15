let movies = require('./data/movies')
const genres = require('./data/genres')

const { ApolloServer, gql } = require('apollo-server')

const typeDefs = gql`
    type Movie {
        id: ID!
        title: String!
        year: String!
        genre: String!
        poster: String!
    }

    type Genre {
        name: String!
    }

    input MovieInput {
        id: ID
        title: String!
        year: String!
        genre: String!
        poster: String!
    }

    input MovieFilter {
        genre: String
    }

    type Query {
        movies(filter: MovieFilter): [Movie]
        genres: [Genre]
    }

    type Mutation {
        addMovie(movie: MovieInput): Movie
        deleteMovie(id: ID!): Movie
    }
`

const getAllMovies = (filter) => {
    let filteredMovies = movies

    if (filter && filter.genre) {        
        filteredMovies = movies.filter(movie => movie.genre == filter.genre)            
    }

    return filteredMovies
}

const addMovie = (movie) => {
    movie.id = movies.length > 0 ? (Math.max.apply(Math, movies.map(movie => movie.id)) + 1) : 1
    movies.push(movie)

    return movie
}

const deleteMovie = (id) => {
    const movie = movies.find(movie => movie.id == id)
    movies = movies.filter(movie => movie.id != id)

    return movie
}

const resolvers = {
    Query: {
        movies: (_, { filter }) => getAllMovies(filter),
        genres: () => genres
    },
    Mutation: {
        addMovie: (_, { movie }) => addMovie(movie),
        deleteMovie: (_, { id }) => deleteMovie(id)
    }
}

const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    introspection: true,
    playground: true
})
const port = process.env.PORT || 8080

server.listen(port).then(({url}) => {
    console.log(`Server is running at ${url}`)
})