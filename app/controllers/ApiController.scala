package controllers

import auth.PanDomainAuthentication
import com.gu.pandomainauth.PublicSettings
import config.Config
import play.api.Logging
import play.api.mvc._
import play.api.libs.json.Json
/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */

class ApiController (
  override val controllerComponents: ControllerComponents,
  val publicSettings: PublicSettings,
  val config: Config
) extends BaseController with Logging with PanDomainAuthentication {
  /**
   * Create an Action to render an HTML page with a welcome message.
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def index(id: String) = Action {
    val data: String = """{
    "path": "/food/2019/mar/02/yotam-ottolenghi-north-african-recipes-tunisian-pepper-salad-moroccan-chicken-pastilla-umm-ali-pudding",
    "recipes_title": "Grilled pepper salad with fresh cucumber and herbs.",
    "serves": "Serves 4.",
    "time": [
      {
      "instruction": "Prep",
      "quantity": "20",
      "unit": "min"
      },
      {
        "instruction": "Cook",
        "quantity": "40",
        "unit": "min"
      }
    ],
    "steps": [
      "Heat the oven to 250 C (230 C fan)/480 F/gas 9.",
      "In a large bowl, toss together all the peppers, tomatoes, onions, chilli, garlic, four tablespoons of oil, three-quarters of a teaspoon of salt and a good grind of pepper.",
      "Spread out on two large oven trays lined with greaseproof paper and roast for about 35 minutes, stirring once or twice, or until softened and charred in places.",
      "Remove the trays from the oven and, once they\\u2019re cool enough to handle, coarsely chop the vegetables into a chunky mash and transfer to a bowl with the lemon juice, herbs, half a teaspoon of salt and a good grind of pepper.",
      "In a second bowl, toss the cucumber with the remaining two tablespoons of oil, a quarter-teaspoon of salt and a grind of pepper.",
      "To serve, spread the roast pepper mixture over a plate, pile the cucumber in the middle and sprinkle with the urfa chilli."
    ],
    "credit": "Yotam Ottolenghi",
    "ingredients_lists": {
      "title": "",
      "ingredients": [
        [
          {
            "text": "4 green peppers, stems removed, deseeded and flesh cut into roughly 3 cm pieces.",
            "item": "green peppers",
            "unit": "",
            "comment": "stems removed deseeded and flesh cut into roughly 3 cm pieces",
            "quantity": {
              "absolute": "4",
              "from": "",
              "to": ""
            }
          }
        ],
        [
          {
            "text": "2 red peppers, stems removed, deseeded and flesh cut into roughly 3 cm pieces.",
            "item": "red peppers",
            "unit": "",
            "comment": "stems removed deseeded and flesh cut into roughly 3 cm pieces",
            "quantity": {
              "absolute": "2",
              "from": "",
              "to": ""
            }
          }
        ],
        [
          {
            "text": "4 medium vine tomatoes (400 g), each cut into 4 wedges.",
            "item": "medium vine tomatoes",
            "unit": "",
            "comment": "400 g each cut into  wedges",
            "quantity": {
              "absolute": "4",
              "from": "",
              "to": ""
            }
          }
        ],
        [
          {
            "text": "2 small red onions, peeled and cut into roughly 3 cm pieces.",
            "item": "small red onions",
            "unit": "",
            "comment": "peeled and cut into roughly 3 cm pieces",
            "quantity": {
              "absolute": "2",
              "from": "",
              "to": ""
            }
          }
        ],
        [
          {
            "text": "1 green chilli, roughly sliced, seeds and all.",
            "item": "green chilli",
            "unit": "",
            "comment": "roughly sliced seeds and all",
            "quantity": {
              "absolute": "1",
              "from": "",
              "to": ""
            }
          }
        ],
        [
          {
            "text": "6 large garlic cloves, peeled.",
            "item": "garlic",
            "unit": "cloves",
            "comment": "large   peeled",
            "quantity": {
              "absolute": "6",
              "from": "",
              "to": ""
            }
          }
        ],
        [
          {
            "text": "90 ml olive oil.",
            "item": "olive oil",
            "unit": "ml",
            "comment": "",
            "quantity": {
              "absolute": "90",
              "from": "",
              "to": ""
            }
          }
        ],
        [
          {
            "text": "Salt and black pepper.",
            "item": "black pepper",
            "unit": "",
            "comment": "Salt and",
            "quantity": {
              "absolute": "",
              "from": "",
              "to": ""
            }
          }
        ],
        [
          {
            "text": "1\\u00bd tbsp lemon juice.",
            "item": "lemon juice",
            "unit": "tbsp",
            "comment": "",
            "quantity": {
              "absolute": "1.5",
              "from": "",
              "to": ""
            }
          }
        ],
        [
          {
            "text": "10 g parsley leaves, roughly chopped.",
            "item": "parsley leaves",
            "unit": "g",
            "comment": "roughly chopped",
            "quantity": {
              "absolute": "10",
              "from": "",
              "to": ""
            }
          }
        ],
        [
          {
            "text": "10 g coriander leaves, roughly chopped.",
            "item": "coriander leaves",
            "unit": "g",
            "comment": "roughly chopped",
            "quantity": {
              "absolute": "10",
              "from": "",
              "to": ""
            }
          }
        ],
        [
          {
            "text": "1 cucumber, peeled, deseeded and cut into 1 cm cubes.",
            "item": "cucumber",
            "unit": "",
            "comment": "peeled deseeded and cut into  cm cubes",
            "quantity": {
              "absolute": "1",
              "from": "",
              "to": ""
            }
          }
        ],
        [
          {
            "text": "\\u00be tsp urfa chilli.",
            "item": "urfa chilli",
            "unit": "tsp",
            "comment": "",
            "quantity": {
              "absolute": "0.75",
              "from": "",
              "to": ""
            }
          }
        ]
      ]
    },
    "occasion": "summer-food-and-drink",
    "cuisines": [
      "north-african/moroccan",
      "middleeastern",
      "indian"
    ],
    "meal_type": "main-course",
    "ingredient_tags": [
      "MEAT",
      "FRUIT",
      "CHEESE",
      "SEAFOOD"
    ]
  }"""
    Ok(Json.parse(data))
  }

  def schema() = Action {
    val schema: String = """{
    "type": "object",
    "required": [],
    "properties": {
      "path": {
        "type": "string"
      },
      "recipes_title": {
        "type": "string"
      },
      "serves": {
        "type": "string"
      },
      "time": {
        "type": "array",
        "items": {
          "type": "object",
          "required": [],
          "properties": {
            "instruction": {
              "type": "string"
            },
            "quantity": {
              "type": "string"
            },
            "unit": {
              "type": "string"
            }
          }
        }
      },
      "steps": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "credit": {
        "type": "string"
      },
      "ingredients_lists": {
        "type": "object",
        "required": [],
        "properties": {
          "title": {
            "type": "string"
          },
          "ingredients": {
            "type": "array",
            "items": {
              "type": "array",
              "items": {
                "type": "object",
                "required": [],
                "properties": {
                  "text": {
                    "type": "string"
                  },
                  "item": {
                    "type": "string"
                  },
                  "unit": {
                    "type": "string"
                  },
                  "comment": {
                    "type": "string"
                  },
                  "quantity": {
                    "type": "object",
                    "required": [],
                    "properties": {
                      "absolute": {
                        "type": "string"
                      },
                      "from": {
                        "type": "string"
                      },
                      "to": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "occasion": {
        "type": "string"
      },
      "cuisines": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "meal_type": {
        "type": "string"
      },
      "ingredient_tags": {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    }
  }"""
    Ok(Json.parse(schema))
  }
}
