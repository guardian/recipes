import { createSlice } from '@reduxjs/toolkit'

export const recipeSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    recipe: null
  },
  reducers: {
    increment: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    }
  }
})



export const { increment, decrement, incrementByAmount } = recipeSlice.actions

export default recipeSlice.reducer
