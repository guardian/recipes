export default {
  type: "object",
  required: [],
  properties: {
    path: {
      type: "string",
    },
    recipes_title: {
      type: "string",
    },
    serves: {
      type: "string",
    },
    time: {
      type: "array",
      items: {
        type: "object",
        required: [],
        properties: {
          instruction: {
            type: "string",
          },
          quantity: {
            type: "string",
          },
          unit: {
            type: "string",
          },
        },
      },
    },
    steps: {
      type: "array",
      items: {
        type: "string",
      },
    },
    credit: {
      type: "string",
    },
    ingredients_lists: {
      type: "array",
      items: {
        type: "object",
        required: [],
        properties: {
          title: {
            type: "string",
          },
          ingredients: {
            type: "array",
            items: {
              type: "object",
              required: [],
              properties: {
                text: {
                  type: "string",
                },
                item: {
                  type: "string",
                },
                unit: {
                  type: "string",
                },
                comment: {
                  type: "string",
                },
                quantity: {
                  type: "object",
                  required: [],
                  properties: {
                    absolute: {
                      type: "string",
                    },
                    from: {
                      type: "string",
                    },
                    to: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    occasion: {
      type: "string",
    },
    cuisines: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "italian",
          "mexican",
          "southern_us",
          "indian",
          "french",
          "chinese",
          "thai",
          "cajun_creole",
          "japanese",
          "british",
          "greek",
          "spanish",
          "middleeastern",
          "eastern-european",
          "north-african/moroccan",
          "vietnamese",
          "korean",
          "filipino",
          "irish",
          "jamaican",
          "brazilian",
          "pan-african",
          "scandinavian",
          "australian",
          "turkish",
        ],
      },
    },
    meal_type: {
      type: ["string", "null"],
      enum: [
        "starter",
        "main-course",
        "dessert",
        "snacks",
        "breakfast",
        "baking",
        "barbecue",
        "side-dishes",
        "soup",
      ],
    },
    ingredient_tags: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "avocados",
          "beef",
          "bread",
          "cheese",
          "chicken",
          "chocolate",
          "duck",
          "eggs",
          "fruit",
          "lamb",
          "meat",
          "oysters",
          "pork",
          "potatoes",
          "pumpkin",
          "rice",
          "sausages",
          "seafood",
          "shellfish",
          "tomatoes",
          "wine",
        ],
      },
    },
  },
};
