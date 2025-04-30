import data from '@/lib/data'
import { connectToDatabase } from '.'
import Product from './models/product.model'
import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import User from './models/user.model'
import Review from './models/review.model'
import { faker } from '@faker-js/faker'

loadEnvConfig(cwd())

const main = async () => {
  try {
    const { products, users, reviews } = data
    await connectToDatabase(process.env.MONGODB_URI)

    //User
    await User.deleteMany()
    const createdUser = await User.insertMany(users)
    
    //Product
    await Product.deleteMany()
    const createdProducts = await Product.insertMany(products)
    
    //Review
    await Review.deleteMany()
    const rws = []
    for (let i = 0; i < createdProducts.length; i++) {
      let x = 0
      const { ratingDistribution } = createdProducts[i]
      for (let j = 0; j < ratingDistribution.length; j++) {
        const rating = j + 1
        const reviewsForRating = reviews.filter((r) => r.rating === rating)
        for (let k = 0; k < ratingDistribution[j].count; k++) {
          x++
          const reviewSample = reviewsForRating[x % reviewsForRating.length]
          const user = createdUser[x % createdUser.length]
          rws.push({
            ...reviewSample,
            isVerifiedPurchase: true,
            product: createdProducts[i]._id,
            user: user._id,
            createdAt: faker.date.past({ years: 1 }),
            updatedAt: Date.now(),
          })
        }
      }
    }
    const createdReviews = await Review.insertMany(rws)
    
    console.log({
      createdUser,
      createdProducts,
      createdReviews,
      message: 'Seeded database successfully',
    })
    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('Failed to seed database')
  }
}

main()