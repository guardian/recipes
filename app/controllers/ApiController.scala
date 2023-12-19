package controllers

import auth.PanDomainAuthentication
import com.gu.pandomainauth.PublicSettings
import config.Config
import play.api.Logging
import play.api.mvc._
import play.api.libs.json.Json
import java.util.Map
import ujson._
import os._

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
    val data: String = ""
    Ok(Json.parse(data))
  }

  def schema() = Action {
    val schema: String = ujson.read(os.read(os.pwd / "shared" / "model.json")).toString()
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

  def dbRaw(id: String) = Action {
    val key_to_get = MMap(config.hashKey -> new AttributeValue(id)).asJava;
    def request(tableName: String) = new GetItemRequest()
        .withKey(key_to_get)
        .withTableName(tableName);
    val rawData = dbClient.getItem(request(config.rawRecipesTableName)).getItem();
    if (rawData == null) {
      NotFound("No recipe with %s: '%s'.".format(config.hashKey, id))
    } else {
      Ok(Json.parse(ItemUtils.toItem(rawData).toJSON()));
    }
  }

  def get_list() = Action {
    // Get a list of recipes

    val partition_alias = "#p";
    val expressionAttributeValues = MMap(partition_alias -> config.hashKey).asJava;

    def scanRequest(tableName: String) = new ScanRequest()
        .withTableName(tableName)
        .withProjectionExpression("%s, title, contributors, byline, canonicalArticle, isAppReady".format(partition_alias))
        .withExpressionAttributeNames(expressionAttributeValues);

    val rawResult = dbClient.scan(scanRequest( config.rawRecipesTableName ));
    val rawResultData = ItemUtils.toItemList(rawResult.getItems()).asScala

    val curatedResult = dbClient.scan(scanRequest( config.curatedRecipesTableName ));
    val curatedResultData = ItemUtils.toItemList(curatedResult.getItems()).asScala

    val combinedData = rawResultData.filter( i => !curatedResultData.exists( _.getString(config.hashKey) == i.getString(config.hashKey) ) ) ++ curatedResultData

    combinedData.foreach( i => {
      val id = i.getString(config.hashKey)
      val isInCuratedTable = if (curatedResultData.exists( _.getString(config.hashKey) == id )) {
        true
      } else {
        false
      }
      i.withBoolean("isInCuratedTable", isInCuratedTable)
    })

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
