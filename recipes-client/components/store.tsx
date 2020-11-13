import { configureStore } from '@reduxjs/toolkit'
import recipeReducer from '~components/recipe-slice'

export default configureStore({
  reducer: {
    counter: recipeReducer
  }
})