package controllers

import auth.PanDomainAuthentication
import com.gu.pandomainauth.PublicSettings
import config.Config
import play.api.Logging
import play.api.mvc._
import play.api.libs.json.Json


import java.util.Map;
import scala.collection.immutable.{Map => MMap};
import scala.jdk.CollectionConverters._

import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.dynamodbv2.{AmazonDynamoDB, AmazonDynamoDBClientBuilder}
import com.amazonaws.auth.AWSCredentialsProvider
import com.amazonaws.services.dynamodbv2.model.GetItemRequest
import com.amazonaws.services.dynamodbv2.model.AttributeValue
import com.amazonaws.services.dynamodbv2.document.ItemUtils
// import com.amazonaws.services.dynamodbv2.Ama
//, DynamoDB, Item, ItemCollection, QueryOutcome, Table}
// import com.amazonaws.services.dynamodbv2.spec.QuerySpec;
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

  def postId(id: String) = Action { implicit request =>
      Ok("{Request [" + request + "] for '"+id+"'.")
  }

  def index(id: String) = Action {
    val data: String = """{
    "path": "/food/2019/mar/02/yotam-ottolenghi-north-african-recipes-tunisian-pepper-salad-moroccan-chicken-pastilla-umm-ali-pudding",
    "recipe_id": "/food/2019/mar/02/yotam-ottolenghi-north-african-recipes-tunisian-pepper-salad-moroccan-chicken-pastilla-umm-ali-pudding_STUB",
    "recipes_title": "Grilled pepper salad with fresh cucumber and herbs",
    "serves": "Serves 4",
    "time": [
      {
      "instruction": "Prep",
      "quantity": "20",
      "unit": "min",
      "text": "Prep 20 min"
      },
      {
        "instruction": "Cook",
        "quantity": "40",
        "unit": "min",
        "text": "Cook 40 min"
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
    "ingredients_lists": [{
      "title": "",
      "ingredients": [{
          "text": "4 green peppers, stems removed, deseeded and flesh cut into roughly 3 cm pieces",
          "item": "green peppers",
          "unit": "",
          "comment": "stems removed deseeded and flesh cut into roughly 3 cm pieces",
          "quantity": {
            "absolute": "4",
            "from": "",
            "to": ""
          }
        },
        {
          "text": "2 red peppers, stems removed, deseeded and flesh cut into roughly 3 cm pieces",
          "item": "red peppers",
          "unit": "",
          "comment": "stems removed deseeded and flesh cut into roughly 3 cm pieces",
          "quantity": {
            "absolute": "2",
            "from": "",
            "to": ""
          }
        },
        {
          "text": "4 medium vine tomatoes (400 g), each cut into 4 wedges",
          "item": "medium vine tomatoes",
          "unit": "",
          "comment": "400 g each cut into  wedges",
          "quantity": {
            "absolute": "4",
            "from": "",
            "to": ""
          }
        },
        {
          "text": "2 small red onions, peeled and cut into roughly 3 cm pieces",
          "item": "small red onions",
          "unit": "",
          "comment": "peeled and cut into roughly 3 cm pieces",
          "quantity": {
            "absolute": "2",
            "from": "",
            "to": ""
          }
        },
        {
          "text": "1 green chilli, roughly sliced, seeds and all",
          "item": "green chilli",
          "unit": "",
          "comment": "roughly sliced seeds and all",
          "quantity": {
            "absolute": "1",
            "from": "",
            "to": ""
          }
        },
        {
          "text": "6 large garlic cloves, peeled",
          "item": "garlic",
          "unit": "cloves",
          "comment": "large   peeled",
          "quantity": {
            "absolute": "6",
            "from": "",
            "to": ""
          }
        },
        {
          "text": "90 ml olive oil",
          "item": "olive oil",
          "unit": "ml",
          "comment": "",
          "quantity": {
            "absolute": "90",
            "from": "",
            "to": ""
          }
        },
        {
          "text": "Salt and black pepper",
          "item": "black pepper",
          "unit": "",
          "comment": "Salt and",
          "quantity": {
            "absolute": "",
            "from": "",
            "to": ""
          }
        },
        {
          "text": "1\\u00bd tbsp lemon juice",
          "item": "lemon juice",
          "unit": "tbsp",
          "comment": "",
          "quantity": {
            "absolute": "1.5",
            "from": "",
            "to": ""
          }
        },
        {
          "text": "10 g parsley leaves, roughly chopped",
          "item": "parsley leaves",
          "unit": "g",
          "comment": "roughly chopped",
          "quantity": {
            "absolute": "10",
            "from": "",
            "to": ""
          }
        },
        {
          "text": "10 g coriander leaves, roughly chopped",
          "item": "coriander leaves",
          "unit": "g",
          "comment": "roughly chopped",
          "quantity": {
            "absolute": "10",
            "from": "",
            "to": ""
          }
        },
        {
          "text": "1 cucumber, peeled, deseeded and cut into 1 cm cubes",
          "item": "cucumber",
          "unit": "",
          "comment": "peeled deseeded and cut into  cm cubes",
          "quantity": {
            "absolute": "1",
            "from": "",
            "to": ""
          }
        },
        {
          "text": "\\u00be tsp urfa chilli",
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
    }],
    "occasion": "summer-food-and-drink",
    "cuisines": [
      "north-african/moroccan",
      "middleeastern",
      "indian"
    ],
    "meal_type": "main-course",
    "ingredient_tags": [
      "meat",
      "fruit",
      "cheese",
      "seafood"
    ]
  }"""
    Ok(Json.parse(data))
  }

  def schema() = Action {
    val schema: String = """{
    "type": "object",
    "required": [
        "path",
        "recipe_id"
    ],
    "properties": {
        "path": {
            "type": "string"
        },
        "recipe_id": {
            "type": "string"
        },
        "recipes_title": {
            "type": ["string", "null"]
        },
        "serves": {
            "type": ["string", "null"]
        },
        "image": {
            "type": ["string", "null"]
        },
        "time": {
            "type": ["array", "null"],
            "items": {
                "maxItems": 1,
                "minItems": 0,
                "type": ["string", "null"]
            }
        },
        "steps": {
            "type": ["array", "null"],
            "items": {
                "type": "string"
            }
        },
        "credit": {
            "type": ["string", "array"]
        },
        "ingredients_lists": {
            "type": ["array", "null"],
            "items": {
                "type": ["object", "null"],
                "required": [],
                "properties": {
                    "title": {
                        "type": "string"
                    },
                    "ingredients": {
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
          "type": ["string", "null"],
          "enum": [
              null,
              "burns-night",
              "christmas-food-and-drink",
              "christmas-food-and-drink-2018",
              "christmas-food-and-drink-2019",
              "winter-food-and-drink",
              "summer-food-and-drink",
              "spring-food-and-drink",
              "autumn-food-and-drink"
          ]
        },
        "cuisines": {
            "type": ["array", "null"],
            "items": {
                "minItems": 1,
                "type": ["string", "null"],
                "enum": [
                    null,
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
                    "turkish"
                ]
            }
        },
        "meal_type": {
          "type": ["array", "null"],
          "items": {
              "type": [
                  "string",
                  "null"
              ],
              "enum": [
                  "starter",
                  "main-course",
                  "dessert",
                  "snacks",
                  "breakfast",
                  "baking",
                  "barbecue",
                  "side-dishes",
                  "soup"
              ]
            }
        },
        "ingredient_tags": {
            "type": ["array", "null"],
            "items": {
                "type": ["string", "null"],
                "enum": [
                    "AVOCADOS",
                    "BEEF",
                    "BREAD",
                    "CHEESE",
                    "CHICKEN",
                    "CHOCOLATE",
                    "DUCK",
                    "EGGS",
                    "FRUIT",
                    "LAMB",
                    "MEAT",
                    "OYSTERS",
                    "PORK",
                    "POTATOES",
                    "PUMPKIN",
                    "RICE",
                    "SAUSAGES",
                    "SEAFOOD",
                    "SHELLFISH",
                    "TOMATOES",
                    "WINE"
                ]
            }
        }
    },
    "diet_tags": {
        "type": ["array", "null"],
        "items": {
            "type": ["string", "null"],
            "enum": [
                "vegetarian",
                "vegan",
                "meat"
            ]
        }
    }
}
"""
    Ok(Json.parse(schema))
  }

  def db(id: String) = Action {
    def isEmpty(x: String) = x == null || x.isEmpty
    logger.info("%s is null? %s".format(config.dbUrl, isEmpty(config.dbUrl).toString()))
    val dbClient = config.dbUrl match {
      case _ if isEmpty(config.dbUrl) => AmazonDynamoDBClientBuilder.standard()
                  .withCredentials(config.awsCredentials)
                  .build()
      case _ => AmazonDynamoDBClientBuilder.standard()
                  .withCredentials(config.awsCredentials)
                  .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(config.dbUrl, "eu-west-1"))
                  .build()
    }

    val key_to_get = MMap("path" -> new AttributeValue("/"+id),
                          "recipe_id" -> new AttributeValue().withN("1")
                        ).asJava;

    val request: GetItemRequest = new GetItemRequest()
      .withKey(key_to_get)
      .withTableName(config.tableName);

    val data = dbClient.getItem(request).getItem();
    if (data == null) {
      NotFound("No recipe with path: '%s' and id: '%s'.".format(id, "1"))
    } else {
      Ok(Json.parse(ItemUtils.toItem(data).toJSON()));
    }
  }
}