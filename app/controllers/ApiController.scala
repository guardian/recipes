package controllers

import auth.PanDomainAuthentication
import com.gu.pandomainauth.PublicSettings
import config.Config
import play.api.Logging
import play.api.mvc._
import play.api.libs.json.Json
import java.util.Map

import scala.collection.immutable.{Map => MMap}
import scala.jdk.CollectionConverters._
import com.amazonaws.client.builder.AwsClientBuilder
import com.amazonaws.services.dynamodbv2.{AmazonDynamoDB, AmazonDynamoDBClientBuilder}
import com.amazonaws.auth.AWSCredentialsProvider
import com.amazonaws.services.dynamodbv2.model.GetItemRequest
import com.amazonaws.services.dynamodbv2.model.PutItemRequest
import com.amazonaws.services.dynamodbv2.model.AttributeValue
import com.amazonaws.services.dynamodbv2.document.ItemUtils
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression
import com.amazonaws.services.dynamodbv2.model.QueryRequest
import play.api.libs.json.JsPath
import java.util.ArrayList

import com.amazonaws.services.dynamodbv2.document.Item
import com.amazonaws.services.dynamodbv2.model.ScanRequest
import com.amazonaws.services.dynamodbv2.model.ScanResult
import model.Recipe
import com.amazonaws.services.dynamodbv2.document.DynamoDB
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

  val dbClient = if (config.dbUrl == null || config.dbUrl.isEmpty) {
    AmazonDynamoDBClientBuilder.standard()
      .withCredentials(config.awsCredentials)
      .build()
  } else {
    AmazonDynamoDBClientBuilder.standard()
      .withCredentials(config.awsCredentials)
      .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(config.dbUrl, "eu-west-1"))
      .build()
  }

  // Endpoint functions
  def postId(id: String): Action[AnyContent] = Action { implicit request =>
    (for {
      json <- request.body.asJson
      maybeRecipe <- Recipe.parseRecipe(json)
      } yield maybeRecipe
    ) match {
      case None =>
        logger.error(s"Failed to parse recipe ${id}")
        InternalServerError("Failed to parse recipe")
      case Some(recipe) =>
        val item = ItemUtils.fromSimpleMap(
          Item.fromJSON(Json.toJson(recipe).toString()).asMap()
        );

        val request: PutItemRequest = new PutItemRequest()
          .withTableName(config.curatedRecipesTableName)
          .withItem(item);

        val response = dbClient.putItem(request);
        Ok(s"Recipe ${recipe.id} successfully parsed")
    }

  }

  def index(id: String) = Action {
    val data: String = """{
    "id": "superUniqueRecipeId1",
    "canonicalArticle": "food/2019/mar/02/yotam-ottolenghi-north-african-recipes-tunisian-pepper-salad-moroccan-chicken-pastilla-umm-ali-pudding"
    "title": "Grilled pepper salad with fresh cucumber and herbs",
    "description": "A simple, fresh salad that can be served as a side or a main",
    "serves": {
      "amount": {
        "min": 4,
        "max": 4
      },
      "unit": "people"
    },
    "timings": [
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
    "instructions": [
			{
				"stepNumber": 1,
				"description": "Espresso is ideal, because you want the coffee to have as intense a flavour as possible, but if you don’t have the wherewithal at home, a strongly brewed cafetiere, moka or filter pot, or even a cup of instant, will do, as will a takeaway from your favourite coffee shop if you don’t.",
				"images": [
					"https://i.guim.co.uk/img/media/d16236d4a8333e1ee2aeba3d6d551e6b2a36bf82/874_952_5055_5052/master/5055.jpg?width=620&quality=85&fit=max&s=772c5a231bb63bab36fa26e5491ea6b5"
				]
			},
			{
				"stepNumber": 2,
				"description": "Separate the eggs into two large, clean bowls – you’ll be beating the whites into a foam, so it’s important they’re not contaminated with any yolk, which might interfere with the process. As such, I’d advise cracking each white into a small bowl first, so you can make sure of this before you add it to the larger bowl."
			},
			{
				"stepNumber": 3,
				"description": "Whisk the whites until they form stiff, rather than droopy peaks – you should be able to hold the bowl upside down with confidence, though be careful when testing this. (Don’t be tempted to keep whisking after they reach this stage, because they’ll quickly start to break down into a watery mess, and you’ll need to whisk in a fresh white to get them back.) Set aside.",
				"images": [
					"https://i.guim.co.uk/img/media/73469f6ffea172d74eaee006493540b9e4253879/0_633_7442_6217/master/7442.jpg?width=620&quality=85&fit=max&s=b5579f9f24abb11a26d03c72359c6b3e"
				]
			}
		],
    "byline": "Yotam Ottolenghi",
    "ingredients": [
    	{
			"recipeSection": "Sauce",
          	"ingredientsList": [
          		{
        			"name": "Carrot",
          			"amount": {
                    	"min": 2,
                        "max": 2
                    },
          			"unit": "items",
          			"ingredientId": "carrot",
          			"prefix": "large",
          			"suffix": "chopped",
          			"optional": false
        		}
          ]
		  }
    ],
    "celebrationIds": "summer-food-and-drink",
    "cuisineIds": [
      "north-african/moroccan",
      "middleeastern",
      "indian"
    ],
    "mealTypeIds": "main-course",
    "featuredImage": "https://media.guim.co.uk/5eb266e966f8aa7c74f449804d13ee3b57eb81d6/1_0_3356_3355/1000.jpg"
  }"""
    Ok(Json.parse(data))
  }

  def schema() = Action {
    val schema: String = """{
    "type": "object",
    "required": [
        "id"
    ],
    "properties": {
        "isAppReady": {
            "type": "boolean"
        },
        "id": {
            "type": "string"
        },
        "canonicalArticle": {
            "type": ["string", "null"]
        },
        "composerId": {
            "type": ["string", "null"]
        },
        "webPublicationDate": {
            "type": ["string", "null"]
        },
        "title": {
            "type": ["string", "null"]
        },
        "description": {
            "type": ["string", "null"]
        },
        "serves": {
          "type": "array",
          "items": {
              "type": "object",
              "properties": {
                "amount": {
                  "type": "object",
                  "properties": {
                    "min": {
                      "type": "integer"
                    },
                    "max": {
                      "type": "integer"
                    }
                  },
                  "required": [
                    "min",
                    "max"
                  ]
                },
                "unit": {
                  "type": "string"
                },
                "text": {
                  "type": "string"
                }
              },
              "required": [
                "amount",
                "unit"
              ]
            }
        },
        "featuredImage": {
            "type": ["string", "null"]
        },
        "timings": {
          "type": "array",
          "items": {
              "type": "object",
              "properties": {
                "qualifier": {
                  "type": "string",
                  "enum": [
                    "prep-time",
                    "cook-time",
                    "set-time"
                  ]
                },
                "durationInMins": {
                  "type": "integer"
                },
                "text": {
                  "type": "string"
                }
              },
              "required": [
                "qualifier",
                "durationInMins"
              ]
            }
        },
        "instructions": {
          "type": "array",
          "items": {
              "type": "object",
              "properties": {
                "stepNumber": {
                  "type": "integer"
                },
                "description": {
                  "type": "string"
                },
                "images": {
                  "type": "array",
                  "items": [
                    {
                      "type": "string"
                    }
                  ]
                }
              },
              "required": [
                "stepNumber",
                "description"
              ]
            }
        },
        "contributors": {
            "type": "array",
            "items": {
                "type": "string",
                "enum": [
                  "Felicity Cloake",
                  "Meera Sodha",
                  "Holly O'Neill",
                  "Andrei Lussmann",
                  "Yotam Ottolenghi",
                  "Nigel Slater",
                  "Jack Monroe",
                  "Thomasina Miers",
                  "Rukmini Iyer",
                  "Ed Cumming",
                  "Andrei Lussman",
                  "Anna Jones",
                  "Rachel Roddy",
                  "Sally Clarke",
                  "Nigella Lawson",
                  "Giuseppe Dell’Anno",
                  "Katie Cross"
                ]
            }
        },
        "byline": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "ingredients": {
            "type": "array",
            "items":
              {
                "type": "object",
                "properties": {
                  "recipeSection": {
                    "type": ["string", "null"]
                  },
                  "ingredientsList": {
                    "type": "array",
                    "items":
                      {
                        "type": "object",
                        "properties": {
                          "name": {
                            "type": "string"
                          },
                          "amount": {
                            "type": "object",
                            "properties": {
                              "min": {
                                "type": "integer"
                              },
                              "max": {
                                "type": "integer"
                              }
                            },
                            "required": [
                              "min",
                              "max"
                            ]
                          },
                          "unit": {
                            "type": "string"
                          },
                          "ingredientId": {
                            "type": "string"
                          },
                          "prefix": {
                            "type": "string"
                          },
                          "suffix": {
                            "type": "string"
                          },
                          "optional": {
                            "type": "boolean"
                          },
                          "text": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "name"
                        ]
                      }

                  }
                },
                "required": [
                  "ingredientsList"
                ]
              }
          },
        "celebrationIds": {
            "type": [
                "array",
                "null"
            ],
            "items": {
                "minItems": 0,
                "type": [
                    "string",
                    "null"
                ],
                "enum": [
                    null,
                    "christmas",
                    "boxing-day",
                    "new-years-eve",
                    "thanksgiving",
                    "veganuary",
                    "burns-night",
                    "chinese-new-year",
                    "valentines-day",
                    "pancake-day",
                    "mothers-day",
                    "holi",
                    "ramadan",
                    "easter",
                    "st-patricks-day",
                    "eid",
                    "passover",
                    "birthday",
                    "bank-holiday",
                    "fathers-day",
                    "halloween",
                    "diwali",
                    "bonfire-night",
                    "hanukkah",
                    "rosh-hashanah",
                    "yom-kippur"
                ]
            }
        },
        "cuisineIds": {
            "type": ["array", "null"],
            "items": {
                "minItems": 1,
                "type": ["string", "null"],
                "enum": [
                    null,
                    "nordic",
                    "italian",
                    "mexican",
                    "indian",
                    "french",
                    "chinese",
                    "thai",
                    "japanese",
                    "british",
                    "greek",
                    "spanish",
                    "middle-eastern",
                    "eastern-european",
                    "african",
                    "vietnamese",
                    "korean",
                    "filipino",
                    "irish",
                    "jamaican",
                    "brazilian",
                    "scandinavian",
                    "australian",
                    "turkish",
                    "south-east-asian",
                    "sri-lankan",
                    "american",
                    "south-american",
                    "caribbean",
                    "portuguese"
                ]
            }
        },
        "mealTypeIds": {
          "type": ["array", "null"],
          "items": {
              "type": [
                  "string",
                  "null"
              ],
              "enum": [
                  "breakfast",
                  "brunch",
                  "lunch",
                  "dinner",
                  "snack",
                  "dessert",
                  "drink",
                  "starter"
              ]
            }
        },
        "suitableForDietIds": {
            "type": ["array", "null"],
            "items": {
                "type": ["string", "null"],
                "enum": [
                    "vegetarian",
                    "vegan",
                    "pescatarian",
                    "gluten-free",
                    "dairy-free"
                ]
            }
        },
        "utensilsAndApplianceIds": {
            "type": ["array", "null"],
            "items": {
                "type": ["string", "null"],
                "enum": [
                    "air-fryer"
                ]
            }
        },
        "techniquesUsedIds": {
            "type": ["array", "null"],
            "items": {
                "type": ["string", "null"],
                "enum": [
                    "baking",
                    "marinating"
                ]
            }
        },
        "difficultyLevel": {
            "type": ["string", "null"],
            "enum": [
                    "easy",
                    "medium",
                    "hard"
                ]
        }
    }
}
"""
    Ok(Json.parse(schema))
  }

  def db(id: String) = Action {

    val key_to_get = MMap(config.hashKey -> new AttributeValue(id)).asJava;

    def request(tableName: String) = new GetItemRequest()
        .withKey(key_to_get)
        .withTableName(tableName);

    val rawData = dbClient.getItem(request(config.rawRecipesTableName)).getItem();
    val curatedData = dbClient.getItem(request(config.curatedRecipesTableName)).getItem();

    val dataToReturn = if (curatedData != null) {
      curatedData
    } else {
      rawData
    }

    if (dataToReturn == null) {
      NotFound("No recipe with %s: '%s'.".format(config.hashKey, id))
    } else {
      Ok(Json.parse(ItemUtils.toItem(dataToReturn).toJSON()));
    }
  }

  def get_list() = Action {
    // Get a list of recipes

    val partition_alias = "#p";
    val expressionAttributeValues = MMap(partition_alias -> config.hashKey).asJava;

    def scanRequest(tableName: String) = new ScanRequest()
        .withTableName(tableName)
        .withProjectionExpression("%s, title, contributors, canonicalArticle, isAppReady".format(partition_alias))
        .withExpressionAttributeNames(expressionAttributeValues)
        .withLimit(60);

    val rawResult = dbClient.scan(scanRequest( config.rawRecipesTableName ));
    val rawResultData = ItemUtils.toItemList(rawResult.getItems()).asScala

    val curatedResult = dbClient.scan(scanRequest( config.curatedRecipesTableName ));
    val curatedResultData = ItemUtils.toItemList(curatedResult.getItems()).asScala

    val combinedData = rawResultData.filter( i => !curatedResultData.exists( _.getString(config.hashKey) == i.getString(config.hashKey) ) ) ++ curatedResultData

      val response = Json.toJson(combinedData.map(
        i => Json.parse(i.toJSON())
      ))
      Ok(response);

  }


  def list(id: String) = Action {
    // List all recipes available for `id`
    val partition_alias = "#p";
    val recipes_key = MMap(partition_alias -> config.hashKey).asJava;
    val recipes_to_get = MMap(":"+config.hashKey -> new AttributeValue("/"+id)).asJava;

    val queryExpression = new QueryRequest()
      .withTableName(config.rawRecipesTableName)
      .withKeyConditionExpression(partition_alias+ " = :id")
      .withExpressionAttributeNames(recipes_key)
      .withExpressionAttributeValues(recipes_to_get)

    val recipeResult = dbClient.query(queryExpression)

    if (recipeResult == null) {
      NotFound("No recipe with %s: '%s'.".format(config.hashKey, id))
    } else {
      val data = ItemUtils.toItemList(recipeResult.getItems()).asScala

      val response = Json.toJson(data.map(
        i => Json.parse(i.toJSON())
      ))
      Ok(response);
    }
  }
}
